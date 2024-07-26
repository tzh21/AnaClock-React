import React, { useEffect, useRef, useState } from 'react';
import ScaleGroup from './scale';
import Pivot from './pivot';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';

/*
静态时钟组件。
接受一个时间戳作为参数，返回在该时间下时钟的函数组件，核心为三个指针的角度。
接受一个回调函数作为参数，用于在每次拖拽结束后，向父组件传递拖拽后的指针角度。父组件可以通过这个角度来更新时间。
接受一个参数作为拖拽功能的开关。
*/
export default function StaticClock(
  id: string, // 用于不同的实例
  timeStamp: number,
  draggable: boolean = false,
  setNewTimeStamp: (newTimeStamp: number) => void = (n) => {}
) {
  const hourHandId = `${id}-hourHand`
  const minuteHandId = `${id}-minuteHand`
  const secondHandId = `${id}-secondHand`

  const { theme, systemTheme } = useTheme();
  const [outColor, setOutColor] = useState('black');
  React.useEffect(() => {
    if (theme === 'dark') {
      setOutColor('white');
    } else if (theme === 'light') {
      setOutColor('black');
    } else if (theme === 'system') {
      setOutColor(systemTheme === 'dark' ? 'white' : 'black');
    }
  }, [theme, systemTheme]);
  
  // 组件内部保留的时间戳。如果发生了拖拽，则不会使用父组件传递的时间戳，而是使用这个时间戳。
  const [internalTimeStamp, setInternalTimeStamp] = useState(timeStamp)
  const [dragging, setDragging] = useState(false)
  useEffect(() => {
    if (!dragging) {
      setInternalTimeStamp(timeStamp)
    }
  }, [timeStamp])

  useEffect(() => {
    if (draggable) {
      d3.select<SVGLineElement, HandIdAndLen>(`#${secondHandId}`).data([secondHandAndLen])
      d3.select<SVGLineElement, HandIdAndLen>(`#${minuteHandId}`).data([minuteHandAndLen])
      d3.select<SVGLineElement, HandIdAndLen>(`#${hourHandId}`).data([hourHandAndLen])
    }
  }, [draggable])

  const internalTimeStampRef = useRef(internalTimeStamp)
  useEffect(() => {
    internalTimeStampRef.current = internalTimeStamp
  }, [internalTimeStamp])

  // 通过时间戳计算指针角度
  const secondHandDeg = internalTimeStamp % 60000 / 60000 * 360
  const minuteHandDeg = internalTimeStamp % 3600000 / 3600000 * 360
  const hourHandDeg = internalTimeStamp % 86400000 / 43200000 * 360

  // 通过角度指针末端位置
  const [secondHandX2, secondHandY2] = calcHandPosition(secondHandDeg, secondHandLen, centerX, centerY)
  const [minuteHandX2, minuteHandY2] = calcHandPosition(minuteHandDeg, minuteHandLen, centerX, centerY)
  const [hourHandX2, hourHandY2] = calcHandPosition(hourHandDeg, hourHandLen, centerX, centerY)

  function startDragging(this: SVGLineElement, event: DragEvent, datum: HandIdAndLen) {
    setDragging(true)
    dragElem(this, event, datum)
  }

  function dragElem(elem: SVGLineElement, event: DragEvent, datum: HandIdAndLen) {
    // 计算拖拽前后的角度，范围为 [0, 2 * Math.PI)
    var newRad = Math.atan2(event.x - centerX, centerY - event.y)
    if (newRad < 0) {
      newRad += Math.PI * 2
    }
    var oldRad = Math.atan2(elem.x2.baseVal.value - centerX, centerY - elem.y2.baseVal.value)
    if (oldRad < 0) {
      oldRad += Math.PI * 2
    }
    // 如果拖拽后越过 0 点，需要加一个偏移量，用于切换上下午
    if (2 * Math.PI * 0.9 < oldRad && newRad < 2 * Math.PI * 0.1) {
      newRad += Math.PI * 2
    } else if (2 * Math.PI * 0.9 < newRad && oldRad < 2 * Math.PI * 0.1) {
      newRad -= Math.PI * 2
    }
    const deltaDeg = (newRad - oldRad) / Math.PI * 180
    var deltaTimeStamp = 0
    switch (datum.classname) {
      case 'secondHand':
        deltaTimeStamp = deltaDeg / 360 * 60000
        break
      case 'minuteHand':
        deltaTimeStamp = deltaDeg / 360 * 3600000
        break
      case 'hourHand':
        deltaTimeStamp = deltaDeg / 360 * 43200000
        break
    }
    setInternalTimeStamp(prevTimeStamp => prevTimeStamp + deltaTimeStamp)
  }
  
  function drag(this: SVGLineElement, event: DragEvent, datum: HandIdAndLen) {
    dragElem(this, event, datum)
  }

  function endDragging(this: SVGLineElement, event: DragEvent, datum: HandIdAndLen) {
    dragElem(this, event, datum)
    setNewTimeStamp(internalTimeStampRef.current)
    setDragging(false)
  }

  const DragBehavior = d3.drag<SVGLineElement, HandIdAndLen>()
    .on('start', startDragging)
    .on('drag', drag)
    .on('end', endDragging)

  useEffect(() => {
    if (draggable) {
      d3.select<SVGLineElement, HandIdAndLen>(`#${secondHandId}`).call(DragBehavior)
      d3.select<SVGLineElement, HandIdAndLen>(`#${minuteHandId}`).call(DragBehavior)
      d3.select<SVGLineElement, HandIdAndLen>(`#${hourHandId}`).call(DragBehavior)
    }
  }, [draggable])

  return (<div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <svg style={{width: clockContainerSize, height: clockContainerSize}}>
      {/* 表盘 */}
      <circle cx={centerX} cy={centerY} r={radius} fill="transparent" stroke={outColor} strokeWidth={2} />
      
      {/* 刻度 */}
      {ScaleGroup(radius, centerX, centerY)}

      {/* 秒针 */}
      <line id={secondHandId} x1={centerX} y1={centerY} x2={secondHandX2} y2={secondHandY2} style={{stroke: 'red', strokeWidth: radius * 0.02}}></line>

      {/* 分针 */}
      <line id={minuteHandId} x1={centerX} y1={centerY} x2={minuteHandX2} y2={minuteHandY2} style={{stroke: outColor, strokeWidth: radius * 0.03}}></line>

      {/* 时针 */}
      <line id={hourHandId} x1={centerX} y1={centerY} x2={hourHandX2} y2={hourHandY2} style={{stroke: outColor, strokeWidth: radius * 0.05}}></line>

      {/* 表盘中心的小圆圈 */}
      {Pivot(radius, centerX, centerY)}
    </svg>
  </div>)
};

// 时钟外观参数
const clockContainerSize = 400
const padding = clockContainerSize * 0.1
const clockSize = clockContainerSize - padding * 2
const radius = clockSize / 2
const centerX = clockContainerSize / 2
const centerY = clockContainerSize / 2

const secondHandLen = radius * 0.9
const minuteHandLen = radius * 0.8
const hourHandLen = radius * 0.6

interface HandIdAndLen {
  classname: string,
  len: number
}

const secondHandAndLen: HandIdAndLen = { classname: 'secondHand', len: secondHandLen }
const minuteHandAndLen: HandIdAndLen = { classname: 'minuteHand', len: minuteHandLen }
const hourHandAndLen: HandIdAndLen = { classname: 'hourHand', len: hourHandLen }

function calcHandPosition(
  deg: number, handLen: number,
  x1: number, y1: number
) {
  const x2 = x1 + handLen * Math.sin(deg / 180 * Math.PI)
  const y2 = y1 - handLen * Math.cos(deg / 180 * Math.PI)
  return [x2, y2]
}
