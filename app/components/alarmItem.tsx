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
  const { theme, systemTheme } = useTheme();
  const [bgColor, setBgColor] = React.useState('#F7F6F2');
  const [timeColor, setTimeColor] = React.useState('#000000');
  const [nameColor, setNameColor] = React.useState('#606060');
  React.useEffect(() => {
    if (theme === 'dark') {
      setBgColor('#1E1E1E');
      setTimeColor('#FFFFFF');
      setNameColor('A0A0A0');
    } else if (theme === 'light') {
      setBgColor('#F7F6F2');
      setTimeColor('#000000');
      setNameColor('#606060');
    } else if (theme === 'system') {
      setBgColor(systemTheme === 'dark' ? '#1E1E1E' : '#F7F6F2');
      setTimeColor(systemTheme === 'dark' ? '#FFFFFF' : '#000000');
      setNameColor(systemTheme === 'dark' ? '#A0A0A0' : '#606060');
    }
  }, [theme, systemTheme]);
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
