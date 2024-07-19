import { useTheme } from 'next-themes';

export default function Pivot(
  radius: number,
  centerX: number, centerY: number
) {
  const { theme } = useTheme();
  const fill = theme === 'dark' ? 'white' : 'black';
  return (
    <circle
      cx={centerX}
      cy={centerY}
      r={radius * 0.04}
      fill={fill}
    ></circle>
  )
}