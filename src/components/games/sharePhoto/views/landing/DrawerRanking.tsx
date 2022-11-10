import { Drawer, Grid } from 'antd';
import React from 'react';
const { useBreakpoint } = Grid;
const DrawerRanking = () => {
  const screens = useBreakpoint();
  return (
    <Drawer
      title='Ranking'
      bodyStyle={{ padding: '0px' }}
      width={screens.xs ? '100vw' : '35vw'}
      visible={false}></Drawer>
  );
};

export default DrawerRanking;
