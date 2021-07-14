import React, { useState } from 'react'
import {Row, Col, Tabs, Button, } from 'antd'
import {PhoneOutlined, MailOutlined,GlobalOutlined} from '@ant-design/icons';
import { useHistory } from 'react-router';

function Companylist(props) {
  const history=useHistory()
 
    return(
      <div className='company-list' >
        <Row className='container' gutter={[10,10]} >
               <Col xs={24} sm={24} md={24} lg={6} xl={6} className='col' onClick={()=>{ history.push(`/landing/${props.eventId}/ferias/${props.companyId}/detailsCompany`)}  }>            
                 <div  className='img-contact' > 
                   <img className='img' src={props.img} />
                 </div>
               </Col>
               <Col xs={24} sm={24} md={24} lg={9} xl={9} onClick={()=>{ history.push(`/landing/${props.eventId}/ferias/${props.companyId}/detailsCompany`)}  }>
                 <div className='info-contact'>
                   <span className='name'>{props.name}</span>
                   <span className='position'>{props.position} </span>
                   <span className='description'> <div dangerouslySetInnerHTML={{ __html: props.description}} /></span>
                 </div>
               </Col>
               <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                 <div className='redes-contact'>
                  { props.tel && <span className='tel'> <PhoneOutlined className='icono'/> {props.tel} </span>}
                  {props.email && <span className='email'> <MailOutlined className='icono'/> {props.email} </span>}
                  {props.pagweb &&<span className='web'> <GlobalOutlined  className='icono'/><a rel="noreferrer" onClick={()=>{window.open(`${props.pagweb}`, '_blank')}} target="_blank"> {props.pagweb}</a> </span>}
                 </div>
                 <Button type='default' className='boton' size='large'>
                    ver mas detalles
                  </Button>
               </Col>
             </Row>
           </div>
    ) 
}

export default Companylist;