import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import StaticClock from "./components/clock";
import { useTheme } from 'next-themes';

import { ThemeProvider } from 'next-themes';
import {ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './muiThemes';

export default function StopwatchTab() {
  const { theme, systemTheme } = useTheme();
  const muiTheme = theme === 'dark' ? darkTheme : lightTheme;
  const [bgColor, setBgColor] = useState('#F7F6F2');
  const [textColor, setTextColor] = useState('black');
  React.useEffect(() => {
    if (theme === 'dark') {
      setBgColor('#1E1E1E');
      setTextColor('white');
    } else if (theme === 'light') {
      setBgColor('#F7F6F2');
      setTextColor('black');
    } else if (theme === 'system') {
      setBgColor(systemTheme === 'dark' ? '#1E1E1E' : '#F7F6F2');
      setTextColor(systemTheme === 'dark' ? 'white' : 'black');
    }
  }, [theme, systemTheme]);

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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div style={{width: 400, display: 'flex', flexDirection: 'column', position: 'relative'}}>
        {StaticClock(timeStamp, false)}
        <Box sx={{ width: '100%', maxWidth: 300, border: 1, borderRadius: 1, borderColor: 'grey.500', mx: 'auto', my: 2 }}>
          <Typography variant="h5" align="center" color={textColor}>
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

        <div style={{position: 'absolute', left: '100%', width: 400}}>
          {laps.length > 0 && (
            <ThemeProvider attribute="class">
            <MUIThemeProvider theme={muiTheme}>
            <CssBaseline />
            <TableContainer component={Paper} ref={tableContainerRef} style={{ maxHeight: 250, overflow: 'auto', backgroundColor: bgColor, marginTop: 16 }}>
              <Table size="small" aria-label="lap table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{color: textColor}}>计次</TableCell>
                    <TableCell align="center" style={{color: textColor}}>时间</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {laps.map((lap, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" style={{color: textColor}}>{laps.length - index}</TableCell>
                      <TableCell align="center" style={{color: textColor}}>{lap}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </MUIThemeProvider>
            </ThemeProvider>
          )}
        </div>
      </div>

    </div>
  );
}
