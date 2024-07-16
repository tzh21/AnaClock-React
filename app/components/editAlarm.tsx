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

import AddButton from './addButton';
import { on } from 'events';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [repeat, setRepeat] = React.useState("不重复");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AddButton onClickNewAlarm={handleClickOpen} />
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
            fullWidth
          />
          <TextField
            margin="dense"
            id="minute"
            label="分钟"
            type="number"
            fullWidth
          />
          <TextField
            margin="dense"
            id="name"
            label="闹钟名称"
            type="text"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="repeat-label">------</InputLabel>
            <Select
              labelId="repeat-label"
              id="repeat"
              value={repeat}
              label="重复"
              onChange={(e) => setRepeat(e.target.value)}
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
          <Button onClick={handleClose} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
