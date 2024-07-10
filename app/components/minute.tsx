import { useEffect, useState } from 'react';
import styles from './minute.module.css'
import * as d3 from 'd3';

export default function Minute(clockSize: number) {
  const radius = clockSize / 2;
  const centerX = radius;
  const centerY = radius;

  const handWidth = clockSize * 0.01;
  const handHeight = clockSize / 2 * 0.8;
  const handColor = 'black'

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
    document.documentElement.style.setProperty('--min-rot-start', startDeg);
    document.documentElement.style.setProperty('--min-rot-end', endDeg);
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
    const minuteHand = d3.select<SVGLineElement, {}>('#minuteHand');
    minuteHand.call(DragBehavior);
  }, [])

  function updateMinute() {
    const min = new Date().getMinutes();
    const minStart = `${(min / 60) * 360}deg`;
    const minEnd = `${(min / 60) * 360 + 360}deg`;
    document.documentElement.style.setProperty('--min-rot-start', minStart);
    document.documentElement.style.setProperty('--min-rot-end', minEnd);
  }

  useEffect(() => {
    updateMinute();
  }, []);

  return (<line
    id='minuteHand'
    x1={centerX}
    y1={centerY}
    x2={centerX}
    y2={centerY - handHeight}
    className= { dragging ? '' : `${styles.minuteHandAnimation}`}
    style={{stroke: handColor, strokeWidth: handWidth, transformOrigin: `${clockSize / 2}px ${clockSize / 2}px`}}
  ></line>)
}