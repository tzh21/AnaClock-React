import StaticClock from "./components/clock";
import { useEffect, useState } from "react";
import { TextField, Dialog, DialogContent, DialogTitle } from "@mui/material"

import AddButton from "./components/addButton";
import Alarms from "./components/alarms";

export default function AlarmTab() {
    const [timeStamp, setTimeStamp] = useState(0);
    const [alarms, setAlarms] = useState([]);
    const [overtime, setOvertime] = useState(0);    // 用于记录超时时间的状态
    const [showDialog, setShowDialog] = useState(false);    // 用于控制超时提示框的显示

    const hour = Math.floor(timeStamp % 86400000 / 3600000)
    const minute = Math.floor(timeStamp % 3600000 / 60000)
    const second = Math.floor(timeStamp % 60000 / 1000)

    const sendNotification = () => {
        if (Notification.permission === 'granted') {
          const notification = new Notification('计时结束', {
            body: '您设置的计时已经结束。',
            icon: '',   //可替换
            dir: 'auto'
          });
      
          notification.onclick = () => {
            window.focus(); // 尝试将当前窗口调到前台
            notification.close(); 
          };
      
          setTimeout(() => {
            notification.close();   // 设置通知在5秒后自动关闭
          }, 5000);
        }
    };
  
    useEffect(() => {
        

        const date = new Date()
        const timeZoneOffset = date.getTimezoneOffset() * 60000
        const initialTimeStamp = date.getTime() - timeZoneOffset
        setTimeStamp(initialTimeStamp)

        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                console.log('用户已允许通知。');
              } else if (permission === 'denied') {
                console.log('用户拒绝通知。');
              }
            });
        }
        else if (!('Notification' in window)){
            alert('Sorry bro, your browser is not good enough to display notification');
            return;
        }
  
        const interval = setInterval(() => {
            setTimeStamp(prevTimeStamp => prevTimeStamp + 16)
        }, 16)
  
        return () => {
            clearInterval(interval)
        }
    }, [])

    const handleDialogClose = () => {
        setShowDialog(false);
        setOvertime(0);
    };
    return (<>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',
                  overflowY: 'hidden', msOverflowStyle: 'none', scrollbarWidth: 'none'}} className="scroll-container">
              
          {/* 添加按钮 */}
          <div style={{ width: 400, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 387 }}></div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: 320 }}></div>
                  {AddButton()}
              </div>
          </div>
      
          {/* 时钟和数字 */}
          <div style={{ width: 400, display: 'flex', flexDirection: 'column' }}>
              {StaticClock(timeStamp, false, setTimeStamp)}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <TextField value={hour} label='时' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
                  <div style={{ width: 8 }}></div>
                  <TextField value={minute} label='分' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
                  <div style={{ width: 8 }}></div>
                  <TextField value={second} label='秒' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
              </div>
          </div>
      
          {/* 闹钟列表 */}
          <div style={{ width: 400, display: 'flex', flexDirection: 'column', height: 470, overflowY: 'auto' }}>
              <div style={{ height: 33 }}></div>
              {Alarms()}
          </div>
        </div>

        <Dialog open={showDialog} onClose={handleDialogClose}>
            <DialogTitle>计时结束</DialogTitle>
            <DialogContent>
                已超时 {Math.floor(overtime / 3600000)}小时 {Math.floor(overtime % 3600000 / 60000)}分钟 {Math.floor(overtime % 60000 / 1000)}秒
            </DialogContent>
        </Dialog>
      </>);      
}
