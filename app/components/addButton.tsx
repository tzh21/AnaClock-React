import React from 'react';
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
import styles from './addButton.module.css';

export default function AddButton() {
  const currHour: number = new Date().getHours();
  const currMinute: number = new Date().getMinutes();
  const [time, setTime] = React.useState({ hour: currHour, minute: currMinute });
  const [alarmName, setAlarmName] = React.useState('闹钟');
  const [work, setWork] = React.useState(true);

  // open 表示是否打开新建闹钟对话框
  const [open, setOpen] = React.useState(false);
  // openTip 表示是否打开提示框
  const [openTip, setOpenTip] = React.useState(false);
  // message 表示提示框的内容
  const [message, setMessage] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

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

  interface Alarm {
    time: {
      hour: number;
      minute: number;
    };
    alarmName: string;
    work: boolean;
  }

  const handleAddAlarm = () => {
    const newAlarm = {
      time,
      alarmName,
      work
    };

    const existingAlarms = JSON.parse(localStorage.getItem('alarms') || '[]');
    existingAlarms.push(newAlarm);

    const sortedAlarms = existingAlarms.sort((a: Alarm, b: Alarm) => {
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

  function seeHelp() {
    window.alert('帮助');
  }

  function seeWarning() {
    window.alert('警告');
  }

  return (
    <>
    <div className={styles.floatingContainer}>
      <div className={styles.floatingButton}>+</div>
      <div className={styles.elementContainer}>
        <span className={styles.floatElement} title='新建闹钟' onClick={handleClickOpen}>
        <i className={`material-icons ${styles.materialIcons}`} title='新建闹钟'>alarm
        </i>
        </span>
        <span className={styles.floatElement} title='帮助' onClick={seeHelp}>
        <i className={`material-icons ${styles.materialIcons}`} title='帮助'>help
        </i>
        </span>
        <span className={styles.floatElement} title='警告' onClick={seeWarning}>
        <i className={`material-icons ${styles.materialIcons}`} title='警告'>warning
        </i>
        </span>
      </div>
    </div>

    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">新建闹钟</DialogTitle>
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
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleAddAlarm} color="primary">
            确认
          </Button>
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
  </>
  );
};
