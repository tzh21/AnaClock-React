import StaticClock from "./components/clock";
import { useEffect, useState } from "react";

import AlarmItem from "./components/alarmItem"
import TextField from '@mui/material/TextField';
import FormDialog from "./components/editAlarm"

export default function AlarmTab() {
    const [alarms, setAlarms] = useState<{ time: { hour: number; minute: number }; alarmName: string; repeat: string; work: boolean }[]>([]);

    const [timeStamp, setTimeStamp] = useState(0);

    const [digital, setDigital] = useState(false);

    const toggleDigital = () => {
        setDigital(false);
    };

    const hour = Math.floor(timeStamp % 86400000 / 3600000)
    const minute = Math.floor(timeStamp % 3600000 / 60000)
    const second = Math.floor(timeStamp % 60000 / 1000)
  
    useEffect(() => {
        const storedAlarms = JSON.parse(localStorage.getItem('alarms') || '[]');
        setAlarms(storedAlarms);

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
    return (<div style={{width: '100%', display: 'flex', flexDirection: 'column', 
        height: '541px', overflowY: 'scroll', msOverflowStyle: 'none', scrollbarWidth: 'none'}} className="scroll-container">
        {/* 时钟 */}
        {digital ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <TextField value={hour} label='时' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
                <div style={{ width: 8 }}></div>
                <TextField value={minute} label='分' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
                <div style={{ width: 8 }}></div>
                <TextField value={second} label='秒' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
            </div>
        ) : (
            <div onClick={toggleDigital}>
            {StaticClock(timeStamp, false, setTimeStamp)}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <TextField value={hour} label='时' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
                <div style={{ width: 8 }}></div>
                <TextField value={minute} label='分' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
                <div style={{ width: 8 }}></div>
                <TextField value={second} label='秒' sx={{ width: 100 }} inputProps={{ readOnly: true }} />
            </div>
            </div>
        )}

        {FormDialog()}

        {alarms.map((alarm, index) => (
            <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName} repeat={alarm.repeat} work={alarm.work} />
        ))}
    </div>);
}
