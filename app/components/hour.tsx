import { useEffect, useState } from 'react';
import styles from './hour.module.css'
import * as d3 from 'd3';

export default function Hour(
  radius: number,
  centerX: number, centerY: number,
  startDeg: number,
  setDeg: (newDeg: number) => void, // 回调函数，用于实时更新父组件中的角度
  onHandDragged: (newDeg: number) => void, // 回调函数，用于拖拽指针时，更新父组件中的角度
) {
  const handWidth = radius * 0.04;
  const handHeight = radius * 0.6;
  const handColor = 'black'

  // 根据初始化角度计算指针的起始位置
  const x1 = centerX
  const y1 = centerY
  const x2 = centerX + handHeight * Math.sin(startDeg * Math.PI / 180)
  const y2 = centerY - handHeight * Math.cos(startDeg * Math.PI / 180)

  // 实现拖动功能

  // 表示当前指针是否停止移动；拖拽指针时，停止指针的移动
  const [stopMoving, setStop] = useState(false);
  // 获取鼠标位置和0时夹角（弧度）
  function getDragEventAngle(event: DragEvent) {
    const dx = event.x - centerX
    const dy = centerY - event.y
    const angle = Math.atan2(dx, dy)
    return angle;
  }
  function getHandReg(hand: HTMLElement): number{
    const x2 = parseFloat(hand.getAttribute('x2') || '0');
    const y2 = parseFloat(hand.getAttribute('y2') || '0');
    const dx = x2 - centerX;
    const dy = centerY - y2;
    var deg = Math.atan2(dx, dy) * (180 / Math.PI);
    if (deg < 0) deg += 360;
    return deg;
  }
  // 根据鼠标位置设置新的 x2, y2
  function setNewAngle(elem: SVGLineElement, event: DragEvent) {
    const angle = getDragEventAngle(event);
    const newX = centerX + handHeight * Math.sin(angle)
    const newY = centerY - handHeight * Math.cos(angle)
    d3.select(elem)
      .attr('x2', newX)
      .attr('y2', newY)
  }
  function startDragging(this: SVGLineElement, event: DragEvent) {
    setStop(true);
    setNewAngle(this, event);
  }
  function dragged(this: SVGLineElement, event: DragEvent) {
    setNewAngle(this, event);
  }
  function endDragging(this: SVGLineElement, event: DragEvent) {
    setNewAngle(this, event);
    const hand = document.getElementById('hourHand'); if (!hand) return;
    const deg = getHandReg(hand);
    onHandDragged(deg);
    setStop(false);
  }
  const DragBehavior = d3.drag<SVGLineElement, any>()
    .on('start', startDragging)
    .on('drag', dragged)
    .on('end', endDragging);
  useEffect(() => {
    const hand = d3.select<SVGLineElement, {}>('#hourHand');
    hand.call(DragBehavior);
  }, [])

  function getRotatingDeg(hand: HTMLElement): number {
    const x2 = parseFloat(hand.getAttribute('x2') || '0');
    const y2 = parseFloat(hand.getAttribute('y2') || '0');
    const dx = x2 - centerX;
    const dy = centerY - y2;
    var initDeg = Math.atan2(dx, dy) * (180 / Math.PI);
    if (initDeg < 0) initDeg += 360;
    const transform = window.getComputedStyle(hand).transform;
    // 转移矩阵的格式为 "matrix(cos, sin, -sin, cos, 0, 0)"
    var transformMatrix = transform.split('(')[1].split(')')[0].split(',');
    const cosValue = parseFloat(transformMatrix[0]);
    const sinValue = parseFloat(transformMatrix[1]);
    var rotateDeg = Math.atan2(sinValue, cosValue) * (180 / Math.PI);
    if (rotateDeg < 0) rotateDeg += 360;
    const deg = (rotateDeg + initDeg) % 360;
    return deg;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // 如果指针停止移动，不更新秒数
      if (stopMoving) return;
      const hand = document.getElementById('hourHand'); if (!hand) return;
      const deg = getRotatingDeg(hand);
      setDeg(deg);
    }, 500);
    return () => clearInterval(interval);
  }, [stopMoving])

  return (<line
    id='hourHand'
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    className={stopMoving ? '' : styles.hourHandAnimation}
    style={{stroke: handColor, strokeWidth: handWidth, transformOrigin: `${centerX}px ${centerY}px`}}
  ></line>)
}