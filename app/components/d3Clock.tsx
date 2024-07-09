import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function D3Clock(
  clockSize: number = 300,
) {
  const radius = clockSize / 2;
  const centerX = radius;
  const centerY = radius;

  useEffect(() => {
    const secondsHand = d3.select<SVGLineElement, {}>('#secondsHand');
  
    function dragged(this: SVGLineElement, event: DragEvent) {
      console.log('dragged');
      const dx = event.x - centerX
      const dy = event.y - centerY
      const angle = Math.atan2(dy, dx)
      const newX = centerX + radius * Math.cos(angle)
      const newY = centerY + radius * Math.sin(angle)

      d3.select(this)
        .attr('x2', newX)
        .attr('y2', newY)
    }
  
    const DragBehavior = d3.drag<SVGLineElement, any>()
      .on('drag', dragged);
  
    secondsHand.call(DragBehavior);
  }, [])

  return (
    <svg
      id='clock'
      style={{width: clockSize, height: clockSize, borderRadius: '50%', border: '2px solid black'}}
    >
      <line
        id='secondsHand'
        x1={clockSize / 2}
        y1={clockSize / 2}
        x2={clockSize / 2}
        y2={0}
        style={{stroke: 'black', strokeWidth: 2, transformOrigin: 'center'}}
      ></line>
    </svg>
  );
}
