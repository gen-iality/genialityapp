import { Row, Button, Drawer, Typography } from 'antd';
import MenuGame from './MenuGame';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import WildCards from './WildCards';
import React from 'react';
import Millonaire from './Millonaire';
import GameStartAnnoucement from './GameStartAnnoucement';
import { IRenderViewLanding } from '../interfaces/Millonaire';
import Ranking from '../../common/Ranking';
import UsersRanking from './UsersRanking';
export default function DrawerMillonaire() {
  const {
    isVisible,
    visibilityControl,
    statusGame,
    onChangeVisibilityDrawer,
    millonaire,
    startGame,
  } = useMillonaireLanding();
  const RenderView: IRenderViewLanding = {
    NOT_STARTED: <MenuGame />,
    STARTED: <Millonaire />,
    GAME_OVER: <UsersRanking />,
    ANNOUNCEMENT: <GameStartAnnoucement />,
  };

  return (
    <>
      {visibilityControl.published && (
        <Row align='middle' justify='center' style={{ padding: '10px' }}>
          <Button size='large' type='primary' disabled={!visibilityControl.active} onClick={onChangeVisibilityDrawer}>
            ¡Jugar Millonario!
          </Button>
        </Row>
      )}
      <Drawer
        headerStyle={{
          border: 'none',
          background: millonaire.appearance?.background_color ? millonaire.appearance?.background_color : '#33166A',
        }}
        bodyStyle={{
          padding: '0px',
          background: millonaire.appearance?.background_color ? millonaire.appearance?.background_color : '#33166A',
          backgroundImage: `url(${millonaire.appearance?.background_image})`,
        }}
        width={'100vw'}
        onClose={onChangeVisibilityDrawer}
        /*  title={<Typography.Title level={5}>{millonaire.name}</Typography.Title>} */
        footer={statusGame === 'STARTED' && <WildCards />}
        visible={isVisible}>
        {RenderView[(statusGame as keyof IRenderViewLanding) || 'NOT_STARTED']}
      </Drawer>
    </>
  );
}
