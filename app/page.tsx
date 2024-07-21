'use client'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import ClockTab from './clockTab';
import AlarmTab from './alarmTab';
import { TabContext, TabPanel } from '@mui/lab';
import TimerTab from './timerTab';
import StopwatchTab from './stopwatchTab';

import { ThemeProvider } from 'next-themes';
import {ThemeProvider as MUIThemeProvider, Theme } from '@mui/material';
import { lightTheme, darkTheme } from './muiThemes';

export default function Page() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [muiTheme, setMuiTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    if (theme === 'dark') {
      setMuiTheme(darkTheme);
    } else if (theme === 'light') {
      setMuiTheme(lightTheme);
    } else if (theme === 'system') {
      setMuiTheme(resolvedTheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [theme])

  return (<div style={{width: '100%', height: '100%', position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <ThemeProvider defaultTheme={'white'} enableSystem={true} attribute="class">
      <MUIThemeProvider theme={muiTheme}>
        <div style={{height: 100}}></div>
        <div style={{ position: 'fixed', top: 0, right: 0 }}>
          <ToggleButtonGroup
            color="primary"
            value={theme}
            exclusive
            aria-label="ToggleMode">
            <ToggleButton value="system" onClick={() => setTheme('system')}>System</ToggleButton>
            <ToggleButton value="dark" onClick={() => setTheme('dark')}>Dark</ToggleButton>
            <ToggleButton value="light" onClick={() => setTheme('light')}>Light</ToggleButton>
          </ToggleButtonGroup>
        </div>
        {ClockTabs()}
      </MUIThemeProvider>
    </ThemeProvider>
  </div>)
}

// 拥有 tab 栏的组件，可在四个功能页面之间切换。
function ClockTabs() {
  const [selectedTab, setSelectedTab] = useState('0');
  
  return (
    <div style={{width: 1400, display: 'flex', flexDirection: 'column'}}>
      <TabContext value={selectedTab}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Tabs value={selectedTab} onChange={(e, newValue) => {setSelectedTab(newValue)}} centered>
            <Tab label="时钟" value={'0'} ></Tab>
            <Tab label="闹钟" value={'1'} ></Tab>
            <Tab label="计时器" value={'2'} ></Tab>
            <Tab label="秒表" value={'3'} ></Tab>
          </Tabs>
        </div>
        <TabPanel value={'0'} style={{ width: 600, maxWidth: '100%', margin: 'auto' }}>
          {ClockTab()}
        </TabPanel>
        <TabPanel value={'1'} style={{ width: 1400, maxWidth: '100%', margin: 'auto' }}>
          {AlarmTab()}
        </TabPanel>
        <TabPanel value={'2'} style={{ width: 600, maxWidth: '100%', margin: 'auto' }}>
          {TimerTab()}
        </TabPanel>
        <TabPanel value={'3'} style={{ width: 600, maxWidth: '100%', margin: 'auto' }}>
          {StopwatchTab()}
        </TabPanel>
      </TabContext>
    </div>
  );  
}
