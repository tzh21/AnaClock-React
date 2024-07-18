import React from 'react';
import styles from './alarmItem.module.css';

interface AlarmItemProps {
  hour: number;
  minute: number;
  alarmName: string;
  repeat: string;
  work: boolean;
  onToggleWork: () => void;
  onUpdateAlarm: () => void;
}

export default function AlarmItem({ hour, minute, alarmName, repeat, work, onToggleWork, onUpdateAlarm }: AlarmItemProps) {
  return (
    <div className={styles.alarmItemContainer} onClick={onUpdateAlarm}>
      <div className={styles.info}>
        <div className={styles.time}>{`${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`}</div>
        <div className={styles.description}>{alarmName}，{repeat}</div>
      </div>
      <input type="checkbox" className={styles.switch} onClick={onToggleWork} checked={work} />
    </div>
  );
}
