import React from 'react';
import { Row, Col, Button, Typography, message } from 'antd';
import { PhoneOutlined, MailOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';

function Contact(props) {
  let numWhatsapp = props.codPais + props.tel;
  let urlNum = `https://wa.me/${numWhatsapp}`;

  const { Text } = Typography;

  const copyText = (campo) => {
    message.success(campo + ' Copiado', 4);
  };

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
            <span className='position'>{props.position}</span>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
          <div className='redes-contact'>
            <Text
              className='tel'
              copyable={{
                text: '+' + numWhatsapp,
                onCopy: () => copyText('Numero'),
                icon: [
                  <CopyOutlined style={{ fontSize: '14px' }} key='copy-icon' />,
                  <CheckCircleOutlined style={{ fontSize: '14px' }} key='copied-icon' />,
                ],
                tooltips: ['Copiar numero', 'Numero copiado'],
              }}>
              <PhoneOutlined className='icono' />
              <a href={urlNum} target='_blank' rel='noopener noreferrer'>
                {props.tel + ' |'}
              </a>
            </Text>
            <Text
              copyable={{
                text: props.email,
                onCopy: () => copyText('Email'),
                icon: [
                  <CopyOutlined style={{ fontSize: '14px' }} key='copy-icon' />,
                  <CheckCircleOutlined style={{ fontSize: '14px' }} key='copied-icon' />,
                ],
                tooltips: ['Copiar email', 'Email copiado'],
              }}
              className='email'>
              <MailOutlined className='icono' /> {props.email + ' |'}
            </Text>
          </div>
          <Button type='default' className='boton' size='large'>
            Ver mas detalles
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Contact;
