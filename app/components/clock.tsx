import Second from './second'
import Pivot from './pivot';
import Minute from './minute';
import ScaleGroup from './scale';
import Hour from './hour';
import { useState } from 'react';

export default function Clock(
  clockContainerSize: number = 400,
) {
  const padding = clockContainerSize * 0.1;
  const clockSize = clockContainerSize - padding * 2;
  const radius = clockSize / 2;
  const centerX = clockContainerSize / 2;
  const centerY = clockContainerSize / 2;
  const [second, setSecond] = useState<number>(0);

  const date = new Date();

  return (
    <div>
    <svg style={{width: clockContainerSize, height: clockContainerSize}}>
      <circle cx={centerX} cy={centerY} r={radius} stroke='black' strokeWidth={2} fill='transparent'></circle>
      {ScaleGroup(radius, centerX, centerY)}
      {Second(radius, centerX, centerY, date.getSeconds(), (newSecond) => setSecond(newSecond))}
      {Minute(radius, centerX, centerY)}
      {Hour(radius, centerX, centerY)}
      {/* 表盘中心的小圆圈 */}
      {Pivot(radius, centerX, centerY)}
    </svg>
    <div>{second}</div>
    </div>
  );
}
