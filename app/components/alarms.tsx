import React from "react";
import AlarmItem from "./alarmItem";
import { useAlarms } from './alarmsHooks';

interface Alarm {
    time: {
        hour: number;
        minute: number;
    };
    alarmName: string;
    repeat: string;
    work: boolean;
}

export default function Alarms(){
    const alarms: Alarm[] = useAlarms();

    return(<div>
        {alarms.map((alarm: Alarm, index: number) => (
            <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName} repeat={alarm.repeat} work={alarm.work} />
        ))}
    </div>);
}
