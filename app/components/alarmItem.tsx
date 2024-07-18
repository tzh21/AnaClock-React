import React from 'react';
import styles from './alarmItem.module.css';

interface AlarmItemProps {
  hour: number;
  minute: number;
  alarmName: string;
  work: boolean;
  onToggleWork: () => void;
  onUpdateAlarm: () => void;
}

export default function AlarmItem({ hour, minute, alarmName, work, onToggleWork, onUpdateAlarm }: AlarmItemProps) {
  return (
    <div className={styles.alarmItemContainer} onClick={onUpdateAlarm}>
      <div className={styles.info}>
        <div className={styles.time}>{`${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`}</div>
        <div className={styles.description}>{alarmName}</div>
      </div>
      <input type="checkbox" className={styles.switch} onClick={(e) => {
          e.stopPropagation();
          onToggleWork();
        }} checked={work} />
    </div>
  );
}
