import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Drawer, Avatar, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import GamepadVariantOutline from '@2fd/ant-design-icons/lib/GamepadVariantOutline';
import Game from '../game';
import GameRanking from '../../events/game/gameRanking';
import withContext from '../../../Context/withContext';

function GameDrawer(props) {
  const { cHelper, cEvent } = props;
  const styles = cEvent.value.styles;
  const { gameData, setGameData } = cHelper;
  // Estado para hacer visible el ranking
  const [rankingVisible, setRankingVisible] = useState(false);
  const [gameVisible, setGameVisible] = useState(false);

  const showRanking = () => {
    setRankingVisible(!rankingVisible);
  };
  useEffect(() => {
    if (gameData !== '') {
      setGameVisible(true);
      setRankingVisible(false);
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
    color: `${styles.textMenu}`,
    backgroundColor: `${gameData.picture ? '' : styles.toolbarDefaultBg}`,
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
                  <GamepadVariantOutline style={iconStyles} />
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
                <GameRanking />
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
}

export default withContext(GameDrawer);
