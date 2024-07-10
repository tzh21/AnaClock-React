import React from "react"

export default function Pivot(
  radius: number,
  centerX: number, centerY: number
) {
  return (
    <circle
      cx={centerX}
      cy={centerY}
      r={radius * 0.04}
      fill='black'
    ></circle>
  )
}