import React, { useEffect } from 'react';
import {Tabs, Row, Col} from 'antd'
import FeriasBanner from './feriaBanner.jsx'
import Information from './information.jsx'
import Product from './product'
import Contact from './contact'
import { Route } from 'react-router';
import { connect } from 'react-redux';
import {setTopBanner}  from '../../../redux/topBanner/actions';
import { useLocation } from "react-router-dom";
import { getEventCompany } from '../../empresas/services.js';


const FeriasDetail = (props) => {
  const query = new URLSearchParams(useLocation().search);
  const companyId = query.get('id');
  const eventId = query.get('eventid');
  console.log(query)
  
  useEffect(()=>{
  props.setTopBanner(false)
  return ()=>{
    props.setTopBanner(true)
    };  
  })

  useEffect(()=>{
   obtenerEmpresa()

  },[])

  const obtenerEmpresa=()=>{
  
   
    //getEventCompany()
  }

  const { TabPane } = Tabs;
  console.log("FERIAS DETAILS")
  const product = [
    {
      imgProduct:'https://uploads-ssl.webflow.com/5f96ebdef1eebdb8cfb53e8c/60161ef9ebd9172ffa95c150_insumos%20juan%20valdez%20cafe.jpg',
      title:'Nombre del producto',
      etiqueta:'producto',
      description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi hic laudantium, laboriosam  perferendis aspernatur voluptatem sint quibusdam. Assumenda, esse. Reprehenderit facilis, odiodolorum qui amet a voluptatem, perss',
    },
    {
      imgProduct:'https://uploads-ssl.webflow.com/5f96ebdef1eebdb8cfb53e8c/60161ef9ebd9172ffa95c150_insumos%20juan%20valdez%20cafe.jpg',
      title:'Nombre del producto',
      etiqueta:'producto',
      description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi hic laudantium, laboriosam  perferendis aspernatur voluptatem sint quibusdam. Assumenda, esse. Reprehenderit facilis, odiodolorum qui amet a voluptatem, perss',
    },
    {
      imgProduct:'https://uploads-ssl.webflow.com/5f96ebdef1eebdb8cfb53e8c/60161ef9ebd9172ffa95c150_insumos%20juan%20valdez%20cafe.jpg',
      title:'Nombre del producto',
      etiqueta:'producto',
      description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi hic laudantium, laboriosam  perferendis aspernatur voluptatem sint quibusdam. Assumenda, esse. Reprehenderit facilis, odiodolorum qui amet a voluptatem, perss',
    }
  ]
  const contact = [
    {
      key:'1',
      img:'https://www.trendtic.cl/wp-content/uploads/2018/05/003-Rub%C3%A9n-Belluomo-INFOR-2018.jpg',
      name:'Juan camilo',
      position:'administrador',
      tel:'3204521254',
      email:'juancamilo@gmail.com'
    },
    {
      key:'1',
      img:'https://kchcomunicacion.com/wp-content/uploads/2020/06/daniela-kreimer.jpg',
      name:'Andrea Garzon',
      position:'administrador',
      tel:'3204521254',
      email:'juancamilo@gmail.com'
    }
  ]
  return <div className='feriasdetail'>
    <div style={{position:'relative'}}>
     <FeriasBanner
      imagen={'https://chipichape.com.co/tienda/administracion//uploads/1564087046-juan%20valdez2%20banner.jpg'} />
      <div className='container-information'>
       <Information
        ImgCompany='https://www.parquecomercialguacari.com/web/wp-content/uploads/2020/02/juan-valdez-cafe.jpg'
        titleCompany='JUAN VALDEZ CAFÉ'
        Description='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi hic laudantium, laboriosam
          perferendis aspernatur voluptatem sint quibusdam. Assumenda, esse. Reprehenderit facilis, odio
          dolorum qui amet a voluptatem, perspiciatis quibusdam explicabo dolore, id architecto
          doloribus perferendis impedit ipsam fugiat? Rerum impedit quisquam, placeat accusamus debitis
          officia laboriosam, et totam quaerat veniam autem pariatur. Rem, sit eius!'/> 
      </div> 
    </div>

      <div style={{ paddingLeft: '3vw', paddingRight: '3vw', marginTop: '2vw' }}>
        <Row>
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
                    product.map((prod,index)=>
                    <Product
                      key={index}
                      imgProduct={prod.imgProduct}
                      title={prod.title}
                      etiqueta={prod.etiqueta}
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
                  contact.map((contactos,index)=>
                    <Contact
                    key={'contacts'+index}
                    img={contactos.img} 
                    name={contactos.name}
                    position={contactos.position}
                    tel={contactos.tel}
                    email={contactos.email}
                      /> 
                  )
                  }
              </div>
    
            </TabPane>
          </Tabs>
        </Row>


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
const mapStateToProps = (state) => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
  view:state.topBannerReducer.view
});

const mapDispatchToProps = {
  setTopBanner 
};

export default connect(mapStateToProps, mapDispatchToProps) (FeriasDetail);
