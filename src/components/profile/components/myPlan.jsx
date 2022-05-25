import { Row, Col, Card, Typography, List, Divider, Tabs, Space } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

const plan = {
  _id: {
    $oid: '6285536ce040156b63d517e5',
  },
  name: 'Free',
  price: 0,
  availables: {
    events: 1,
    users: 50,
    streaming_hours: 60,
    organizers: 1,
    access_type: 'Personalizado',
    look_and_feel: 'Personalizado',
    speakers: 2,
    chat: true,
    schedule: true,
    social_wall: true,
    simultaneous_rooms: 1,
    mini_games: 1,
    networking: false,
    certificates: true,
    domain: true,
    cloud_recording: false,
    reports: 'Basic',
    support_hours: 0,
    tickets: true,
    documents: true,
    faqs: true,
    informative_section: true,
    sponsors: true,
    news: true,
    products: true,
    videos: true,
    communications: true,
    checkin: true,
  },
};

const myPlan = ({ cUser }) => {
  return (
    <Tabs defaultActiveKey={'plan'}>
      <Tabs.TabPane tab={'Mi plan'} key={'plan'}>
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Card>
              <Typography.Text strong>
                Plan {plan.name} (${plan.price})
              </Typography.Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Typography.Text strong>
                {plan.availables.streaming_hours / 60} {plan.availables.streaming_hours / 60 === 1 ? 'Hora' : 'Horas'}
                de transmisión
              </Typography.Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Typography.Text strong>{plan.availables.users} Usuarios</Typography.Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Typography.Text strong>
                {plan.availables.events === 1 ? (
                  <>{plan.availables.events} Evento</>
                ) : (
                  <>Eventos {plan.availables.events}</>
                )}
              </Typography.Text>
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <Divider>Disponible en tu plan</Divider>
              <Row gutter={[12, 12]}>
                <Col span={8}>
                  <List>
                    <List.Item>Organizadores: {plan.availables.organizers}</List.Item>
                    <List.Item>Tipo de acceso: {plan.availables.access_type}</List.Item>
                    <List.Item>Apariencia: {plan.availables.look_and_feel}</List.Item>
                    <List.Item>Salas simultáneas: {plan.availables.simultaneous_rooms}</List.Item>
                    <List.Item>Reporte: {plan.availables.reports}</List.Item>
                    <List.Item>Hora de soporte: {plan.availables.support_hours}</List.Item>
                    <List.Item>Mini juegos: {plan.availables.mini_games}</List.Item>
                  </List>
                </Col>
                <Col span={8}>
                  <List>
                    <List.Item>Chat: {plan.availables.chat === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Agenda: {plan.availables.schedule === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Muro social: {plan.availables.social_wall === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Dominio propio: {plan.availables.domain === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>
                      Grabación en la nube: {plan.availables.cloud_recording === true ? 'Sí' : 'No'}
                    </List.Item>
                    <List.Item>Comunicaciones: {plan.availables.communications === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Checkin: {plan.availables.checkin === true ? 'Sí' : 'No'}</List.Item>
                  </List>
                </Col>
                <Col span={8}>
                  <List>
                    <List.Item>Networking: {plan.availables.networking === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Conferencistas: {plan.availables.speakers}</List.Item>
                    <List.Item>Certificados: {plan.availables.certificates === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Tickets: {plan.availables.tickets === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Documentos: {plan.availables.documents === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Preguntas frecuentes: {plan.availables.faqs === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>
                      Sección informativa: {plan.availables.informative_section === true ? 'Sí' : 'No'}
                    </List.Item>
                    <List.Item>Patrocinadores: {plan.availables.sponsors === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Noticias: {plan.availables.news === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Productos: {plan.availables.products === true ? 'Sí' : 'No'}</List.Item>
                    <List.Item>Videos: {plan.availables.videos === true ? 'Sí' : 'No'}</List.Item>
                  </List>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Mi plan 2'} key={'plan2'}>
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Card>
              <Typography.Text strong>
                Plan {plan.name} (${plan.price})
              </Typography.Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Typography.Text strong>
                {plan.availables.streaming_hours / 60} {plan.availables.streaming_hours / 60 === 1 ? 'Hora' : 'Horas'}{' '}
                de transmisión
              </Typography.Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Typography.Text strong>{plan.availables.users} Usuarios</Typography.Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Typography.Text strong>
                {plan.availables.events === 1 ? (
                  <>{plan.availables.events} Evento</>
                ) : (
                  <>Eventos {plan.availables.events}</>
                )}
              </Typography.Text>
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <Divider>Disponible en tu plan</Divider>
              <Row gutter={[12, 12]}>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Space>
                      <Typography.Text strong>Organizadores: </Typography.Text>
                      <Typography.Text>{plan.availables.organizers}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text>Organizadores: </Typography.Text>
                      <Typography.Text strong>{plan.availables.organizers}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Organizadores: </Typography.Text>
                      <Typography.Text strong>{plan.availables.organizers}</Typography.Text>
                    </Space>
                    <Typography.Text>Organizadores: {plan.availables.organizers}</Typography.Text>
                    <Typography.Text>Tipo de acceso: {plan.availables.access_type}</Typography.Text>
                    <Typography.Text>Apariencia: {plan.availables.look_and_feel}</Typography.Text>
                    <Typography.Text>Salas simultáneas: {plan.availables.simultaneous_rooms}</Typography.Text>
                    <Typography.Text>Reporte: {plan.availables.reports}</Typography.Text>
                    <Typography.Text>Hora de soporte: {plan.availables.support_hours}</Typography.Text>
                    <Typography.Text>Mini juegos: {plan.availables.mini_games}</Typography.Text>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Space>
                      <Typography.Text strong>Chat:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.chat === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Typography.Text>
                      Chat:
                      {plan.availables.chat === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Agenda:
                      {plan.availables.schedule === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Muro social:
                      {plan.availables.social_wall === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Dominio propio:
                      {plan.availables.domain === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Grabación en la nube:
                      {plan.availables.cloud_recording === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Comunicaciones:
                      {plan.availables.communications === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Checkin:
                      {plan.availables.checkin === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Typography.Text>
                      Networking:
                      {plan.availables.networking === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>Conferencistas: {plan.availables.speakers}</Typography.Text>
                    <Typography.Text>
                      Certificados:
                      {plan.availables.certificates === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Tickets:
                      {plan.availables.tickets === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Documentos:
                      {plan.availables.documents === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Preguntas frecuentes:
                      {plan.availables.faqs === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Sección informativa:
                      {plan.availables.informative_section === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Patrocinadores:
                      {plan.availables.sponsors === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Noticias:
                      {plan.availables.news === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Productos:
                      {plan.availables.products === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                    <Typography.Text>
                      Videos:
                      {plan.availables.videos === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red' }} />
                      )}
                    </Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Facturaciones'} key={'bills'}></Tabs.TabPane>
      <Tabs.TabPane tab={'Notificaciones'} key={'notifications'}></Tabs.TabPane>
    </Tabs>
  );
};

export default myPlan;
