import { Row, Col, Button, Typography, Modal, Space, Card } from 'antd';
import { PhoneOutlined, MailOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@context/MessageService';

function Contact(props) {
  let numWhatsapp = props.codPais + props.tel;
  let urlNum = `https://wa.me/${numWhatsapp}`;

  const { Text } = Typography;

  const copyText = (campo) => {
    DispatchMessageService({
      type: 'success',
      msj: campo + ' Copiado',
      action: 'show',
    });
  };

  function showModal(info) {
    Modal.info({
      title: info.name,
      content: (
        <Space direction='vertical'>
          <Space>
            <PhoneOutlined />
            <Text
              style={{ fontSize: '16px' }}
              copyable={{
                text: '+' + numWhatsapp,
                onCopy: () => copyText('Numero'),
                icon: [
                  <CopyOutlined style={{ fontSize: '16px' }} key='copy-icon' />,
                  <CheckCircleOutlined style={{ fontSize: '16px' }} key='copied-icon' />,
                ],
                tooltips: ['Copiar numero', 'Numero copiado'],
              }}>
              <a href={urlNum} target='_blank' rel='noopener noreferrer'>
                {props.tel + '  |'}
              </a>
            </Text>
          </Space>
          <Space>
            <MailOutlined />
            <Text
              style={{ fontSize: '16px' }}
              copyable={{
                text: props.email,
                onCopy: () => copyText('Email'),
                icon: [
                  <CopyOutlined style={{ fontSize: '16px' }} key='copy-icon' />,
                  <CheckCircleOutlined style={{ fontSize: '16px' }} key='copied-icon' />,
                ],
                tooltips: ['Copiar email', 'Email copiado'],
              }}>
              {props.email + ' |'}
            </Text>
          </Space>
        </Space>
      ),
    });
  }

  return (
    <Card className='contact-company' style={{ borderRadius: '8px' }}>
      <Row className='container' gutter={[10, 10]} align='stretch'>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} className='col'>
          <div className='img-contact'>
            <img
              className='img'
              src={props.img === '' ? 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Item' : props.img}
            />
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className='info-contact'>
            <span className='name'>{props.name}</span>
            <span className='position'>{props.position}</span>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
          <div className='redes-contact'>
            {props.tel && props.codPais && (
              <Text
                style={{ color: '#333F44' }}
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
            )}
            {props.email && (
              <Text
                style={{ color: '#333F44' }}
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
            )}
          </div>
          <Button type='default' className='boton' size='large' onClick={() => showModal(props)}>
            Información de contacto
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default Contact;
