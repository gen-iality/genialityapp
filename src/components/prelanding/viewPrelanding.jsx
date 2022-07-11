import { CurrentEventContext } from '@/context/eventContext';
import { Col, Row, Layout, Card, Grid } from 'antd';
/** ant design */

import { useContext } from 'react';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const ViewPrelanding = (props) => {
  const screens = useBreakpoint();
  const cEventContext = useContext(CurrentEventContext);
  console.log('Event', cEventContext);
  const cBanner = cEventContext.value?.styles?.banner_image;
  const cContainerBgColor = cEventContext.value?.styles?.containerBgColor;
  const cBackgroundImage = cEventContext.value?.styles?.BackgroundImage;
  const cColor1 = cEventContext.value?.styles?.toolbarDefaultBg;
  const cColor2 = cEventContext.value?.styles?.textMenu;

  /**DYNAMIC STYLES */

  const desktopBlockContainerStyle = {
    paddingLeft: '60px',
    paddingRight: '60px',
    paddingTop: '40px',
    paddingBottom: '40px',
  };
  const mobileBlockContainerStyle = {
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '40px',
    paddingBottom: '40px',
  };
  return (
    <Layout className='site-layout-background'>
      <Row className='headerContainer'>
        <Col>
          <img src={cBanner}></img>
        </Col>
      </Row>
      <Content
        style={{
          backgroundColor: cContainerBgColor,
          backgroundImage: `url(${cBackgroundImage})`,
          backgroundAttachment: 'fixed',
        }}>
        <Row gutter={[0, 16]} style={screens.xs ? mobileBlockContainerStyle : desktopBlockContainerStyle}>
          <Col id='Franja de titulo' span={24}>
            <Row>
              <Col span={24}>
                <Card>Franja de titulo</Card>
              </Col>
            </Row>
          </Col>
          <Col id='Bloques del evento' span={24}>
            <Row gutter={[0, 16]} align='stretch' justify='center'>
              <Col span={24}>
                <Card style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '10px' }}>
                  Menu de bloques
                </Card>
              </Col>
              <Col span={24}>
                <Card style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '300px', borderRadius: '20px' }}>
                  Bloque de cuenta regresiva
                </Card>
              </Col>
              <Col span={24}>
                <Card style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '300px', borderRadius: '20px' }}>
                  Bloque de descripción
                </Card>
              </Col>
              <Col span={24}>
                <Card style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '300px', borderRadius: '20px' }}>
                  Bloque de conferencistas
                </Card>
              </Col>
              <Col span={24}>
                <Card style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '300px', borderRadius: '20px' }}>
                  Bloque de actividades
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ViewPrelanding;
