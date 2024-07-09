import { useEffect } from 'react';
import styles from './clock/secondsHand.module.css';

export default function Clock(
  clockSize: number = 300,
) {
  // 根据当下时间更新秒针初始的角度
  function updateSeconds() {
    const sec = new Date().getSeconds();
    const secStart = `${(sec / 60) * 360}deg`;
    const secEnd = `${(sec / 60) * 360 + 360}deg`;
    document.documentElement.style.setProperty('--sec-rot-start', secStart);
    document.documentElement.style.setProperty('--sec-rot-end', secEnd);
  };

  useEffect(() => {
    // 根据当前时间设置秒针
    updateSeconds();
  }, []);

  return (
    <svg
      style={{width: clockSize, height: clockSize, borderRadius: '50%', border: '2px solid black'}}
    >
      <line
        id='secondsHand'
        x1={clockSize / 2}
        y1={clockSize / 2}
        x2={clockSize / 2}
        y2={0}
        className={`${styles.secondsHandAnimation}`}
        style={{stroke: 'black', strokeWidth: 2, transformOrigin: 'center'}}
      ></line>
    </svg>
  );
}
