import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import AlarmItem from "./alarmItem";

interface Alarm {
    time: {
        hour: number;
        minute: number;
    };
    alarmName: string;
    work: boolean;
}

const fetchAlarms = (): Alarm[] => {
    const data = localStorage.getItem('alarms');
    return data ? JSON.parse(data) : [];
};

export default function Alarms() {
    const [alarms, setAlarms] = React.useState<Alarm[]>([]);
    const [overtime, setOvertime] = React.useState(0);    // 用于记录超时时间的状态
    const [showDialog, setShowDialog] = React.useState(false);    // 用于控制超时提示框的显示

    // editingIndex 表示当前编辑的闹钟在 alarms 数组中的索引
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

    React.useEffect(() => {
        const updateAlarms = () => setAlarms(fetchAlarms());
        window.addEventListener('alarms-updated', updateAlarms);
        updateAlarms();

        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('用户已允许通知。');
                } else if (permission === 'denied') {
                    console.log('用户拒绝通知。');
                }
            });
        }
        else if (!('Notification' in window)) {
            alert('Sorry bro, your browser is not good enough to display notification');
            return;
        }

        return () => {
            window.removeEventListener('alarms-updated', updateAlarms);
        };
    }, []);

    // 用于定时检查当前时间与alarms时间匹配的useEffect
    React.useEffect(() => {
        const interval = setInterval(() => {
            checkAlarmTime();
        }, 1000); // 每秒检查一次

        return () => clearInterval(interval);
    }, [alarms]);

    // 监听openDialog的状态，以控制计时器
    React.useEffect(() => {
        let intervalId: number | null = null;

        if (showDialog) {
            // 当showDialog为true时，启动一个定时器每秒增加overtime
            intervalId = window.setInterval(() => {
                setOvertime(prevOvertime => prevOvertime + 1);
            }, 1000) as unknown as number;
        } else {
            // 当showDialog为false时，停止计时器
            if (intervalId) {
                clearInterval(intervalId);
            }
        }

        // 组件卸载时清理定时器
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [showDialog]);

    const checkAlarmTime = () => {
        const now = new Date();
        const currHour = now.getHours();
        const currMinute = now.getMinutes();

        // 创建一个新数组以避免直接修改状态
        const updatedAlarms = alarms.map((alarm) => {
            if (alarm.work && alarm.time.hour === currHour && alarm.time.minute === currMinute) {
                // 触发通知并显示对话框
                setShowDialog(true);
                sendNotification();

                // 返回修改后的alarm对象，将work设置为false
                return { ...alarm, work: false };
            }
            // 未触发的alarm原样返回
            return alarm;
        });

        const sortedAlarms = updatedAlarms.sort((a: Alarm, b: Alarm) => {
            if (a.work !== b.work) {
                return b.work ? 1 : -1;
            }
            if (a.time.hour !== b.time.hour) {
                return a.time.hour - b.time.hour;
            }
            return a.time.minute - b.time.minute;
        });

        setAlarms(sortedAlarms);

        localStorage.setItem('alarms', JSON.stringify(sortedAlarms));
        window.dispatchEvent(new Event('alarms-updated'));
    };

    const sendNotification = () => {
        console.log('send alarm notification');

        if (Notification.permission === 'granted') {
            const notification = new Notification('闹钟提醒', {
                body: '您设置的闹钟已经超时',
                icon: '',
                dir: 'auto'
            });

            notification.onclick = () => {
                window.focus(); // 尝试将当前窗口调到前台
                notification.close();
            };

            setTimeout(() => {
                notification.close();   // 设置通知在5秒后自动关闭
            }, 10000);
        }
    };

    const toggleWork = (index: number) => {
        const newAlarms = alarms.map((alarm, i) => {
            if (i === index) {
                return { ...alarm, work: !alarm.work };
            }
            return alarm;
        });
        const sortedAlarms = newAlarms.sort((a: Alarm, b: Alarm) => {
            if (a.work !== b.work) {
                return b.work ? 1 : -1;
            }
            if (a.time.hour !== b.time.hour) {
                return a.time.hour - b.time.hour;
            }
            return a.time.minute - b.time.minute;
        });
        setAlarms(sortedAlarms);
        localStorage.setItem('alarms', JSON.stringify(sortedAlarms));
        window.dispatchEvent(new Event('alarms-updated'));
    }

    const currHour: number = editingIndex === null ? new Date().getHours() : alarms[editingIndex].time.hour;
    const currMinute: number = editingIndex === null ? new Date().getMinutes() : alarms[editingIndex].time.minute;
    const [time, setTime] = React.useState({ hour: currHour, minute: currMinute });
    const [alarmName, setAlarmName] = React.useState(editingIndex === null ? "闹钟" : alarms[editingIndex].alarmName);
    // 监听 editingIndex 的变化，并更新 time 和 alarmName
    React.useEffect(() => {
        // 当 editingIndex 改变时计算新的值
        const newHour = editingIndex === null ? new Date().getHours() : alarms[editingIndex].time.hour;
        const newMinute = editingIndex === null ? new Date().getMinutes() : alarms[editingIndex].time.minute;
        const newAlarmName = editingIndex === null ? "闹钟" : alarms[editingIndex].alarmName;

        // 更新状态
        setTime({ hour: newHour, minute: newMinute });
        setAlarmName(newAlarmName);

    }, [editingIndex]);

    // open 表示是否打开编辑闹钟对话框
    const [open, setOpen] = React.useState(false);
    // openTip 表示是否打开提示框
    const [openTip, setOpenTip] = React.useState(false);
    // message 表示提示框的内容
    const [message, setMessage] = React.useState('');

    const handleClose = () => {
        setMessage("0");
        setOpen(false);
        setOpenTip(true);
        setEditingIndex(null);
    };

    const handleDelete = () => {
        if (editingIndex === null) return;

        const newAlarms = alarms.filter((alarm, i) => i !== editingIndex);

        const sortedAlarms = newAlarms.sort((a: Alarm, b: Alarm) => {
            if (a.work !== b.work) {
                return b.work ? 1 : -1;
            }
            if (a.time.hour !== b.time.hour) {
                return a.time.hour - b.time.hour;
            }
            return a.time.minute - b.time.minute;
        });

        setAlarms(sortedAlarms);
        localStorage.setItem('alarms', JSON.stringify(sortedAlarms));
        window.dispatchEvent(new Event('alarms-updated'));
        setMessage("-1");
        setOpen(false);
        setOpenTip(true);
        setEditingIndex(null);
    }

    const handleTipClose = () => {
        setOpenTip(false);
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        const numberValue = parseInt(value);

        if (id === "hour" && (numberValue < 0 || numberValue > 23)) return;
        if (id === "minute" && (numberValue < 0 || numberValue > 59)) return;

        setTime({ ...time, [id]: numberValue });
    };

    const handleEditAlarm = () => {
        if (editingIndex === null) return;

        const newAlarms = alarms.map((alarm, i) => {
            if (i === editingIndex) {
                return {
                    ...alarm,
                    time: time,
                    alarmName: alarmName,
                    work: true
                };
            }
            return alarm;
        });
        setAlarms(newAlarms);

        const sortedAlarms = newAlarms.sort((a: Alarm, b: Alarm) => {
            if (a.work !== b.work) {
                return b.work ? 1 : -1;
            }
            if (a.time.hour !== b.time.hour) {
                return a.time.hour - b.time.hour;
            }
            return a.time.minute - b.time.minute;
        });

        localStorage.setItem('alarms', JSON.stringify(sortedAlarms));
        window.dispatchEvent(new Event('alarms-updated'));
        setMessage("1");
        setOpen(false);
        setOpenTip(true);
        setEditingIndex(null);
    }

    const updateAlarm = (index: number) => {
        setEditingIndex(index);
        setOpen(true);
    }

    const handleDialogClose = () => {
        setShowDialog(false);
        setOvertime(0);
    };

    return (<div>
        {alarms.map((alarm: Alarm, index: number) => (
            <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName}
                work={alarm.work} onToggleWork={() => toggleWork(index)}
                onUpdateAlarm={() => updateAlarm(index)} />
        ))}

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">编辑闹钟</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <TextField
                    margin="dense"
                    id="hour"
                    label="小时"
                    type="number"
                    value={time.hour}
                    inputProps={{ step: 1, min: 0, max: 23 }}
                    onChange={handleTimeChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="minute"
                    label="分钟"
                    type="number"
                    value={time.minute}
                    inputProps={{ step: 1, min: 0, max: 59 }}
                    onChange={handleTimeChange}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="闹钟名称"
                    type="text"
                    value={alarmName}
                    onChange={(e) => setAlarmName(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions style={{ justifyContent: 'space-between' }}>
                <Button onClick={handleDelete} color='error'>
                    删除
                </Button>
                <div>
                    <Button onClick={handleClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleEditAlarm} color="primary">
                        确认
                    </Button>
                </div>
            </DialogActions>
        </Dialog>

        <Snackbar
            open={openTip}
            autoHideDuration={1000}
            onClose={handleTipClose}
            message={message}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            {message === "1" ? (
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}>
                    闹钟已成功修改
                </Alert>
            ) : message === "-1" ? (
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}>
                    闹钟已删除
                </Alert>
            ) : (
                <Alert
                    severity="info"
                    variant="filled"
                    sx={{ width: '100%' }}>
                    已取消
                </Alert>
            )}
        </Snackbar>

        <Dialog open={showDialog} onClose={handleDialogClose}>
            <DialogTitle>您设置的闹钟已超时</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <TextField value={Math.floor(overtime / 3600)} label='时' sx={{ width: 100 }} inputProps={{ readOnly: true }}></TextField>
                    <div style={{ width: 8 }}></div>
                    <TextField value={Math.floor(overtime % 3600 / 60)} label='分' sx={{ width: 100 }} inputProps={{ readOnly: true }}></TextField>
                    <div style={{ width: 8 }}></div>
                    <TextField value={Math.floor(overtime % 60)} label='秒' sx={{ width: 100 }} inputProps={{ readOnly: true }}></TextField>
                </div>
            </DialogContent>
        </Dialog>
    </div>);
}
