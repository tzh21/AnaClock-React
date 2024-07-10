import { useEffect, useState } from 'react';
import styles from './second.module.css'
import * as d3 from 'd3';

export default function Second(
  radius: number,
  centerX: number, centerY: number
) {
  const handWidth = radius * 0.015;
  const handHeight = radius * 0.9;
  const handColor = 'red'

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

  function updateSecond() {
    const sec = new Date().getSeconds();
    const secStart = `${(sec / 60) * 360}deg`;
    const secEnd = `${(sec / 60) * 360 + 360}deg`;
    document.documentElement.style.setProperty('--sec-rot-start', secStart);
    document.documentElement.style.setProperty('--sec-rot-end', secEnd);
  };

  useEffect(() => {
    updateSecond();
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