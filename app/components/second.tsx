import { useEffect, useState } from 'react';
import styles from './second.module.css'
import * as d3 from 'd3';

export default function Second(
  radius: number,
  centerX: number, centerY: number,
  initSecond: number,
  updateSecond: (newSecond: number) => void
) {
  const handWidth = radius * 0.015;
  const handHeight = radius * 0.9;
  const handColor = 'red'

  // 初始化秒针
  function InitialSecondHand() {
    const secStart = `${(initSecond / 60) * 360}deg`;
    const secEnd = `${(initSecond / 60) * 360 + 360}deg`;
    document.documentElement.style.setProperty('--sec-rot-start', secStart);
    document.documentElement.style.setProperty('--sec-rot-end', secEnd);
  };
  useEffect(() => {
    InitialSecondHand();
  }, []);

  // 实现拖动功能

  // 当前指针是否停止移动
  // 拖拽指针时，停止指针的移动
  const [stopMoving, setStop] = useState(false);

  // 响应拖拽事件，根据拖拽的位置设置新的角度
  // 设置 x2 y2，让指针跟随鼠标移动
  // 设置 css 变量，让指针在拖拽结束后从原位置开始移动
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
  
  // 在 start 和 end 事件中都设置指针的位置，是为了防止拖拽开始和结束时刻产生抖动现象。
  function startDragging(this: SVGLineElement, event: DragEvent) {
    setStop(true);
    setNewAngle(this, event);
  }
  function dragged(this: SVGLineElement, event: DragEvent) {
    setNewAngle(this, event);
  }
  function endDragging(this: SVGLineElement, event: DragEvent) {
    setNewAngle(this, event);
    setStop(false);
  }

  const DragBehavior = d3.drag<SVGLineElement, any>()
    .on('start', startDragging)
    .on('drag', dragged)
    .on('end', endDragging);

  useEffect(() => {
    const secondHand = d3.select<SVGLineElement, {}>('#secondHand');
    secondHand.call(DragBehavior);
  }, [])

  // 根据角度实时更新秒数
  useEffect(() => {
    const interval = setInterval(() => {
      // 如果指针停止移动，不更新秒数
      if (stopMoving) return;

      // 获取旋转角度
      const secondHand = document.getElementById('secondHand'); if (!secondHand) return;
      const transform = window.getComputedStyle(secondHand).transform;
      // 转移矩阵的格式为 "matrix(cos, sin, -sin, cos, 0, 0)"
      var values = transform.split('(')[1].split(')')[0].split(',');
      const a = parseFloat(values[0]);
      const b = parseFloat(values[1]);
      let angle = Math.atan2(b, a) * (180 / Math.PI);
      // 根据 x2 y2 修正角度（x2, y2 在拖拽指针后会发生变化）
      const x2 = parseFloat(secondHand.getAttribute('x2') || '0');
      const y2 = parseFloat(secondHand.getAttribute('y2') || '0');
      const dx = x2 - centerX;
      const dy = centerY - y2;
      angle += Math.atan2(dx, dy) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      const newSecond = Math.round(angle / 360 * 60);
      updateSecond(newSecond);
    }, 500);
    return () => clearInterval(interval);
  }, [stopMoving]);

  return (<line
    id='secondHand'
    x1={centerX}
    y1={centerY}
    x2={centerX}
    y2={centerY - handHeight}
    className= { stopMoving ? '' : `${styles.secondHandAnimation}`}
    style={{stroke: handColor, strokeWidth: handWidth, transformOrigin: `${centerX}px ${centerY}px`}}
  ></line>)
}