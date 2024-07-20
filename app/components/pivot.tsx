import { useTheme } from 'next-themes';
import React from 'react';

export default function Pivot(
  radius: number,
  centerX: number, centerY: number
) {
  const { theme, systemTheme } = useTheme();
  const [fill, setFill] = React.useState('black');
  React.useEffect(() => {
    if (theme === 'dark') {
      setFill('white');
    } else if (theme === 'light') {
      setFill('black');
    } else if (theme === 'system') {
      setFill(systemTheme === 'dark' ? 'white' : 'black');
    }
  }, [theme, systemTheme]);
  return (
    <circle
      cx={centerX}
      cy={centerY}
      r={radius * 0.04}
      fill={fill}
    ></circle>
  )
}