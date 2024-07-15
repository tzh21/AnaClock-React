'use client'

import React, { useState, useEffect } from 'react';
import Clock from "../components/clock"
import AlarmItem from "../components/alarmItem"
import AddButton from "../components/addButton"

export default function AlarmClock() {
    const [alarms, setAlarms] = useState<{ time: { hour: number; minute: number }; alarmName: string; repeat: string; work: boolean }[]>([]);

    useEffect(() => {
        const storedAlarms = JSON.parse(localStorage.getItem('alarms') || '[]');
        setAlarms(storedAlarms);
    }, []);

    return (
        <div>
            {Clock()}
            {AddButton()}
            {alarms.map((alarm, index) => (
                <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName} repeat={alarm.repeat} work={alarm.work} />
            ))}
        </div>
    );
}
