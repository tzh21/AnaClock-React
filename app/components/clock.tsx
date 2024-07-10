import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './clock.module.css';

export default function D3Clock(
  clockSize: number = 300,
) {
  const radius = clockSize / 2;
  const centerX = radius;
  const centerY = radius;

  // 实现拖动功能

  const [dragging, setDragging] = useState(false);
  
  function startDragging(this: SVGLineElement, event: DragEvent) {
    setDragging(true);
    const dx = event.x - centerX
    const dy = event.y - centerY
    const angle = Math.atan2(dy, dx)
    const newX = centerX + radius * Math.cos(angle)
    const newY = centerY + radius * Math.sin(angle)

    d3.select(this)
      .attr('x2', newX)
      .attr('y2', newY)
  }

  function dragged(this: SVGLineElement, event: DragEvent) {
    const dx = event.x - centerX
    const dy = event.y - centerY
    const angle = Math.atan2(dy, dx)
    const newX = centerX + radius * Math.cos(angle)
    const newY = centerY + radius * Math.sin(angle)

    d3.select(this)
      .attr('x2', newX)
      .attr('y2', newY)
  }

  function endDragging(this: SVGLineElement, event: DragEvent) {
    const dx = event.x - centerX
    const dy = event.y - centerY
    const angle = Math.atan2(dy, dx)

    const secStart = `${angle}deg`;
    const secEnd = `${angle + 360}deg`;
    document.documentElement.style.setProperty('--sec-rot-start', secStart);
    document.documentElement.style.setProperty('--sec-rot-end', secEnd);

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

  // 根据当下时间更新秒针初始的角度

  function updateSeconds() {
    const sec = new Date().getSeconds();
    const secStart = `${(sec / 60) * 360}deg`;
    const secEnd = `${(sec / 60) * 360 + 360}deg`;
    document.documentElement.style.setProperty('--sec-rot-start', secStart);
    document.documentElement.style.setProperty('--sec-rot-end', secEnd);
  };
  useEffect(() => {
    updateSeconds();
  }, []);

  return (
    <svg
      id='clock'
      style={{width: clockSize, height: clockSize, borderRadius: '50%', border: '2px solid black'}}
    >
      <line
        id='secondHand'
        x1={clockSize / 2}
        y1={clockSize / 2}
        x2={clockSize / 2}
        y2={10}
        className= { dragging ? '' : `${styles.secondHandAnimation}`}
        style={{stroke: 'red', strokeWidth: 2, transformOrigin: 'center'}}
      ></line>
    </svg>
  );
}
