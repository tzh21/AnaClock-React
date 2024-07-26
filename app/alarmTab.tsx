import StaticClock from "./components/clock";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material"

import AddButton from "./components/addButton";
import Alarms from "./components/alarms";

export default function AlarmTab() {
    const [timeStamp, setTimeStamp] = useState(0);

    const hour = Math.floor(timeStamp % 86400000 / 3600000)
    const minute = Math.floor(timeStamp % 3600000 / 60000)
    const second = Math.floor(timeStamp % 60000 / 1000)
  
    useEffect(() => {
        const date = new Date()
        const timeZoneOffset = date.getTimezoneOffset() * 60000
        const initialTimeStamp = date.getTime() - timeZoneOffset
        setTimeStamp(initialTimeStamp)
  
        const interval = setInterval(() => {
            setTimeStamp(prevTimeStamp => prevTimeStamp + 16)
        }, 16)
  
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (<>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',
                  overflowY: 'hidden', msOverflowStyle: 'none', scrollbarWidth: 'none'}} className="scroll-container">
              
          {/* 添加按钮 */}
          <div style={{ width: 400, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 395 }}></div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: 335 }}></div>
                  {AddButton()}
              </div>
          </div>
      
          {/* 时钟和数字 */}
          <div style={{ width: 400, display: 'flex', flexDirection: 'column' }}>
              {StaticClock('alarmTab', timeStamp, false)}
              {/* {StaticClock(timeStamp, false)} */}
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
      </>);      
}
