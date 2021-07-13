import React from 'react';
import { Row, Col, Tabs, Button } from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';

function Contact(props) {
  let numWhatsapp = props.codPais + props.tel;

  let urlNum = `https://wa.me/${numWhatsapp}`;

  return (
    <div className='contact-company'>
      <Row className='container' gutter={[10, 10]}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} className='col'>
          <div className='img-contact'>
            <img className='img' src={props.img} />
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
          <div className='info-contact'>
            <span className='name'>{props.name}</span>
            <span className='position'>{props.position} </span>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
          <div className='redes-contact'>
            <span className='tel'>
              <PhoneOutlined className='icono' />
              <a href={urlNum} target='_blank' rel='noopener noreferrer'>
                {props.tel}
              </a>
            </span>
            <span className='email'>
              <MailOutlined className='icono' /> {props.email}
            </span>
          </div>
          <Button type='default' className='boton' size='large'>
            ver mas detalles
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Contact;
