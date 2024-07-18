import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import AlarmItem from "./alarmItem";

interface Alarm {
    time: {
        hour: number;
        minute: number;
    };
    alarmName: string;
    repeat: string;
    work: boolean;
}

const fetchAlarms = (): Alarm[] => {
    const data = localStorage.getItem('alarms');
    return data ? JSON.parse(data) : [];
};

export default function Alarms(){
    const [alarms, setAlarms] = React.useState<Alarm[]>([]);

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

    const currHour: number = new Date().getHours();
    const currMinute: number = new Date().getMinutes();
    const [time, setTime] = React.useState({ hour: currHour, minute: currMinute });
    const [alarmName, setAlarmName] = React.useState('闹钟');
    const [repeat, setRepeat] = React.useState("不重复");

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
    };
    
    const handleTipClose = () => {
        setOpenTip(false);
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setTime({ ...time, [id]: parseInt(value) });
    };

    const handleEditAlarm = () => {
        const newAlarms = alarms.map((alarm, i) => {
            if (i === index) {
                return {
                    ...alarm,
                    time: time,
                    alarmName: alarmName,
                    repeat: repeat
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
    }

    const updateAlarm = (index: number) => {
        setOpen(true);
    }

    return(<div>
        {alarms.map((alarm: Alarm, index: number) => (
            <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName} repeat={alarm.repeat}
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
            <div style={{height: 7}}></div>
            <FormControl fullWidth>
                <InputLabel id="repeat-label">------</InputLabel>
                <Select
                labelId="repeat-label"
                id="repeat"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                label="重复"
                fullWidth
                >
                <MenuItem value="不重复">不重复</MenuItem>
                <MenuItem value="每天">每天</MenuItem>
                <MenuItem value="工作日">工作日</MenuItem>
                </Select>
            </FormControl>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                取消
            </Button>
            <Button onClick={handleEditAlarm} color="primary">
                确认
            </Button>
            </DialogActions>
        </Dialog>

        <Snackbar
            open={openTip}
            autoHideDuration={2000}
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
            sx={{ width: '100%' }}
            >
                闹钟已成功保存
            </Alert>
            ) : (
            <Alert
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
            >
                已取消
            </Alert>
            )}
        </Snackbar>
    </div>);
}
