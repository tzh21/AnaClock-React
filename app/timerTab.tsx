// 计时器

import { Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import StaticClock from "./components/clock"

export default function TimerTab() {
  const [timeStamp, setTimeStamp] = useState(0)

  const hour = Math.floor(timeStamp % 86400000 / 3600000)
  const minute = Math.floor(timeStamp % 3600000 / 60000)
  const second = Math.floor(timeStamp % 60000 / 1000)

  const [editing, setEditing] = useState(false)
  const [editingHour, setEditingHour] = useState(0)
  const [editingMinute, setEditingMinute] = useState(0)
  const [editingSecond, setEditingSecond] = useState(0)

  // 暂停键状态
  const [pause, setPause] = useState(true)

  // 倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      if (pause || editing) return
      setTimeStamp(prevTimeStamp => {
        if (prevTimeStamp <= 0) {
          setPause(true)
          return 0
        }
        return prevTimeStamp - 16
      })
    }, 16)

    return () => {
      clearInterval(interval)
    }
  }, [pause, editing])

  return (<div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
    {StaticClock(timeStamp, false)}

    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <TextField value={editing ? editingHour : hour} onChange={(e) => {setEditingHour(parseInt(e.target.value))}} label='时' sx={{width: 100}} inputProps={{readOnly: !editing}}></TextField>
      <div style={{width: 8}}></div>
      <TextField value={editing ? editingMinute : minute} onChange={(e) => {setEditingMinute(parseInt(e.target.value))}} label='分' sx={{width: 100}} inputProps={{readOnly: !editing}}></TextField>
      <div style={{width: 8}}></div>
      <TextField value={editing ? editingSecond : second} onChange={(e) => {setEditingSecond(parseInt(e.target.value))}} label='秒' sx={{width: 100}} inputProps={{readOnly: !editing}}></TextField>
    </div>

    <div style={{height: 16}}></div>

    { editing &&
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Button onClick={() => {
          setTimeStamp(editingHour * 3600000 + editingMinute * 60000 + editingSecond * 1000)
          setEditing(false)
          setPause(false)
        }} sx={{flex: 1}}>确认</Button>
        <Button onClick={() => {
          setEditing(false)
          setPause(false)
        }} sx={{flex: 1}}>取消</Button>
      </div>
    }
    { !editing &&
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Button onClick={() => {
          setEditing(true)
          setEditingHour(hour)
          setEditingMinute(minute)
          setEditingSecond(second)
        }} sx={{flex: 1}}>编辑</Button>
        <Button onClick={() => {
          setPause(p => !p)
        }} sx={{flex: 1}}>{pause ? "恢复" : "暂停"}</Button>
      </div>
    }
  </div>)
}