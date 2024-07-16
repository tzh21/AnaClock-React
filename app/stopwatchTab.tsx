// 秒表

import { Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import StaticClock from "./components/clock"

export default function StopwatchTab() {
  const [timeStamp, setTimeStamp] = useState(0)

  const hour = Math.floor(timeStamp % 86400000 / 3600000)
  const minute = Math.floor(timeStamp % 3600000 / 60000)
  const second = Math.floor(timeStamp % 60000 / 1000)

  // 暂停键状态
  const [pause, setPause] = useState(true)

  // 倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      if (pause) return
      setTimeStamp(prevTimeStamp => {
        return prevTimeStamp + 16
      })
    }, 16)

    return () => {
      clearInterval(interval)
    }
  }, [pause])

  return (<div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
    {StaticClock(timeStamp, false)}

    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <TextField value={hour} label='时' sx={{width: 100}} inputProps={{readOnly: true}}></TextField>
      <div style={{width: 8}}></div>
      <TextField value={minute} label='分' sx={{width: 100}} inputProps={{readOnly: true}}></TextField>
      <div style={{width: 8}}></div>
      <TextField value={second} label='秒' sx={{width: 100}} inputProps={{readOnly: true}}></TextField>
    </div>

    <div style={{height: 16}}></div>

    { !pause &&
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Button onClick={() => {
          // TODO
        }} sx={{flex: 1}}>标记</Button>
        <Button onClick={() => {
          setPause(true)
        }} sx={{flex: 1}}>暂停</Button>
      </div>
    }
    { pause &&
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Button onClick={() => {
          setTimeStamp(0)
          setPause(true)
        }} sx={{flex: 1}}>复位</Button>
        <Button onClick={() => {
          setPause(false)
        }} sx={{flex: 1}}>启动</Button>
      </div>
    }
  </div>)
}