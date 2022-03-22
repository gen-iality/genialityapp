import { Row, Col, Modal, Button, Typography, Space, Tag, Badge, Card } from 'antd';
import { PhoneOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

function Companylist(props) {
  const { Text, Paragraph } = Typography;
  const history = useHistory();

  function stripHtml(html) {
    // Crea un nuevo elemento div
    var temporalDivElement = document.createElement('div');
    // Establecer el contenido HTML con el div
    temporalDivElement.innerHTML = html;
    // Recuperar la propiedad de texto del elemento
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
  }

  const description = stripHtml(props.description);

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
                  <Text style={{ width: '50vw' }} ellipsis={true}>
                    {props.pagweb}
                  </Text>
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
      <Badge.Ribbon text={props.text} color={props.colorStand}>
        <Card
          bodyStyle={{ padding: '12px' }}
          style={{
            cursor: 'pointer',
            border: `1px solid ${props.colorStand}`,
            paddingBottom: '12px',
            paddingTop: '12px',
            margin: 'auto',
            borderRadius: '5px',
          }}>
          <Row className='container' gutter={[10, 10]}>
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
            <Col xs={24} sm={24} md={24} lg={9} xl={9}>
              <div className='info-contact'>
                <span className='name'>
                  <Tag color={props.colorStand} style={{ height: '12px' }} />
                  {props.name}{' '}
                </span>
                <span className='position'>{props.position} </span>
                <Paragraph
                  ellipsis={{
                    rows: 3, // Determina la cantidad de filas que se muestran antes de cortar el texto.
                    expandable: false,
                  }}
                  className='description'>
                  {description}
                </Paragraph>
                <span style={{ marginTop: 15 }}>
                  <Link to={`/landing/${props.eventId}/ferias/${props.companyId}/detailsCompany`}>
                    <Button type='primary'>Visitar stand</Button>
                  </Link>
                </span>
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
                        <Text style={{ width: '20vw' }} ellipsis={true}>
                          {props.pagweb}
                        </Text>
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
        </Card>
      </Badge.Ribbon>
    </div>
  );
}

export default Companylist;
