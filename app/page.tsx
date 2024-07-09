'use client'

// import Clock from '@/app/components/clock';
import D3Clock from "./components/d3Clock"

export default function Page() {
  return (<div style={{position: 'absolute'}}>
    <div>hello</div>
    {D3Clock()}
    <div>hello</div>
  </div>)
}
