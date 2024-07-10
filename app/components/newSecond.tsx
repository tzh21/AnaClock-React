import { useEffect, useState } from 'react';
import styles from './second.module.css'
import * as d3 from 'd3';

export default function Second(
  radius: number,
  centerX: number, centerY: number,
  prevSecond: number, currentSecond: number,
  updateSecond: (newSecond: number) => void
) {
  const handWidth = radius * 0.015;
  const handHeight = radius * 0.9;
  const handColor = 'red'

  // 初始化秒针到当前时间
  function InitialSecondHand() {
    const sec = new Date().getSeconds();
    const secStart = `${(sec / 60) * 360}deg`;
    const secEnd = `${(sec / 60) * 360 + 6}deg`;
    document.documentElement.style.setProperty('--sec-rot-start', secStart);
    document.documentElement.style.setProperty('--sec-rot-end', secEnd);
  };

  useEffect(() => {
    InitialSecondHand();
  }, []);


  // 实现拖动功能

  const [dragging, setDragging] = useState(false);

  function setNewAngle(elem: SVGLineElement, event: DragEvent) {
    const dx = event.x - centerX
    const dy = event.y - centerY
    const angle = Math.atan2(dy, dx)
    const newX = centerX + handHeight * Math.cos(angle)
    const newY = centerY + handHeight * Math.sin(angle)

    d3.select(elem)
      .attr('x2', newX)
      .attr('y2', newY)

    const startDeg = `${angle}deg`;
    const endDeg = `${angle + 360}deg`;
    document.documentElement.style.setProperty('--sec-rot-start', startDeg);
    document.documentElement.style.setProperty('--sec-rot-end', endDeg);
  }
  
  // 在 start 和 end 事件中都设置指针的位置，是为了防止抖动现象。
  function startDragging(this: SVGLineElement, event: DragEvent) {
    setDragging(true);
    setNewAngle(this, event);
  }

  function dragged(this: SVGLineElement, event: DragEvent) {
    setNewAngle(this, event);
  }

  function endDragging(this: SVGLineElement, event: DragEvent) {
    setNewAngle(this, event);
    setDragging(false);
  }

  const DragBehavior = d3.drag<SVGLineElement, any>()
    .on('start', startDragging)
    .on('drag', dragged)
    .on('end', endDragging);

  useEffect(() => {
    const secondHand = d3.select<SVGLineElement, {}>('#secondHand');
    secondHand.call(DragBehavior);
  }, [])

  // 每秒获取秒针当前的角度，根据角度更新秒数
  useEffect(() => {
    const interval = setInterval(() => {
      // const secondHand = document.getElementById('secondHand');
      // if (!secondHand) return;
      // const x2 = parseFloat(secondHand.getAttribute('x2') || '0');
      // const y2 = parseFloat(secondHand.getAttribute('y2') || '0');
      // const dx = x2 - centerX;
      // const dy = y2 - centerY;
      // const angle = Math.atan2(dy, dx);
      // const newSecond = Math.round(angle / (2 * Math.PI) * 60);
      // updateSecond(newSecond);

      if (dragging) return;
      const secondHand = document.getElementById('secondHand');
      if (!secondHand) return;
      const transform = window.getComputedStyle(secondHand).transform;
      if (!transform) return;
      var values
      try {
        values = transform.split('(')[1].split(')')[0].split(',');
      }
      catch(e) {
        return;
      }
      const a = parseFloat(values[0]);
      const b = parseFloat(values[1]);
      let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      if (angle < 0) angle += 360;
      const newSecond = Math.round(angle / 360 * 60);
      updateSecond(newSecond);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (<line
    id='secondHand'
    x1={centerX}
    y1={centerY}
    x2={centerX}
    y2={centerY - handHeight}
    className= { dragging ? '' : `${styles.secondHandAnimation}`}
    style={{stroke: handColor, strokeWidth: handWidth, transformOrigin: `${centerX}px ${centerY}px`}}
  ></line>)
}