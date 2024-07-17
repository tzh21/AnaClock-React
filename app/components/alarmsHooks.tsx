import { useState, useEffect } from 'react';

interface Alarm {
    time: {
        hour: number;
        minute: number;
    };
    alarmName: string;
    repeat: string;
    work: boolean;
}

const fetchAlarms = (): Alarm[] => {
    const data = localStorage.getItem('alarms');
    return data ? JSON.parse(data) : [];
};

export const useAlarms = (): Alarm[] => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    useEffect(() => {
        setAlarms(fetchAlarms());
    }, []);

    return alarms;
}
