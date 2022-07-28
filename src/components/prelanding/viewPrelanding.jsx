import { CurrentEventContext } from '@/context/eventContext';
import { CurrentEventUserContext } from '@/context/eventUserContext';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { CurrentUserContext } from '@/context/userContext';
import { SectionsPrelanding } from '@/helpers/constants';
import { EventsApi } from '@/helpers/request';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Col, Row, Layout, Card, Grid, BackTop, Avatar } from 'antd';
/** ant design */

import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ModalPermission from '../authentication/ModalPermission';
import { RenderSectios } from '../events/Description/componets/renderSectios';
import InfoEvent from '../shared/infoEvent';
import ActivityBlock from './block/activityBlock';
import CountdownBlock from './block/countdownBlock';
import SpeakersBlock from './block/speakersBlock';
import MenuScrollBlock from './MenuScrollBlock';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const ViewPrelanding = (props) => {
  const screens = useBreakpoint();
  //CONTEXTOS
  const cEventContext = useContext(CurrentEventContext);
  const cUser = useContext(CurrentUserContext);
  const cEventUser = useContext(CurrentEventUserContext);
  const { setIsPrelanding } = useHelper();

  //History
  const history = useHistory();

  //ESTADOS
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  console.log('Event', cEventContext);
  const cBanner = cEventContext.value?.styles?.banner_image;
  const cContainerBgColor = cEventContext.value?.styles?.containerBgColor;
  const cBackgroundImage = cEventContext.value?.styles?.BackgroundImage;
  const bgColor = cEventContext.value?.styles?.toolbarDefaultBg;
  const textColor = cEventContext.value?.styles?.textMenu;

  //PERMITE INGRESAR A LA LANDING DEL EVENTO
  useEffect(() => {
    setIsPrelanding(true);
    // window.sessionStorage.setItem('message', true);
    if (!cEventContext.value) return;
    if (window.sessionStorage.getItem('session')) {
      history.replace(`/landing/${cEventContext.value?._id}`);
    }
  }, [cEventContext, cUser, cEventUser]);

  /**DYNAMIC STYLES */
  // Estilos para el contenedor de bloques en desktop y mobile
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
  // Estilos para el contenido del bloque en desktop y mobile
  const desktopBlockContentStyle = {
    paddingLeft: '25px',
    paddingRight: '25px',
    paddingTop: '40px',
    paddingBottom: '40px',
  };
  const mobileBlockContentStyle = {
    paddingLeft: '25px',
    paddingRight: '25px',
    paddingTop: '25px',
    paddingBottom: '25px',
  };

  // Funciones para el render
  const obtenerOrder = (name) => {
    if (sections) {
      return sections && sections.filter((section) => section.name == name)[0]?.index + 2;
    } else {
      return 2;
    }
  };

  const visibleSection = (name) => {
    if (sections) {
      return sections && sections.filter((section) => section.name == name && section.status).length > 0 ? true : false;
    } else {
      return false;
    }
  };

  const isVisibleCardSections = () => {
    if (sections) {
      return sections && sections.filter((section) => section.status).length > 1 ? true : false;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!cEventContext.value) return;
    setLoading(true);
    obtainPreview();
    async function obtainPreview() {
      //OBTENENOS LAS SECCIONES DE PRELANDING
      const previews = await EventsApi.getPreviews(cEventContext.value._id);
      //SE ORDENAN LAS SECCIONES POR INDEX
      const sections = previews.data.length > 0 ? previews.data.sort((a, b) => a.index - b.index) : SectionsPrelanding;
      setSections(sections);
      setLoading(false);
    }
  }, [cEventContext]);
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
        {/**MODAL INSCRIPCION EN EL EVENTO*/}
        <ModalPermission />
        <Row gutter={[0, 16]} style={screens.xs ? mobileBlockContainerStyle : desktopBlockContainerStyle}>
          <Col id='Franja de titulo' span={24}>
            <Row>
              <Col span={24}>
                <InfoEvent paddingOff={true} />
              </Col>
            </Row>
          </Col>
          <Col id='Bloques del evento' span={24}>
            <Row gutter={[0, 16]} align='stretch' justify='center'>
              <Col span={24} order={1}>
                {isVisibleCardSections() ? (
                  <Card style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '10px' }}>
                    <Row justify='center' align='middle'>
                      <MenuScrollBlock sections={sections && sections} />
                    </Row>
                  </Card>
                ) : null}
              </Col>
              {visibleSection('Contador') && (
                <Col order={obtenerOrder('Contador')} span={24}>
                  <Card
                    id='Contador_block'
                    style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: 'auto', borderRadius: '20px' }}>
                    <CountdownBlock />
                  </Card>
                </Col>
              )}
              {visibleSection('Descripción') && (
                <Col order={obtenerOrder('Descripción')} span={24}>
                  <Card
                    id='Descripción_block'
                    className='viewReactQuill'
                    bodyStyle={screens.xs ? mobileBlockContentStyle : desktopBlockContentStyle}
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      borderRadius: '20px',
                    }}>
                    <RenderSectios />
                  </Card>
                </Col>
              )}
              {visibleSection('Conferencistas') && (
                <Col span={24} order={obtenerOrder('Conferencistas')}>
                  <Card
                    id='Conferencistas_block'
                    bodyStyle={{ height: '100%', padding: screens.xs ? '10px' : '24px' }}
                    style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '450px', borderRadius: '20px' }}>
                    <SpeakersBlock />
                  </Card>
                </Col>
              )}
              {visibleSection('Actividades') && (
                <Col span={24} order={obtenerOrder('Actividades')}>
                  <Card
                    id='Actividades_block'
                    bodyStyle={{ height: '100%' }}
                    style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '100%', borderRadius: '20px' }}>
                    <ActivityBlock />
                  </Card>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Content>
      <BackTop>
        <Avatar
          shape='square'
          icon={<ArrowUpOutlined />}
          size={{ xs: 50, sm: 50, md: 50, lg: 50, xl: 50, xxl: 50 }}
          style={{
            color: textColor,
            backgroundColor: bgColor,
            borderRadius: '8px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}></Avatar>
      </BackTop>
    </Layout>
  );
};

export default ViewPrelanding;
