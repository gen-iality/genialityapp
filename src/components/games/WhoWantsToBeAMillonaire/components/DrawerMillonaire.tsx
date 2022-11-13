import { Row, Button, Drawer, Typography } from 'antd';
import MenuGame from './MenuGame';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import WildCards from './WildCards';
import React from 'react';
import Millonaire from './Millonaire';
import GameStartAnnoucement from './GameStartAnnoucement';
import { IRenderViewLanding } from '../interfaces/Millonaire';
export default function DrawerMillonaire() {
  const { isVisible, statusGame, onChangeVisibilityDrawer, millonaire, startGame } = useMillonaireLanding();
  console.log('🚀 ~ file: DrawerMillonaire.tsx ~ line 11 ~ DrawerMillonaire ~ statusGame', statusGame);

  const RenderView: IRenderViewLanding = {
    NOT_STARTED: <MenuGame />,
    STARTED: <Millonaire />,
    GAME_OVER: (
      <div>
        <h1>RANKINg</h1>
      </div>
    ),
    ANNOUNCEMENT: <GameStartAnnoucement />,
  };

  return (
    <>
      <Row align='middle' justify='center' style={{ padding: '10px' }}>
        <Button size='large' type='primary' onClick={onChangeVisibilityDrawer}>
          ¡Jugar Millonario!
        </Button>
      </Row>
      <Drawer
        onClose={onChangeVisibilityDrawer}
        title={<Typography.Title level={4}>{millonaire.name}</Typography.Title>}
        footer={startGame && <WildCards />}
        visible={isVisible}>
        {RenderView[(statusGame as keyof IRenderViewLanding) || 'NOT_STARTED']}
      </Drawer>
    </>
  );
}
