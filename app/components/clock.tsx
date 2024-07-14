'use client'

import SecondHand from './second'
import Pivot from './pivot';
import MinuteHand from './minute';
import ScaleGroup from './scale';
import HourHand from './hour';
import { useEffect, useRef, useState } from 'react';

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

  const hourDegRef = useRef(hourDeg);
  useEffect(() => {
    hourDegRef.current = hourDeg;
  }, [hourDeg])

  function onMinuteHandDragged(newMinuteDeg: number) {
    setMinuteStartDeg(newMinuteDeg);
    setMinuteDeg(newMinuteDeg);
    const baseHourDeg = Math.floor(hourDegRef.current / 30) * 30;
    const hourOffset = newMinuteDeg / 360 * 30;
    setHourStartDeg(baseHourDeg + hourOffset);
    setHourDeg(baseHourDeg + hourOffset);
  }

  // 响应拖动时针事件。会根据时针的角度调整分针的角度。
  function onHourHandDragged(newHourDeg: number) {
    setHourStartDeg(newHourDeg);
    setHourDeg(newHourDeg);
    const minuteOffset = newHourDeg % 30 / 30 * 360;
    setMinuteStartDeg(minuteOffset);
    setMinuteDeg(minuteOffset);
  }

  const [editing, setEditing] = useState<boolean>(false);
  const [editingHour, setEditingHour] = useState<number>(0);
  const [editingMinute, setEditingMinute] = useState<number>(0);
  const [editingSecond, setEditingSecond] = useState<number>(0);

  function handleEditingTimeChange(e: React.ChangeEvent<HTMLInputElement>, type: 'hours' | 'minutes' | 'seconds') {
    const value = Math.max(0, parseInt(e.target.value, 10));
    switch (type) {
      case 'hours':
        setEditingHour(value);
        break;
      case 'minutes':
        setEditingMinute(value);
        break;
      case 'seconds':
        setEditingSecond(value);
        break;
    }
  }

  const [isMorning, setIsMorning] = useState<boolean>(true);
  function setHourDegAndSwitch24(newHourDeg: number) {
    const hour = hourDeg / 30;
    const newHour = newHourDeg / 30;
    if (hour < 12 && newHour >= 12) {
      setIsMorning(false);
    } else if (hour >= 12 && newHour < 12) {
      setIsMorning(true);
    }
  }

  return (<div>
    <svg style={{width: clockContainerSize, height: clockContainerSize}}>
      {/* 表盘边缘 */}
      <circle cx={centerX} cy={centerY} r={radius} stroke='black' strokeWidth={2} fill='transparent'></circle>
      {/* 刻度 */}
      {ScaleGroup(radius, centerX, centerY)}

      {SecondHand(radius, centerX, centerY, secondStartDeg, setSecondDeg, () => {})}
      {MinuteHand(radius, centerX, centerY, minuteStartDeg, setMinuteDeg, onMinuteHandDragged)}
      {HourHand(radius, centerX, centerY, hourStartDeg, setHourDegAndSwitch24, onHourHandDragged)}

      {/* 表盘中心的小圆圈 */}
      {Pivot(radius, centerX, centerY)}
    </svg>

    { editing ? 
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSecondStartDeg(editingSecond * 6);
          setMinuteStartDeg(editingMinute * 6);
          const hourBaseDeg = editingHour * 30;
          const hourOffsetDeg = editingMinute / 60 * 30;
          setHourStartDeg(hourBaseDeg + hourOffsetDeg);
          setEditing(false);
        }}
      >
        <input type='number' value={editingHour} onChange={(e) => handleEditingTimeChange(e, 'hours')}></input>
        <input type='number' value={editingMinute} onChange={(e) => handleEditingTimeChange(e, 'minutes')}></input>
        <input type='number' value={editingSecond} onChange={(e) => handleEditingTimeChange(e, 'seconds')}></input>
        <button type='submit'>确定</button>
      </form> :
      <div style={{display: 'flex', flexDirection: 'row'}}>
        {isMorning ? Math.floor(hourDeg / 30) : Math.floor(hourDeg / 30) + 12} : {Math.floor(minuteDeg / 6)} : {Math.floor(secondDeg / 6)}
        <div style={{width: 20}}></div>
        <button
          onClick={() => {
            setEditingHour(Math.floor(hourDeg / 30));
            setEditingMinute(Math.floor(minuteDeg / 6));
            setEditingSecond(Math.floor(secondDeg / 6));
            setEditing(true)
          }
        }>修改</button>
      </div>
    }
  </div>);
}
