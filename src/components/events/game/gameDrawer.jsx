import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Drawer, Avatar, Space } from 'antd';
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';
import Game from '../game';
import GameRanking from '../../events/game/gameRanking';

function GameDrawer(props) {
  const { gameData, setGameData, cUser, cEvent } = props;
  // let cSurveys = UseSurveysContext();
  // let cUser = UseCurrentUser();

  // Estado para hacer visible el ranking
  const [rankingVisible, setRankingVisible] = useState(true);
  const [gameVisible, setGameVisible] = useState(false);

  const showRanking = () => {
    setRankingVisible(!rankingVisible);
  };
  useEffect(() => {
    // if (!cSurveys.shouldDisplayRanking()) {
    //   setRankingVisible(true);
    // }
    if (gameData !== '') {
      setGameVisible(true);
    }
  }, [gameData]);

  function closeDrawer() {
    setGameVisible(false);
    setGameData('');
  }

  const iconStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    height: '40px',
    width: '40px',
    borderRadius: '8px',
    color: `${props.colorTexto}`,
    backgroundColor: `${gameData.picture ? '' : props.colorFondo}`,
  };
  return (
    <>
      <Drawer
        zIndex={1000}
        title={
          <Row gutter={8}>
            <Col>
              <Space>
                {gameData.picture ? (
                  <Avatar style={iconStyles} key={'img' + gameData.id} src={gameData.picture} />
                ) : (
                  <InfoCircleOutlined style={iconStyles} />
                )}
                <Space direction='vertical' size={-3}>
                  {gameData.name}
                </Space>
              </Space>
            </Col>
          </Row>
        }
        bodyStyle={{ padding: '10px' }}
        closeIcon={<CloseOutlined style={{ fontSize: '24px' }} />}
        placement='right'
        visible={gameVisible}
        onClose={closeDrawer}
        width={window.screen.width >= 768 ? (rankingVisible === false ? '100%' : '70%') : '100%'}>
        <div style={{ width: '100%', display: 'inline-block', paddingBottom: '10px' }}>
          {
            <Button type='primary' onClick={showRanking}>
              {rankingVisible === false ? 'Cerrar ranking' : 'Abrir ranking'}
            </Button>
          }
        </div>

        <Row gutter={[8, 8]} justify='center'>
          <Col xl={rankingVisible === true ? 24 : 16} xxl={rankingVisible === true ? 24 : 16}>
            <Game />
          </Col>
          <Col hidden={rankingVisible} xl={8} xxl={8}>
            <div style={{ width: '100%' }}>
              <div style={{ justifyContent: 'center', display: 'grid' }}>
                <GameRanking currentUser={cUser} cEvent={cEvent} />
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
}

export default GameDrawer;
