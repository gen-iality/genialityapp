import { Card, Col, Drawer, Row, Tabs, Grid, Button, Space } from 'antd';
import { useBingo } from '@/components/games/bingo/hooks/useBingo';
import { useDrawerBingo } from '@/components/games/bingo/hooks/useDrawerBingo';
import { DrawerBingoInterface } from '../interfaces/bingo';
import { UseEventContext } from '@/context/eventContext';
import DrawerHeader from './DrawerHeader';
import CurrentBallotValue from './CurrentBallotValue';
import BingoCard from './BingoCard';
import BallotHistoryContainer from './BallotHistoryContainer';
import PrinterIcon from '@2fd/ant-design-icons/lib/Printer';
import DownloadIcon from '@2fd/ant-design-icons/lib/Download';
import HCOActividad from '@/components/events/AgendaActividadDetalle/HOC_Actividad';
import DrawerButtonsContainer from './DrawerButtonsContainer';
import PrintCardBoard from './PrintCardBoard';
import { useRef } from 'react';
import PrintComponent from './PrintComponent';
import { CloseOutlined } from '@ant-design/icons';
const { useBreakpoint } = Grid;

const DrawerBingo = ({ openOrClose = false, setOpenOrClose = (data: boolean) => {} }: DrawerBingoInterface) => {
  const cEvent = UseEventContext();
  const screens = useBreakpoint();
  const bingoCardRef = useRef<HTMLDivElement>(null);
  const {
    arrayLocalStorage,
    arrayDataBingo,
    changeValueLocalStorage,
    ballotValue,
    cardboardCode,
    demonstratedBallots,
    clearCarton,
    dataFirebaseBingo,
    postBingoByUser,
    setDemonstratedBallots,
    getBingoListener,
    bingoData,
    bingoPrint,
  } = useDrawerBingo();
  const { bingo } = useBingo();

  const handleClose = () => {
    setDemonstratedBallots([]);
    setOpenOrClose(false);
  };

  return (
    <Drawer
      footer={screens.xs && <PrintCardBoard bingoCardRef={bingoCardRef} cardboardCode={cardboardCode} />}
      extra={!screens.xs && <PrintCardBoard bingoCardRef={bingoCardRef} cardboardCode={cardboardCode} />}
      headerStyle={{
        padding: '1px 24px',
      }}
      bodyStyle={{
        backgroundImage: `url(${cEvent.value?.styles?.BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: screens.xs ? '5px' : '24px',
        paddingRight: screens.xs ? '5px' : '24px',
      }}
      title={
        <DrawerHeader
          cardboardCode={cardboardCode}
          backgroundColor={cEvent.value?.styles?.toolbarDefaultBg}
          color={cEvent.value?.styles?.textMenu}
          code={bingoPrint[0]?.code}
        />
      }
      visible={openOrClose}
      closeIcon={
        <Space align='center' style={{ width: '100%' }} wrap>
          <CloseOutlined /> Cerrar
        </Space>
      }
      onClose={handleClose}
      width={'100vw'}
      destroyOnClose={true}>
      <Row gutter={[16, 8]} style={{}}>
        <Col xs={24} sm={24} md={10} lg={10} xl={10} xxl={10} style={{ height: '100%' }}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Card
                style={{ backgroundColor: 'transparent' }}
                bordered={false}
                bodyStyle={{
                  padding: '0px',
                  overflow: 'hidden',
                  borderRadius: '20px',
                }}>
                {/* @ts-ignore */}
                <HCOActividad isBingo={true} />
              </Card>
            </Col>
            <Col span={24}>
              <Card style={{ borderRadius: '20px' }} bordered={false} bodyStyle={{ padding: '0px 20px' }}>
                <Tabs defaultActiveKey='1' draggable style={{ width: '100%' }} tabBarStyle={{ margin: '0px' }}>
                  <Tabs.TabPane key='1' tab='Balota'>
                    <Row justify='center'>
                      <Col span={24}>
                        <CurrentBallotValue ballotValue={ballotValue} cEvent={cEvent} />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane key='2' tab='Historial de balotas'>
                    <Row>
                      <Col span={24}>
                        <BallotHistoryContainer demonstratedBallots={demonstratedBallots} />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={14} lg={14} xl={14} xxl={14} style={{}}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={18} lg={18} xl={18} xxl={18} style={{}}>
              <BingoCard
                bingo={bingo}
                arrayDataBingo={arrayDataBingo}
                arrayLocalStorage={arrayLocalStorage}
                changeValueLocalStorage={changeValueLocalStorage}
                getBingoListener={getBingoListener}
                setOpenOrClose={setOpenOrClose}
              />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6} style={{ padding: '5px' }}>
              <DrawerButtonsContainer
                arrayLocalStorage={arrayLocalStorage}
                postBingoByUser={postBingoByUser}
                clearCarton={clearCarton}
                bingoData={bingoData}
                closedrawer={handleClose}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {bingo && (
        <PrintComponent
          bingo={bingo}
          bingoCardRef={bingoCardRef}
          cardboardCode={cardboardCode}
          bingoUsers={bingoPrint}
        />
      )}
    </Drawer>
  );
};

export default DrawerBingo;
