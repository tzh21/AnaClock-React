'use client'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import ClockTab from './clockTab';
import AlarmTab from './alarmTab';
import { TabContext, TabPanel } from '@mui/lab';
import TimerTab from './timerTab';
import StopwatchTab from './stopwatchTab';

export default function Page() {
  return (<div style={{width: '100%', position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{height: 100}}></div>
    {ClockTabs()}
  </div>)
}

// 拥有 tab 栏的组件，可在四个功能页面之间切换。
function ClockTabs() {
  const [selectedTab, setSelectedTab] = useState('0')

  return (<div style={{width: 600, display: 'flex', flexDirection: 'column'}}>
    <TabContext value={selectedTab}>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Tabs value={selectedTab} onChange={(e, newValue) => {setSelectedTab(newValue)}} centered>
          <Tab label="时钟" value={'0'}></Tab>
          <Tab label="闹钟" value={'1'}></Tab>
          <Tab label="秒表" value={'2'}></Tab>
          <Tab label="计时器" value={'3'}></Tab>
        </Tabs>
      </div>
      <TabPanel value={'0'}>
        {ClockTab()}
      </TabPanel>
      <TabPanel value={'1'}>
        {AlarmTab()}
      </TabPanel>
      <TabPanel value={'2'}>
        {TimerTab()}
      </TabPanel>
      <TabPanel value={'3'}>
        {StopwatchTab()}
      </TabPanel>
    </TabContext>
  </div>)
}
