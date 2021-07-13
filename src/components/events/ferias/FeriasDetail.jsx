import React, { useEffect } from 'react';
import {Tabs, Row, Col, Card, Image} from 'antd'
import FeriasBanner from './feriaBanner.jsx'
import Information from './information.jsx'
import Product from './product'
import Contact from './contact'
import { Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import {setTopBanner}  from '../../../redux/topBanner/actions';
//import { useLocation } from "react-router-dom";
import { getEventCompany } from '../../empresas/services.js';
import { compose } from 'redux';
import { useState } from 'react';
import { setVirtualConference } from '../../../redux/virtualconference/actions';


const FeriasDetail = (props) => {
  
  const [companyDetail,setCompanyDetail]=useState();
  
  useEffect(()=>{
  props.setTopBanner(false)
  props.setVirtualConference(false)
  return ()=>{
    props.setTopBanner(true)
    props.setVirtualConference(true)
    };  
  })

  useEffect(()=>{
  
  const {match}= props;
  let eventId=match.params.event_id;
  let idCompany=match.params.id;
  
  obtenerEmpresa( eventId,idCompany).then((resp)=>{
    console.log("DATOS EMPRESA")
    console.log(resp)
    setCompanyDetail(resp)
    
  })

  },[])

  const obtenerEmpresa=async (eventId,idCompany)=>{   
   let resp= await getEventCompany(eventId,idCompany);
   return resp;
  }

  const { TabPane } = Tabs;

  return <div className='feriasdetail'>
    
    <div style={{position:'relative'}}>
     <FeriasBanner
      imagen={companyDetail?companyDetail.stand_image:'https://chipichape.com.co/tienda/administracion//uploads/1564087046-juan%20valdez2%20banner.jpg'} />
      <div className='container-information'>
       <Information
        ImgCompany={companyDetail ? companyDetail.list_image:'https://www.parquecomercialguacari.com/web/wp-content/uploads/2020/02/juan-valdez-cafe.jpg'}
        titleCompany={companyDetail && companyDetail.name}
        Description={ <div
          dangerouslySetInnerHTML={{
            __html: companyDetail && companyDetail.description,
          }}></div>}/> 
      </div> 
    </div>

      <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '2vw' }}>
            <Tabs defaultActiveKey="1" tabPosition='top'>
            <TabPane tab="Video" key="1" >
            <span className='title'>using Lorem Ipsum is that it has a more-or-less normal distribution of letters</span>
            <iframe width="100%"  className='video' src="https://www.youtube.com/embed/bA_PwyZwqM4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScree></iframe>
            </TabPane>
            <TabPane tab="Productos o Servicios" key="2">
             {/* componente  de Productos */}
              <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1vw' }}>
                {/* <span className='title'>using Lorem Ipsum is that it has a more-or-less normal distribution of letters</span> */}
                <div style={{ paddingLeft: '5vw', paddingRight: '5vw'}}>
                  {
                    companyDetail && companyDetail.services.map((prod,index)=>
                    <Product
                      key={index}
                      imgProduct={prod.image}
                      title={prod.nombre}
                      etiqueta={prod.category}
                      description={prod.description} />
                    )
                  } </div>    
              </div>
            </TabPane>
            <TabPane tab="Contactos" key="3">
               {/* componente  de contactos */}
              <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '1vw' }}>
                {/* <span className='title'>using Lorem Ipsum is that it has a more-or-less normal distribution of letters</span> */}
                  {
                  companyDetail && companyDetail.advisor.length>0 && companyDetail.advisor.map((contactos,index)=>
                    <Contact
                    key={'contacts'+index}
                    img={contactos.image} 
                    name={contactos.name}
                    position={contactos.cargo}
                    tel={contactos.number}
                    email={contactos.email}
                      /> 
                  )
                  }
              </div>
    
            </TabPane>
            <TabPane tab="Galería" key="4">
              <>
              {companyDetail && companyDetail.gallery.length>0 && companyDetail.gallery.map((imagen,index)=>
                <Card style={{ width: 300,float:'left', marginLeft:20 }} key={'gallery-'+index}
                hoverable>
                   <Image alt="example" src={imagen.image} />
                </Card>
              )}
              </>
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
};
const mapStateToProps = (state,{params}) => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
  view:state.topBannerReducer.view,
  params:params
});

const mapDispatchToProps = {
  setTopBanner,
  setVirtualConference
};



export default withRouter(connect(mapStateToProps, mapDispatchToProps) (FeriasDetail)) ;
