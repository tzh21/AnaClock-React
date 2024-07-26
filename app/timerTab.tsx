// 计时器

import { Button, TextField, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { useEffect, useState } from "react"
import StaticClock from "./components/clock"

export default function TimerTab() {
  const [timeStamp, setTimeStamp] = useState(0)
  const [overtime, setOvertime] = useState(0); // 新增用于记录超时时间的状态
  const [showDialog, setShowDialog] = useState(false);

  const hour = Math.floor(timeStamp % 86400000 / 3600000)
  const minute = Math.floor(timeStamp % 3600000 / 60000)
  const second = Math.floor(timeStamp % 60000 / 1000)

  const [editing, setEditing] = useState(false)
  const [editingHour, setEditingHour] = useState(0)
  const [editingMinute, setEditingMinute] = useState(0)
  const [editingSecond, setEditingSecond] = useState(0)

  // 暂停键状态
  const [pause, setPause] = useState(true)


  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('计时结束', {
        body: '您设置的计时已经结束。',
        icon: '',//可替换
        dir: 'auto'
      });

      notification.onclick = () => {
        window.focus(); // 尝试将当前窗口调到前台
        notification.close();
      };

      setTimeout(() => {
        notification.close(); // 设置通知在5秒后自动关闭
      }, 5000);
    }
  };
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
    else if (!('Notification' in window)) {
      alert('Sorry bro, your browser is not good enough to display notification');
      return;
    }
    let lastUpdateTime = Date.now(); // 初始化上一次更新的时间戳
    let setNotificiation = false;
    const interval = setInterval(() => {
      if (pause || editing) return;
      const now = Date.now(); // 获取当前时间戳
      const delta = now - lastUpdateTime; // 计算从上一次更新到现在的时间差
      lastUpdateTime = now; // 更新上一次的时间戳为当前
      setTimeStamp(prevTimeStamp => {
        if (prevTimeStamp <= 0) {
          if (!showDialog) {
            setShowDialog(true); // 弹出对话框
          }
          if (!setNotificiation) {
            sendNotification();// 弹出系统提示
            setNotificiation = true;
          }

          setOvertime(prevOvertime => prevOvertime + delta / 2); // 增加超时时间
          return 0;
        }
        return prevTimeStamp - delta
      })
    }, 16)

    return () => {
      clearInterval(interval)
    }
  }, [pause, editing])

  const handleDialogClose = () => {
    setShowDialog(false);
    setOvertime(0);
    setPause(true);
  };

  return (<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
    {StaticClock('timerTab', timeStamp, false)}

    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <TextField value={editing ? editingHour : hour} onChange={(e) => { setEditingHour(parseInt(e.target.value) || 0) }} label='时' sx={{ width: 100 }} inputProps={{ readOnly: !editing }}></TextField>
      <div style={{ width: 8 }}></div>
      <TextField value={editing ? editingMinute : minute} onChange={(e) => { setEditingMinute(parseInt(e.target.value) || 0) }} label='分' sx={{ width: 100 }} inputProps={{ readOnly: !editing }}></TextField>
      <div style={{ width: 8 }}></div>
      <TextField value={editing ? editingSecond : second} onChange={(e) => { setEditingSecond(parseInt(e.target.value) || 0) }} label='秒' sx={{ width: 100 }} inputProps={{ readOnly: !editing }}></TextField>
    </div>

    <div style={{ height: 16 }}></div>

    {editing &&
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button onClick={() => {
          setTimeStamp(editingHour * 3600000 + editingMinute * 60000 + editingSecond * 1000)
          setEditing(false)
          setPause(false)
        }} sx={{ flex: 1 }}>确认</Button>
        <Button onClick={() => {
          setEditing(false)
          setPause(false)
        }} sx={{ flex: 1 }}>取消</Button>
      </div>
    }
    {!editing &&
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Button onClick={() => {
          setEditing(true)
          setEditingHour(hour)
          setEditingMinute(minute)
          setEditingSecond(second)
        }} sx={{ flex: 1 }}>编辑</Button>
        <Button onClick={() => {
          setPause(p => !p)
        }} sx={{ flex: 1 }}>{pause ? "恢复" : "暂停"}</Button>
      </div>
    }
    <Dialog open={showDialog} onClose={handleDialogClose}>
      {/* <DialogTitle>计时结束</DialogTitle>
      <DialogContent>
        已超时 {Math.floor(overtime / 3600000)}小时 {Math.floor(overtime % 3600000 / 60000)}分钟 {Math.floor(overtime % 60000 / 1000)}秒
      </DialogContent> */}
      <DialogTitle>计时超时</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <TextField value={Math.floor(overtime / 3600000)} label='时' sx={{ width: 100 }} inputProps={{ readOnly: true }}></TextField>
          <div style={{ width: 8 }}></div>
          <TextField value={Math.floor(overtime % 3600000 / 60000)} label='分' sx={{ width: 100 }} inputProps={{ readOnly: true }}></TextField>
          <div style={{ width: 8 }}></div>
          <TextField value={Math.floor(overtime % 60000 / 1000)} label='秒' sx={{ width: 100 }} inputProps={{ readOnly: true }}></TextField>
        </div>
      </DialogContent>
    </Dialog>
  </div>)
}