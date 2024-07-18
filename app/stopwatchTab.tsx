import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import StaticClock from "./components/clock";

export default function StopwatchTab() {
  const [timeStamp, setTimeStamp] = useState(0);
  const [pause, setPause] = useState(true);
  const [laps, setLaps] = useState<string[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const updateTimer = useRef<any>(null);

  const formatTime = (time: number) => {
    const day = Math.floor(time / 86400000);
    const hour = Math.floor(time % 86400000 / 3600000);
    const minute = Math.floor(time % 3600000 / 60000);
    const second = Math.floor(time % 60000 / 1000);
    const millisecond = Math.floor(time % 1000);

    let formattedTime = `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.${millisecond.toString().slice(0, 2).padStart(2, '0')}`;
    if (hour > 0 || day > 0) {
      formattedTime = `${hour.toString().padStart(2, '0')}:${formattedTime}`;
    }
    if (day > 0) {
      formattedTime = `${day}:${formattedTime}`;
    }
    return formattedTime;
  };

  const formattedTime = formatTime(timeStamp);

  useEffect(() => {
    if (!pause) {
      const start = Date.now() - timeStamp;
      updateTimer.current = setInterval(() => {
        setTimeStamp(Date.now() - start);
      }, 16);
    }

    return () => clearInterval(updateTimer.current);
  }, [pause]);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [laps]);

  const handleLap = () => {
    setLaps([formattedTime, ...laps]);
  };

  const handleReset = () => {
    setPause(true);
    setTimeStamp(0);
    setLaps([]);
  };

  const handleStart = () => {
    setPause(false);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {StaticClock(timeStamp, false)}

      <Box sx={{ width: '100%', maxWidth: 300, border: 1, borderRadius: 1, borderColor: 'grey.500', mx: 'auto', my: 2 }}>
        <Typography variant="h5" align="center">
          {formattedTime}
        </Typography>
      </Box>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {pause ? (
          <>
            <Button onClick={handleReset} sx={{ flex: 1 }}>复位</Button>
            <Button onClick={handleStart} sx={{ flex: 1 }}>启动</Button>
          </>
        ) : (
          <>
            <Button onClick={handleLap} sx={{ flex: 1 }}>标记</Button>
            <Button onClick={() => setPause(true)} sx={{ flex: 1 }}>暂停</Button>
          </>
        )}
      </div>

      {laps.length > 0 && (
        <TableContainer component={Paper} ref={tableContainerRef} style={{ maxHeight: 250, overflow: 'auto', backgroundColor: 'GhostWhite', marginTop: 16 }}>
          <Table size="small" aria-label="lap table">
            <TableHead>
              <TableRow>
                <TableCell align="center">计次</TableCell>
                <TableCell align="center">时间</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {laps.map((lap, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{laps.length - index}</TableCell>
                  <TableCell align="center">{lap}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
