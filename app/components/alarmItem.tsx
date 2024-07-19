import React from 'react';
import styles from './alarmItem.module.css';
import { useTheme } from 'next-themes';

interface AlarmItemProps {
  hour: number;
  minute: number;
  alarmName: string;
  work: boolean;
  onToggleWork: () => void;
  onUpdateAlarm: () => void;
}

export default function AlarmItem({ hour, minute, alarmName, work, onToggleWork, onUpdateAlarm }: AlarmItemProps) {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#1E1E1E' : '#F7F6F2';
  const timeColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const nameColor = theme === 'dark' ? '#A0A0A0' : '#606060';
  return (
    <div className={styles.alarmItemContainer} onClick={onUpdateAlarm} style={{backgroundColor: bgColor}}>
      <div className={styles.info}>
        <div className={styles.time} style={{color: timeColor}}>{`${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`}</div>
        <div className={styles.description} style={{color: nameColor}}>{alarmName}</div>
      </div>
      <input type="checkbox" className={styles.switch} onClick={(e) => {
          e.stopPropagation();
          onToggleWork();
        }} checked={work} />
    </div>
  );
}
