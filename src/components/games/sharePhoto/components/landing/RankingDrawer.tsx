import Ranking from '@/components/games/common/Ranking';
import { Button, Drawer, Grid, Space } from 'antd';
import React, { useState } from 'react';

const myScore = {
  uid: '636c0c6d96121d4a4e3995a4',
  imageProfile:
    'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
  score: '100',
  name: 'Juan Camayo',
  index: 1,
};

const scores = [
  {
    uid: '636c0c6d96121d4a4e3995a4',
    imageProfile:
      'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
    score: '100',
    name: 'Juan Camayo',
    index: 1,
  },
  {
    uid: '636bb6b521b48d56a8144709',
    imageProfile:
      'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
    score: '50',
    name: 'Juan Camayo',
    index: 2,
  },
];

const type: 'time' | 'points' = 'points';

const { useBreakpoint } = Grid;

export default function RankingDrawer() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const screens = useBreakpoint();

  return (
    <Space>
      <Button type='primary' onClick={handleOpen}>
        Ver Ranking
      </Button>
      <Drawer
        title='Ranking'
        bodyStyle={{ padding: screens.xs ? '10px' : '24px', backgroundColor: '#F1F1F1' }}
        width={screens.xs ? '100vw' : '35vw'}
        visible={open}
        onClose={handleClose}>
        <Ranking scores={scores} myScore={myScore} withMyScore={true} type='points' />
      </Drawer>
    </Space>
  );
}
