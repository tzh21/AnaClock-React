import React from "react";
import AlarmItem from "./alarmItem";

export default function Alarms(){
    const [alarms, setAlarms] = React.useState<{ time: { hour: number; minute: number }; alarmName: string; repeat: string; work: boolean }[]>([]);

    React.useEffect(() => {
        const storedAlarms = JSON.parse(localStorage.getItem('alarms') || '[]');
        setAlarms(storedAlarms);
    }, [])

    return(<div>
        {alarms.map((alarm, index) => (
            <AlarmItem key={index} hour={alarm.time.hour} minute={alarm.time.minute} alarmName={alarm.alarmName} repeat={alarm.repeat} work={alarm.work} />
        ))}
    </div>);
}
