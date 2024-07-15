'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from './alarm.module.css';
import { useRouter } from 'next/navigation' ;

export default function AddAlarm() {
    const currHour: number = new Date().getHours();
    const currMinute: number = new Date().getMinutes();
    const [time, setTime] = useState({ hour: currHour, minute: currMinute });
    const [alarmName, setAlarmName] = useState('闹钟');
    const [repeat, setRepeat] = useState('不重复');
    const [work, setWork] = useState(true);

    const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTime({ ...time, [name]: parseInt(value) });
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAlarmName(event.target.value);
    };

    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 创建新的闹钟对象
        const newAlarm = {
            time,
            alarmName,
            repeat,
            work
        };
        // 从LocalStorage读取已存在的闹钟数据
        const existingAlarms = JSON.parse(localStorage.getItem('alarms') || '[]');
        // 将新的闹钟添加到数组中
        existingAlarms.push(newAlarm);
        // 保存更新后的闹钟数组到LocalStorage
        localStorage.setItem('alarms', JSON.stringify(existingAlarms));

        setShowAlert(true);
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
                router.push('/alarm');
            }, 2000); // 设置2秒后关闭通知并跳转

            return () => clearTimeout(timer);
        }
    }, [showAlert, router]);

    return (
        <>
        <div className={styles.container}>
            <h1 className={styles.title}>original新建闹钟</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    小时:
                    <input
                        type="number"
                        name="hour"
                        value={time.hour}
                        onChange={handleTimeChange}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    分钟:
                    <input
                        type="number"
                        name="minute"
                        value={time.minute}
                        onChange={handleTimeChange}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    闹钟名称:
                    <input
                        type="text"
                        name="alarmName"
                        value={alarmName}
                        onChange={handleNameChange}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    重复:
                    <select
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        className={styles.select}
                    >
                        <option value="不重复">不重复</option>
                        <option value="每天">每天</option>
                        <option value="工作日">工作日</option>
                    </select>
                </label>
                <button type="submit" className={styles.button}>保存闹钟</button>
            </form>
        </div>

        {showAlert && <div className={styles.alert}>闹钟已保存</div>}
        </>
    );
}
