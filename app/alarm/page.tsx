'use client'

import React, { useState, useEffect } from 'react';
import StaticClock from "../components/clock"
import AlarmItem from "../components/alarmItem"
import AddButton from "../components/addButton"

export default function AlarmClock() {
    const [alarms, setAlarms] = useState<{ time: { hour: number; minute: number }; alarmName: string; repeat: string; work: boolean }[]>([]);

    const [timeStamp, setTimeStamp] = useState(0)

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
    }, []);

    return (
        <div>
            {StaticClock(timeStamp, false, setTimeStamp)}
            {AddButton()}
            {alarms.map((alarm, index) => (
                <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName} repeat={alarm.repeat} work={alarm.work} />
            ))}
        </div>
    );
}
