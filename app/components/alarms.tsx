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

export default function Alarms(){
    const [alarms, setAlarms] = React.useState<Alarm[]>([]);

    // editingIndex 表示当前编辑的闹钟在 alarms 数组中的索引
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

    React.useEffect(() => {
        const updateAlarms = () => setAlarms(fetchAlarms());

        window.addEventListener('alarms-updated', updateAlarms);

        updateAlarms();

        return () => {
            window.removeEventListener('alarms-updated', updateAlarms);
        };
    }, []);

    const toggleWork = (index: number) => {
        const newAlarms = alarms.map((alarm, i) => {
            if (i === index) {
                return { ...alarm, work: !alarm.work };
            }
            return alarm;
        });
        setAlarms(newAlarms);
        const sortedAlarms = newAlarms.sort((a: Alarm, b: Alarm) => {
            // 优先根据 work 排序，work 为 true 的在前
            if (a.work !== b.work) {
                return b.work ? 1 : -1;
            }
            // 如果 work 相同，根据 hour 排序，hour 小的在前
            if (a.time.hour !== b.time.hour) {
                return a.time.hour - b.time.hour;
            }
            // 如果 hour 也相同，根据 minute 排序，minute 小的在前
            return a.time.minute - b.time.minute;
          });
        localStorage.setItem('alarms', JSON.stringify(sortedAlarms));
        window.dispatchEvent(new Event('alarms-updated'));
    }

    const currHour: number = editingIndex === null ? new Date().getHours() : alarms[editingIndex].time.hour;
    const currMinute: number = editingIndex === null ? new Date().getMinutes() : alarms[editingIndex].time.minute;
    const [time, setTime] = React.useState({ hour: currHour, minute: currMinute });
    const [alarmName, setAlarmName] = React.useState(editingIndex === null ? "闹钟" : alarms[editingIndex].alarmName);

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
        setAlarms(newAlarms);
    
        const sortedAlarms = newAlarms.sort((a: Alarm, b: Alarm) => {
          // 优先根据 work 排序，work 为 true 的在前
          if (a.work !== b.work) {
              return b.work ? 1 : -1;
          }
          // 如果 work 相同，根据 hour 排序，hour 小的在前
          if (a.time.hour !== b.time.hour) {
              return a.time.hour - b.time.hour;
          }
          // 如果 hour 也相同，根据 minute 排序，minute 小的在前
          return a.time.minute - b.time.minute;
        });
    
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
        setTime({ ...time, [id]: parseInt(value) });
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
          // 优先根据 work 排序，work 为 true 的在前
          if (a.work !== b.work) {
              return b.work ? 1 : -1;
          }
          // 如果 work 相同，根据 hour 排序，hour 小的在前
          if (a.time.hour !== b.time.hour) {
              return a.time.hour - b.time.hour;
          }
          // 如果 hour 也相同，根据 minute 排序，minute 小的在前
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

    return(<div>
        {alarms.map((alarm: Alarm, index: number) => (
            <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName}
            work={alarm.work} onToggleWork={() => toggleWork(index)}
            onUpdateAlarm={() => updateAlarm(index)}/>
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
                onChange={handleTimeChange}
                fullWidth
            />
            <TextField
                margin="dense"
                id="minute"
                label="分钟"
                type="number"
                value={time.minute}
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
    </div>);
}
