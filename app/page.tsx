'use client'

import Clock from "./components/clock"

export default function Page() {
  return (<div style={{position: 'absolute'}}>
    <div>上下文</div>
    <div>上下文</div>
    <div>上下文</div>
    <div>上下文</div>
    <div style={{height: 30}}></div>
    {Clock()}
    <div style={{height: 30}}></div>
    <div>上下文</div>
    <div>上下文</div>
    <div>上下文</div>
    <div>上下文</div>
  </div>)
}
