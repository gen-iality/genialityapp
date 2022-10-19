import { useEffect } from 'react';
import { Tabs, Row, Col, Card, Image, Typography, Space, Grid } from 'antd';
import FeriasBanner from './feriaBanner.jsx';
import Information from './information.jsx';
import Product from './product';
import Contact from './contact';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { setTopBanner } from '../../../redux/topBanner/actions';
import { getEventCompany } from '../../empresas/services.js';
import { useState } from 'react';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import Feedback from './feedback.jsx';
import { useEventContext } from '@context/eventContext';
import ReactPlayer from 'react-player';

const { useBreakpoint } = Grid;

const FeriasDetail = (props) => {
  const screens = useBreakpoint();
  const [companyDetail, setCompanyDetail] = useState();
  const [visibleTab, setVisibleTab] = useState(true);

  const { Title } = Typography;

  let cEvent = useEventContext();

  const colorTexto = cEvent.value.styles.textMenu;
  const colorFondo = cEvent.value.styles.toolbarDefaultBg;

  useEffect(() => {
    props.setTopBanner(false);
    props.setVirtualConference(false);
    return () => {
      props.setTopBanner(true);
      props.setVirtualConference(true);
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const { match } = props;
    let eventId = match.params.event_id;
    let idCompany = match.params.id;
    //tabs quemados por visibilidad de cliente ya que no se tenia información
    if (eventId === '60cb7c70a9e4de51ac7945a2') {
      setVisibleTab(false);
    }

    obtenerEmpresa(eventId, idCompany).then((resp) => {
      setCompanyDetail(resp);
    });
  }, []);

  const obtenerEmpresa = async (eventId, idCompany) => {
    let resp = await getEventCompany(eventId, idCompany);
    return resp;
  };

  const { TabPane } = Tabs;

  return (
    <div className='feriasdetail'>
      <div style={{ position: 'relative' }}>
        <FeriasBanner imagen={companyDetail?.stand_image} />
        <div className='container-information'>
          <Information
            companyDetail={companyDetail}
            ImgCompany={companyDetail?.list_image}
            titleCompany={companyDetail && companyDetail.name}
            Description={
              <div
                dangerouslySetInnerHTML={{
                  __html: companyDetail && companyDetail.short_description,
                }}></div>
            }
          />
        </div>
      </div>

      <div
        style={{
          paddingLeft: '3vw',
          paddingRight: '3vw',
          marginTop: '2vw',
          marginBottom: '4vw',
          paddingBottom: '4vw',
        }}>
        <Tabs defaultActiveKey='1' tabPosition='top' type='card'>
          <TabPane tab='Información' key='1'>
            <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1vw' }}>
              {companyDetail && (companyDetail.video_url || companyDetail.description) ? (
                <div style={{ aspectRatio: '16/9', width: '100%' }}>
                  {companyDetail && companyDetail.video_url && (
                    <ReactPlayer width='100%' className='video' height={'100%'} url={companyDetail.video_url} />
                  )}
                  <Row style={{ paddingTop: '10px' }}>
                    <Space direction='vertical'>
                      <Title level={4}>Descripción</Title>
                      <div
                        style={{ fontSize: '18px' }}
                        dangerouslySetInnerHTML={{
                          __html: companyDetail && companyDetail.description,
                        }}></div>
                    </Space>
                  </Row>
                </div>
              ) : (
                <Feedback message='No hay información' />
              )}
            </div>
          </TabPane>
          {visibleTab && (
            <TabPane tab='Productos y Servicios' key='2'>
              {/* componente  de Productos */}
              <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1vw' }}>
                {companyDetail && companyDetail.services.length > 0 ? (
                  <div>
                    <Row gutter={[16, 16]}>
                      {companyDetail &&
                        companyDetail.services.map((prod, index) => (
                          <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key={'PoS-' + index}>
                            <Product
                              key={index}
                              imgProduct={prod.image}
                              title={prod.nombre}
                              etiqueta={prod.category}
                              description={prod.description}
                              url={prod.web_url}
                            />
                          </Col>
                        ))}
                    </Row>
                  </div>
                ) : (
                  <Feedback message='No hay productos' />
                )}
              </div>
            </TabPane>
          )}
          {visibleTab && (
            <TabPane tab='Contactos' key='3'>
              {/* componente  de contactos */}
              <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1vw' }}>
                {companyDetail && companyDetail.advisor.length > 0 ? (
                  companyDetail.advisor.map((contactos, index) => (
                    <Contact
                      key={'contacts' + index}
                      img={contactos.image}
                      name={contactos.name}
                      position={contactos.cargo}
                      codPais={contactos.codPais}
                      tel={contactos.number}
                      email={contactos.email}
                    />
                  ))
                ) : (
                  <Feedback message='No hay contactos' />
                )}
              </div>
            </TabPane>
          )}
          {visibleTab && (
            <TabPane tab='Galería' key='4'>
              <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1.5vw' }}>
                <Row gutter={[16, 16]}>
                  <Image.PreviewGroup>
                    {companyDetail && companyDetail.gallery.length > 0 ? (
                      companyDetail.gallery.map((imagen, index) => (
                        <Col key={'gallery-' + index}>
                          <Image
                            alt={'Imagen' + index + '-Galeria-' + companyDetail.name.replace(/\s+/g, '-')}
                            src={imagen.image}
                            style={{
                              height: '200px',
                              width: screens.xs ? '88vw' : '200px',
                              objectFit: 'cover',
                              borderRadius: '5px',
                            }}
                          />
                        </Col>
                      ))
                    ) : (
                      <Feedback message='No hay imágenes' />
                    )}
                  </Image.PreviewGroup>
                </Row>
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );
};
const mapStateToProps = (state, { params }) => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
  view: state.topBannerReducer.view,
  params: params,
});

const mapDispatchToProps = {
  setTopBanner,
  setVirtualConference,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FeriasDetail));
