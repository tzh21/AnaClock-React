// 表盘刻度
export default function ScaleGroup(clockSize: number) {
  const radius = clockSize / 2;
  const centerX = radius;
  const centerY = radius;

  const LargeScaleHeight = radius * 0.1;
  const LargeScaleWidth = radius * 0.02;

  const labels = Array.from({length: 12}, (_, i) => i + 1);

  return (<g>
    {labels.map((label, index) => {
      const angle = index * 30;
      return (
        <g key={index}>
          <line
            x1={radius}
            y1={0}
            x2={radius}
            y2={LargeScaleHeight}
            stroke='black'
            strokeWidth={LargeScaleWidth}
            transform={`rotate(${angle}, ${centerX}, ${centerY})`}
          />
        </g>
      );
    })}
  </g>);
}