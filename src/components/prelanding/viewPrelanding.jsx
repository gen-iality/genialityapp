import { CurrentEventContext } from '@/context/eventContext';
import { Col, Row, Layout } from 'antd';
/** ant design */

import { useContext } from 'react';

const { Content } = Layout;

const ViewPrelanding = (props) => {
  const cEventContext = useContext(CurrentEventContext);
  console.log('Event', cEventContext);
  const cBanner = cEventContext.value?.styles?.banner_image;
  const cContainerBgColor = cEventContext.value?.styles?.containerBgColor;
  const cBackgroundImage = cEventContext.value?.styles?.BackgroundImage;
  const cColor1 = cEventContext.value?.styles?.toolbarDefaultBg;
  const cColor2 = cEventContext.value?.styles?.textMenu;
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
        <Row style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '40px', paddingBottom: '40px' }}>
          Aqui va el contenido
        </Row>
      </Content>
    </Layout>
  );
};

export default ViewPrelanding;
