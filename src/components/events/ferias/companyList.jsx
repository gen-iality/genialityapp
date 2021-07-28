import React from 'react';
import { Row, Col, Modal, Button, Typography, Space, Tag } from 'antd';
import { PhoneOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

function Companylist(props) {
  const { Text } = Typography;
  const history = useHistory();
  console.log(props)

  function showModal(info) {
    Modal.info({
      title: info.name,
      content: (
        <Space direction='vertical'>
          {props.tel && (
            <Space>
              <PhoneOutlined />
              <Text>{props.tel}</Text>
            </Space>
          )}
          {props.email && (
            <Space>
              <MailOutlined />
              <Text>{props.email}</Text>
            </Space>
          )}
          {props.pagweb && (
            <Space>
              <GlobalOutlined />
              <Text>
                <a rel='noreferrer' href={props.pagweb} target='_blank'>
                  {props.pagweb}
                </a>
              </Text>
            </Space>
          )}
        </Space>
      ),
    });
  }

  return (
    <div className='company-list'>
      <Row className='container' gutter={[10, 10]} 
      style={{ cursor: 'pointer', 
      border:`1px solid ${props.colorStand}`, 
      paddingBottom:'12px', 
      paddingTop:'12px', 
      margin:'auto',
      borderRadius:'5px'}} >
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={6}
          xl={6}
          className='col'
          onClick={() => {
            history.push(`/landing/${props.eventId}/ferias/${props.companyId}/detailsCompany`);
          }}>
          <div className='img-contact'>
            <img className='img' src={props.img} />
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={9}
          xl={9}>
          <div className='info-contact'>
            <span className='name'><Tag color={props.colorStand} style={{height:'12px'}}/>{props.name} </span>
            <span className='position'>{props.position} </span>
            <span className='description'>
              <div dangerouslySetInnerHTML={{ __html: props.description }} />
            </span>
            <span style={{marginTop:15}}><Link to={`/landing/${props.eventId}/ferias/${props.companyId}/detailsCompany`}>Ver más</Link></span>
          </div>
        </Col>
        {props.tel || props.email || props.pagweb ? (
          <Col xs={24} sm={24} md={24} lg={9} xl={9}>
            <div className='redes-contact'>
              {props.tel && (
                <span className='tel'>
                  <PhoneOutlined className='icono' /> {props.tel}
                </span>
              )}
              {props.email && (
                <span className='email'>
                  <MailOutlined className='icono' /> {props.email}
                </span>
              )}
              {props.pagweb && (
                <span className='web'>
                  <GlobalOutlined className='icono' />
                  <a
                    rel='noreferrer'
                    onClick={() => {
                      window.open(`${props.pagweb}`, '_blank');
                    }}
                    target='_blank'>
                    {props.pagweb}
                  </a>
                </span>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button type='default' className='boton' size='large' onClick={() => showModal(props)}>
                Información de contacto
              </Button>
            </div>
          </Col>
        ) : (
          ''
        )}
      </Row>
    </div>
  );
}

export default Companylist;
