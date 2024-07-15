import StaticClock from "./components/clock";
import { useEffect, useState } from "react";

export default function ClockTab() {
  const [timeStamp, setTimeStamp] = useState(0)

  useEffect(() => {
    const date = new Date()
    const timeZoneOffset = date.getTimezoneOffset() * 60000
    const initialTimeStamp = date.getTime() - timeZoneOffset
    setTimeStamp(initialTimeStamp)

    const interval = setInterval(() => {
      setTimeStamp(prevTimeStamp => prevTimeStamp + 16)
    }, 16)

    return () => clearInterval(interval)
  }, [])

  return (<div style={{width: '100%'}}>
    {StaticClock(timeStamp)}
  </div>)
}