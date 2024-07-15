'use client'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import ClockTab from './clockTab';

export default function Page() {
  return (<div style={{width: '100%', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{height: 400}}></div>
    {ClockTabs()}
  </div>)
}

// 拥有 tab 栏的组件，可在四个功能页面之间切换。
function ClockTabs() {
  const [selectedTab, setSelectedTab] = useState(0)

  return (<div style={{width: 600, display: 'flex', flexDirection: 'column'}}>
    <div style={{height: 100}}></div>
    <div style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <Tabs value={selectedTab} onChange={(e, newValue) => {setSelectedTab(newValue)}} centered>
        <Tab label="时钟"></Tab>
        <Tab label="闹钟"></Tab>
        <Tab label="秒表"></Tab>
        <Tab label="计时器"></Tab>
      </Tabs>
    </div>
    {TabPanelRender(selectedTab)}
  </div>)
}

function TabPanelRender(index: number) {
  switch (index) {
    case 0:
      return ClockTab()
    case 1:
      return <div>1</div>
    case 2:
      return <div>2</div>
    case 3:
      return <div>3</div>
    default:
      return <div>default</div>
  }
}