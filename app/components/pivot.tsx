import React from "react"

export default function Pivot(clockSize: number) {
  return (
    <circle
      cx={clockSize / 2}
      cy={clockSize / 2}
      r={clockSize * 0.02}
      fill='black'
    ></circle>
  )
}