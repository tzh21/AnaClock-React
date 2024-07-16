import StaticClock from "./components/clock";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";

export default function ClockTab() {
  const [timeStamp, setTimeStamp] = useState(0)

  const hour = Math.floor(timeStamp % 86400000 / 3600000)
  const minute = Math.floor(timeStamp % 3600000 / 60000)
  const second = Math.floor(timeStamp % 60000 / 1000)

  useEffect(() => {
    const date = new Date()
    const timeZoneOffset = date.getTimezoneOffset() * 60000
    const initialTimeStamp = date.getTime() - timeZoneOffset
    setTimeStamp(initialTimeStamp)

    const interval = setInterval(() => {
      setTimeStamp(prevTimeStamp => prevTimeStamp + 16)
    }, 16)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const [editing, setEditing] = useState(false)
  const [editingHour, setEditingHour] = useState(0)
  const [editingMinute, setEditingMinute] = useState(0)
  const [editingSecond, setEditingSecond] = useState(0)

  return (<div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
    {/* 时钟 */}
    {StaticClock(timeStamp, true, setTimeStamp)}

    {/* 数字时间 */}
    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <TextField value={editing ? editingHour : hour} onChange={(e) => {setEditingHour(parseInt(e.target.value))}} label='时' sx={{width: 100}} inputProps={{readOnly: !editing}}></TextField>
      <div style={{width: 8}}></div>
      <TextField value={editing ? editingMinute : minute} onChange={(e) => {setEditingMinute(parseInt(e.target.value))}} label='分' sx={{width: 100}} inputProps={{readOnly: !editing}}></TextField>
      <div style={{width: 8}}></div>
      <TextField value={editing ? editingSecond : second} onChange={(e) => {setEditingSecond(parseInt(e.target.value))}} label='秒' sx={{width: 100}} inputProps={{readOnly: !editing}}></TextField>
    </div>

    <div style={{height: 16}}></div>

    {/* 交互按钮 */}
    { editing &&
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Button onClick={() => {
          setTimeStamp(editingHour * 3600000 + editingMinute * 60000 + editingSecond * 1000)
          setEditing(false)
        }} sx={{flex: 1}}>确认</Button>
        <Button sx={{flex: 1}}>取消</Button>
      </div>
    }
    { !editing &&
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Button onClick={() => {
          setEditing(true)
          setEditingHour(hour)
          setEditingMinute(minute)
          setEditingSecond(second)
        }} sx={{flex: 1}}>修改</Button>
        <Button onClick={() => {
          const date = new Date()
          const timeZoneOffset = date.getTimezoneOffset() * 60000
          const initialTimeStamp = date.getTime() - timeZoneOffset
          setTimeStamp(initialTimeStamp)
        }} sx={{flex: 1}}>重置</Button>
      </div>
    }
  </div>)
}
