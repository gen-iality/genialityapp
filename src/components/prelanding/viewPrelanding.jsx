import { CurrentEventContext } from '@/context/eventContext';
import { CurrentEventUserContext } from '@/context/eventUserContext';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { CurrentUserContext } from '@/context/userContext';
import { SectionsPrelanding } from '@/helpers/constants';
import { AgendaApi, EventsApi, SpeakersApi } from '@/helpers/request';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Col, Row, Layout, Card, Grid, BackTop, Avatar } from 'antd';
/** ant design */

import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ModalPermission from '../authentication/ModalPermission';
import { RenderSectios } from '../events/Description/componets/renderSectios';
import EviusFooter from '../events/Landing/EviusFooter';
import InfoEvent from '../shared/infoEvent';
import ActivityBlock from './block/activityBlock';
import CountdownBlock from './block/countdownBlock';
import SpeakersBlock from './block/speakersBlock';
import SponsorBlock from './block/sponsorBlock';
import { obtenerConfigActivity } from './hooks/helperFunction';
import MenuScrollBlock from './MenuScrollBlock';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const ViewPrelanding = ({ preview }) => {
  const mobilePreview = preview ? preview : '';
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
  // PERMITE VALIDAR SI EXISTE DESCRIPCION
  const [description, setDescription] = useState([]);
  //PERMITE VALIDAR SI EXISTE CONFERENCISTAS
  const [speakers, setSpeakers] = useState([]);
  //PERMITE VALIDAR SI EXISTEN ACTIVIDADES
  const [agenda, setAgenda] = useState([]);

  //console.log('Event', cEventContext);
  const cBanner = cEventContext.value?.styles?.banner_image;
  const cFooter = cEventContext.value?.styles?.banner_footer;
  const cContainerBgColor = cEventContext.value?.styles?.containerBgColor;
  const cBackgroundImage = cEventContext.value?.styles?.BackgroundImage;
  const bgColor = cEventContext.value?.styles?.toolbarDefaultBg;
  const textColor = cEventContext.value?.styles?.textMenu;

  //PERMITE INGRESAR A LA LANDING DEL EVENTO
  useEffect(() => {
    setIsPrelanding(true);
    // window.sessionStorage.setItem('message', true);
    if (!cEventContext.value) return;
    //SE REMUEVE LA SESION EN EL EVENTO OBLIGANDO A UNIR AL USUARIO
    if (window.sessionStorage.getItem('session') !== cEventContext.value?._id) {
      window.sessionStorage.removeItem('session');
    }
    if (preview) return;
    if (window.sessionStorage.getItem('session') === cEventContext.value?._id) {
      history.replace(`/landing/${cEventContext.value?._id}`);
    }
  }, [cEventContext, cUser, cEventUser]);

  /**DYNAMIC STYLES */
  // Estilos para el contenedor de bloques en desktop y mobile
  const desktopBlockContainerStyle = {
    paddingLeft: '160px',
    paddingRight: '160px',
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
    paddingLeft: '40px',
    paddingRight: '40px',
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
  //OBTENER  DATA DEL EVENTO PARA VALIDACIONES
  useEffect(() => {
    if (!cEventContext.value) return;
    obtenerData();
    async function obtenerData() {
      const sectionsDescription = await EventsApi.getSectionsDescriptions(cEventContext?.value._id);
      let speakers = await SpeakersApi.byEvent(cEventContext?.value._id);
      const agenda = await AgendaApi.byEvent(cEventContext?.value._id);
      const speakersFiltered = speakers.filter((speaker) => speaker.published || speaker.published == 'undefined');
      const agendaConfig = await obtenerConfigActivity(cEventContext.value?._id, agenda.data);
      const agendaFiltered = agendaConfig.filter(
        (agendaCfg) => agendaCfg.isPublished || agendaCfg.isPublished == undefined
      );
      setDescription(sectionsDescription?.data || []);
      setSpeakers(speakersFiltered || []);
      setAgenda(agendaFiltered || []);
    }
  }, [cEventContext.value]);
  return (
    <Layout>
      {(cEventContext.value?.styles?.show_banner === undefined ||
        cEventContext.value?.styles?.show_banner === 'true') && (
        <Row className='headerContainer'>
          <Col span={24}>
            <img src={cBanner}></img>
          </Col>
        </Row>
      )}
      <Content
        style={{
          backgroundColor: cContainerBgColor,
          backgroundImage: `url(${cBackgroundImage})`,
          backgroundAttachment: 'fixed',
        }}>
        {/**MODAL INSCRIPCION EN EL EVENTO*/}
        <ModalPermission />
        <Row
          gutter={[0, 16]}
          style={screens.xs || mobilePreview === 'smartphone' ? mobileBlockContainerStyle : desktopBlockContainerStyle}>
          <Col id='Franja de titulo' span={24}>
            <Row>
              <Col span={24}>
                <InfoEvent paddingOff={true} preview={preview} />
              </Col>
            </Row>
          </Col>
          <Col id='Bloques del evento' span={24}>
            <Row gutter={[0, 16]} align='stretch' justify='center'>
              <Col span={24} order={1}>
                {isVisibleCardSections() ? (
                  <Card
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      borderRadius: '10px',
                      color: textColor,
                      backgroundColor: bgColor,
                      border: 'none',
                    }}>
                    <Row justify='center' align='middle'>
                      <MenuScrollBlock
                        sections={sections && sections}
                        vdescription={description}
                        vspeakers={speakers}
                        vactividades={agenda}
                      />
                    </Row>
                  </Card>
                ) : null}
              </Col>
              {visibleSection('Contador') && (
                <Col order={obtenerOrder('Contador')} span={24}>
                  <Card
                    id='Contador_block'
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      height: 'auto',
                      borderRadius: '20px',
                      color: textColor,
                      backgroundColor: bgColor,
                      border: 'none',
                    }}>
                    <CountdownBlock />
                  </Card>
                </Col>
              )}
              {visibleSection('Descripción') && description.length > 0 && (
                <Col order={obtenerOrder('Descripción')} span={24}>
                  <Card
                    id='Descripción_block'
                    className='viewReactQuill'
                    bodyStyle={
                      screens.xs || mobilePreview === 'smartphone' ? mobileBlockContentStyle : desktopBlockContentStyle
                    }
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      borderRadius: '20px',

                      backgroundColor: bgColor,
                      border: 'none',
                    }}>
                    <RenderSectios />
                  </Card>
                </Col>
              )}
              {visibleSection('Conferencistas') && speakers.length > 0 && (
                <Col span={24} order={obtenerOrder('Conferencistas')}>
                  <Card
                    id='Conferencistas_block'
                    bodyStyle={{
                      height: '100%',
                      padding: screens.xs || mobilePreview === 'smartphone' ? '10px' : '24px',
                    }}
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      height: '450px',
                      borderRadius: '20px',
                      color: textColor,
                      backgroundColor: bgColor,
                      border: 'none',
                    }}>
                    <SpeakersBlock />
                  </Card>
                </Col>
              )}
              {visibleSection('Actividades') && agenda.length > 0 && (
                <Col span={24} order={obtenerOrder('Actividades')}>
                  <Card
                    id='Actividades_block'
                    bodyStyle={{ height: '100%' }}
                    style={{
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      height: '100%',
                      borderRadius: '20px',
                      color: textColor,
                      backgroundColor: bgColor,
                      border: 'none',
                    }}>
                    <ActivityBlock preview={mobilePreview} />
                  </Card>
                </Col>
              )}
              <Col span={24}>
                <Card
                  id='Patrocinadores_block'
                  style={{
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    height: '100%',
                    borderRadius: '20px',
                    color: textColor,
                    backgroundColor: bgColor,
                    border: 'none',
                  }}>
                  <SponsorBlock />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <>
          {cFooter && (
            <div style={{ textAlign: 'center' }}>
              <img
                alt='footer'
                src={cFooter}
                style={{ width: '100%', maxWidth: '100%', maxHeight: '255px', objectFit: 'cover' }}
              />
            </div>
          )}
        </>
      </Content>

      <BackTop>
        <Avatar
          shape='square'
          icon={<ArrowUpOutlined className='animate__animated animate__bounce animate__slower animate__infinite' />}
          size={50}
          style={{
            color: textColor,
            backgroundColor: bgColor,
            borderRadius: '8px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            overflow: 'visible',
          }}></Avatar>
      </BackTop>
    </Layout>
  );
};

export default ViewPrelanding;
