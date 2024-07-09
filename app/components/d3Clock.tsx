import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function D3Clock(
  clockSize: number = 300,
) {
  useEffect(() => {
    const secondsHand = d3.select<SVGLineElement, {}>('#secondsHand');
  
    function dragged(this: SVGLineElement, d: any) {
      console.log('dragged');
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
