import { useTheme } from 'next-themes';
import React from 'react';

// 表盘刻度
export default function ScaleGroup(
  radius: number, 
  centerX: number, centerY: number
) {
  const { theme, systemTheme } = useTheme();
  const LargeScaleHeight = radius * 0.1;
  const LargeScaleWidth = radius * 0.02;
  const LargeScaleGroup = Array.from({length: 12}, (_, i) => i + 1);
  const [LargeScaleColor, setLargeScaleColor] = React.useState('black');
  React.useEffect(() => {
    if (theme === 'dark') {
      setLargeScaleColor('white');
    } else if (theme === 'light') {
      setLargeScaleColor('black');
    } else if (theme === 'system') {
      setLargeScaleColor(systemTheme === 'dark' ? 'white' : 'black');
    }
  }, [theme, systemTheme]);

  const SmallScaleHeight = radius * 0.05;
  const SmallScaleWidth = radius * 0.01;
  const SmallScaleGroup = Array.from({length: 60}, (_, i) => i + 1);
  const SmallScaleColor = 'gray';

  return (<g>
    {SmallScaleGroup.map((label, index) => {
      const angle = index * 6;
      return (<g key={index}>
        <line
          x1={centerX}
          y1={centerY - radius + SmallScaleHeight}
          x2={centerX}
          y2={centerY - radius}
          stroke={SmallScaleColor}
          strokeWidth={SmallScaleWidth}
          transform={`rotate(${angle}, ${centerX}, ${centerY})`}
        />
      </g>)
    })}
    {LargeScaleGroup.map((label, index) => {
      const angle = index * 30;
      return (<g key={index}>
        <line
          x1={centerX}
          y1={centerY - radius + LargeScaleHeight}
          x2={centerX}
          y2={centerY - radius}
          stroke={LargeScaleColor}
          strokeWidth={LargeScaleWidth}
          transform={`rotate(${angle}, ${centerX}, ${centerY})`}
        />
      </g>);
    })}
  </g>);
}