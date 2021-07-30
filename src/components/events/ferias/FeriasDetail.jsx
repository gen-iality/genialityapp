import React, { useEffect } from 'react';
import { Tabs, Row, Col, Card, Image, Typography, Button } from 'antd';
import FeriasBanner from './feriaBanner.jsx';
import Information from './information.jsx';
import Product from './product';
import Contact from './contact';
import { Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { setTopBanner } from '../../../redux/topBanner/actions';
//import { useLocation } from "react-router-dom";
import { getEventCompany } from '../../empresas/services.js';
import { compose } from 'redux';
import { useState } from 'react';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import ReactPlayer from 'react-player';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const FeriasDetail = (props) => {
  const [companyDetail, setCompanyDetail] = useState();

  const { Title } = Typography;

  useEffect(() => {
    props.setTopBanner(false);
    props.setVirtualConference(false);
    return () => {
      props.setTopBanner(true);
      props.setVirtualConference(true);
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0)
    const { match } = props;
    let eventId = match.params.event_id;
    let idCompany = match.params.id;

    obtenerEmpresa(eventId, idCompany).then((resp) => { 
      setCompanyDetail(resp);
      console.log(resp)
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
        <FeriasBanner
          imagen={
            companyDetail
              ? companyDetail.stand_image
              : 'http://via.placeholder.com/1500x540/50D3C9/FFFFFF?text=Banner%20empresa'
          }
        />
        <div className='container-information'>
          <Information
          companyDetail={companyDetail}
            ImgCompany={
              companyDetail ? companyDetail.list_image : 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Logo'
            }
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
        <Tabs defaultActiveKey='1' tabPosition='top'>
          <TabPane tab='Información' key='1'>
            {/* <span className='title'>
              using Lorem Ipsum is that it has a more-or-less normal distribution of letters
            </span> */}
            {companyDetail && companyDetail.video_url && (
              <iframe
                width='100%'
                className='video'
                src={companyDetail.video_url}
                title='Video empresa'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScree></iframe>
            )}
            <Row style={{ paddingTop: '10px' }}>
              <Title level={4}>Descripción</Title>
              <div
                style={{ fontSize: '18px' }}
                dangerouslySetInnerHTML={{
                  __html: companyDetail && companyDetail.description,
                }}></div>
            </Row>
          
          </TabPane>
          <TabPane tab='Productos y Servicios' key='2'>
            {/* componente  de Productos */}
            <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1vw' }}>
              {/* <span className='title'>using Lorem Ipsum is that it has a more-or-less normal distribution of letters</span> */}
              <div style={{}}>
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
            </div>
          </TabPane>
          <TabPane tab='Contactos' key='3'>
            {/* componente  de contactos */}
            <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1vw' }}>
              {/* <span className='title'>using Lorem Ipsum is that it has a more-or-less normal distribution of letters</span> */}
              {companyDetail &&
                companyDetail.advisor.length > 0 &&
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
                ))}
            </div>
          </TabPane>
          <TabPane tab='Galería' key='4'>
            <Row gutter={[16, 16]}>
              {companyDetail &&
                companyDetail.gallery.length > 0 &&
                companyDetail.gallery.map((imagen, index) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key={'gallery-' + index}>
                    <Card
                      bodyStyle={{ padding: '0px', margin: '0px' }}
                      bordered={false}
                      cover={
                        <Image
                          alt={'Imagen' + index + '-Galeria-' + companyDetail.name.replace(/\s+/g, '-')}
                          src={imagen.image}
                        />
                      }
                      style={{ width: '100%', height: '100%' }}></Card>
                  </Col>
                ))}
            </Row>
          </TabPane>
        </Tabs>

        {/* componente  de Productos */}
        {/* <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '6vw' }}>
        <span className='title'>using Lorem Ipsum is that it has a more-or-less normal distribution of letters</span>
        <div style={{ paddingLeft: '5vw', paddingRight: '5vw', marginTop: '6vw' }}>
          {
            product.map((prod)=>
            <Product
              imgProduct={prod.imgProduct}
              title={prod.title}
              etiqueta={prod.etiqueta}
              description={prod.description} />
            )
          } </div>    
      </div> */}

        {/* componente  de contactos */}
        {/* <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '6vw' }}>
          <span className='title'>using Lorem Ipsum is that it has a more-or-less normal distribution of letters</span>
            {
            contact.map((contactos)=>
              <Contact
              img={contactos.img} 
              name={contactos.name}
              position={contactos.position}
              tel={contactos.tel}
              email={contactos.email}
                /> 
            )
            }
        </div> */}
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
