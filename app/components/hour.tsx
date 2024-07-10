import { useEffect, useState } from 'react';
import styles from './hour.module.css'
import * as d3 from 'd3';

export default function Hour(
  radius: number, 
  centerX: number, centerY: number
) {
  const handWidth = radius * 0.04;
  const handHeight = radius * 0.6;
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
    document.documentElement.style.setProperty('--hour-rot-start', startDeg);
    document.documentElement.style.setProperty('--hour-rot-end', endDeg);
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
    const hourHand = d3.select<SVGLineElement, {}>('#hourHand');
    hourHand.call(DragBehavior);
  }, [])

  function updateHour() {
    const hour = new Date().getHours();
    const hourStart = `${(hour / 60) * 360}deg`;
    const hourEnd = `${(hour / 60) * 360 + 360}deg`;
    document.documentElement.style.setProperty('--hour-rot-start', hourStart);
    document.documentElement.style.setProperty('--hour-rot-end', hourEnd);
  }

  useEffect(() => {
    updateHour();
  }, []);

  return (<line
    id='hourHand'
    x1={centerX}
    y1={centerY}
    x2={centerX}
    y2={centerY - handHeight}
    className= { dragging ? '' : `${styles.hourHandAnimation}`}
    style={{stroke: handColor, strokeWidth: handWidth, transformOrigin: `${centerX}px ${centerY}px`}}
  ></line>)
}