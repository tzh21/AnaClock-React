import Second from './second'
import Pivot from './pivot';
import Minute from './minute';
import ScaleGroup from './scale';
import Hour from './hour';
import { useEffect, useState } from 'react';

/*
Clock 组件维护所有指针的角度，角度变化时计算并显示时间
角度由指针组件维护，更新来源包括定时移动和拖拽
拖拽指针后，指针组件会调用一个回调函数，Clock 组件会根据被拖拽的指针角度计算其他指针的角度。
比如拖拽分针后，时针的角度也会发生变化；拖拽时针后，时针和分针的角度都会发生变化。
*/
export default function Clock(
  clockContainerSize: number = 400,
) {
  const padding = clockContainerSize * 0.1;
  const clockSize = clockContainerSize - padding * 2;
  const radius = clockSize / 2;
  const centerX = clockContainerSize / 2;
  const centerY = clockContainerSize / 2;

  const [minuteStartDeg, setMinuteStartDeg] = useState<number>(0);
  const [hourStartDeg, setHourStartDeg] = useState<number>(0);
  const [secondStartDeg, setSecondStartDeg] = useState<number>(0)

  const date = new Date();

  // 初始化指针角度到当前时间
  useEffect(() => {
    // const date = new Date();
    const second = date.getSeconds();
    const minute = date.getMinutes();
    const hour = date.getHours();
    const currentSecondDeg = (second / 60) * 360;
    const currentHourDeg = ((hour % 12) / 12) * 360 + (minute / 60) * 30;
    const currentMinuteDeg = (minute / 60) * 360 + (second / 60) * 6;
    setSecondStartDeg(currentSecondDeg);
    setMinuteStartDeg(currentMinuteDeg);
    setHourStartDeg(currentHourDeg);
  }, [])

  const [minuteDeg, setMinuteDeg] = useState<number>(date.getMinutes() / 60 * 360 + date.getSeconds() / 60 * 6);
  const [hourDeg, setHourDeg] = useState<number>(date.getHours() % 12 / 12 * 360 + date.getMinutes() / 60 * 30);
  const [secondDeg, setSecondDeg] = useState<number>(date.getSeconds())

  function onMinuteHandDragged(newMinuteDeg: number) {
    setMinuteStartDeg(newMinuteDeg);
    const baseHourDeg = Math.floor(hourDeg / 30) * 30;
    const hourOffset = newMinuteDeg / 360 * 30;
    setHourStartDeg(baseHourDeg + hourOffset);
  }

  function onHourHandDragged(newHourDeg: number) {
    setHourStartDeg(newHourDeg);
    const minuteOffset = newHourDeg % 30 / 30 * 360;
    setMinuteStartDeg(minuteOffset);
  }

  return (
    <div>
    <svg style={{width: clockContainerSize, height: clockContainerSize}}>
      {/* 表盘边缘 */}
      <circle cx={centerX} cy={centerY} r={radius} stroke='black' strokeWidth={2} fill='transparent'></circle>
      {/* 刻度 */}
      {ScaleGroup(radius, centerX, centerY)}

      {Second(radius, centerX, centerY, secondStartDeg, setSecondDeg, () => {})}
      {Minute(radius, centerX, centerY, minuteStartDeg, setMinuteDeg, onMinuteHandDragged)}
      {Hour(radius, centerX, centerY, hourStartDeg, setHourDeg, onHourHandDragged)}

      {/* 表盘中心的小圆圈 */}
      {Pivot(radius, centerX, centerY)}
    </svg>

    <div>{Math.floor(hourDeg / 30)}:{Math.floor(minuteDeg / 6)}:{Math.floor(secondDeg / 6)}</div>

    </div>
  );
}
