'use client'

import Clock from "./components/clock"

export default function Page() {
  return (<div style={{position: 'absolute'}}>
    <div>hello</div>
    {Clock()}
    <div>hello</div>
  </div>)
}
