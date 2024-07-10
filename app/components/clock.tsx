import Second from './second'
import Pivot from './pivot';
import Minute from './minute';
import ScaleGroup from './scale';

export default function Clock(
  clockSize: number = 300,
) {
  const radius = clockSize / 2;
  const centerX = radius;
  const centerY = radius;
  const padding = 40;

  return (
    <svg style={{width: clockSize, height: clockSize}}>
      <circle cx={centerX} cy={centerY} r={radius} stroke='black' strokeWidth={2} fill='transparent'></circle>
      {ScaleGroup(clockSize)}
      {Second(clockSize)}
      {Minute(clockSize)}
      {/* 表盘中心的小圆圈 */}
      {Pivot(clockSize)}
    </svg>
  );
}
