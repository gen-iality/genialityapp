import { useEffect, useState } from 'react';
import { PlanesApi } from '../../../helpers/request';
import { Row, Col, Card, Typography, List, Divider, Tabs, Space, Table, Statistic } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CashIcon from '@2fd/ant-design-icons/lib/Cash';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
import ViewAgendaIcon from '@2fd/ant-design-icons/lib/ViewAgenda';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    created_at: '20 / 08 / 2021',
  },
  {
    key: '2',
    name: 'John',
    created_at: '20 / 08 / 2021',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Fecha',
    dataIndex: 'created_at',
    key: 'created_at',
  },
];

const myPlan = ({ cUser }) => {
  const plan = cUser.value.plan;
  let [planes, setPlanes] = useState([]);

  useEffect(() => {
    getPlanes();
  }, []);

  const getPlanes = async () => {
    let plans = await PlanesApi.getAll();
    setPlanes(plans);
    console.log(plans, 'planes');
    console.log(plans[0]._id, plans[1]._id, plan._id);
    //const p = await PlanesApi.getOne('62864ad118aa6b4b0f5820a2');
  };

  return (
    <Tabs defaultActiveKey={'plan'}>
      <Tabs.TabPane tab={'Mi plan'} key={'plan'}>
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
              <Statistic
                title={<Typography.Text strong>Plan {plan.name}</Typography.Text>}
                value={`US $ ${plan.price}`}
                //prefix={<CashIcon style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
              <Statistic
                title={<Typography.Text strong>Horas de transmisión</Typography.Text>}
                value={`${plan.availables.streaming_hours / 60}h`}
                prefix={<TimerOutlineIcon style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
              <Statistic
                title={<Typography.Text strong>Usuarios</Typography.Text>}
                value={plan.availables.users}
                prefix={<AccountGroupIcon style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
              <Statistic
                title={<Typography.Text strong>Eventos</Typography.Text>}
                value={plan.availables.events}
                prefix={<ViewAgendaIcon style={{ fontSize: '24px' }} />}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card style={{ borderRadius: '15px' }}>
              <Divider>
                <strong>Disponible en tu plan</strong>
              </Divider>
              <Row gutter={[12, 12]}>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Space>
                      <Typography.Text strong>Organizadores: </Typography.Text>
                      <Typography.Text>{plan.availables.organizers}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Tipo de acceso: </Typography.Text>
                      <Typography.Text>{plan.availables.access_type}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Apariencia: </Typography.Text>
                      <Typography.Text>{plan.availables.look_and_feel}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Salas simultáneas: </Typography.Text>
                      <Typography.Text>{plan.availables.simultaneous_rooms}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Reporte: </Typography.Text>
                      <Typography.Text>{plan.availables.reports}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Hora de soporte: </Typography.Text>
                      <Typography.Text>{plan.availables.support_hours}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Mini juegos: </Typography.Text>
                      <Typography.Text>{plan.availables.mini_games}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Conferencistas: </Typography.Text>
                      <Typography.Text>{plan.availables.speakers}</Typography.Text>
                    </Space>
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
                    <Space>
                      <Typography.Text strong>Agenda:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.schedule === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Muro social:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.social_wall === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Dominio propio:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.domain === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Grabación en la nube:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.cloud_recording === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Comunicaciones:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.communications === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Checkin:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.checkin === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Networking:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.networking === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Space>
                      <Typography.Text strong>Certificados:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.certificates === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Tickets:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.tickets === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Documentos:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.documents === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Preguntas frecuentes:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.faqs === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Sección informativa:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.informative_section === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Patrocinadores:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.sponsors === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Noticias:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.news === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Productos:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.products === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Videos:</Typography.Text>
                      <Typography.Text>
                        {plan.availables.videos === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Facturaciones'} key={'bills'}>
        <Table dataSource={dataSource} columns={columns} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Notificaciones'} key={'notifications'}>
        <Table dataSource={dataSource} columns={columns} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Más planes'} key={'plan2'}>
        {console.log(
          planes.filter((plan1) => plan1._id !== plan._id),
          '1'
        )}
        {planes
          .filter((plan1) => plan1._id !== plan._id)
          .map((plan2) => (
            <Card style={{ borderRadius: '15px' }}>
              <Divider>
                <strong>Disponible para el plan {plan2.name}</strong>
              </Divider>
              <Row gutter={[12, 12]}>
                <Col span={6}>
                  <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
                    <Statistic
                      title={<Typography.Text strong>Plan {plan2.name}</Typography.Text>}
                      value={`US $ ${plan2.price}`}
                      //prefix={<CashIcon style={{ fontSize: '24px' }} />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
                    <Statistic
                      title={<Typography.Text strong>Horas de transmisión</Typography.Text>}
                      value={`${plan2.availables.streaming_hours / 60}h`}
                      prefix={<TimerOutlineIcon style={{ fontSize: '24px' }} />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
                    <Statistic
                      title={<Typography.Text strong>Usuarios</Typography.Text>}
                      value={plan2.availables.users}
                      prefix={<AccountGroupIcon style={{ fontSize: '24px' }} />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
                    <Statistic
                      title={<Typography.Text strong>Eventos</Typography.Text>}
                      value={plan2.availables.events}
                      prefix={<ViewAgendaIcon style={{ fontSize: '24px' }} />}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Space>
                      <Typography.Text strong>Organizadores: </Typography.Text>
                      <Typography.Text>{plan2.availables.organizers}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Tipo de acceso: </Typography.Text>
                      <Typography.Text>{plan2.availables.access_type}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Apariencia: </Typography.Text>
                      <Typography.Text>{plan2.availables.look_and_feel}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Salas simultáneas: </Typography.Text>
                      <Typography.Text>{plan2.availables.simultaneous_rooms}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Reporte: </Typography.Text>
                      <Typography.Text>{plan2.availables.reports}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Hora de soporte: </Typography.Text>
                      <Typography.Text>{plan2.availables.support_hours}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Mini juegos: </Typography.Text>
                      <Typography.Text>{plan2.availables.mini_games}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Conferencistas: </Typography.Text>
                      <Typography.Text>{plan2.availables.speakers}</Typography.Text>
                    </Space>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Space>
                      <Typography.Text strong>Chat:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.chat === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Agenda:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.schedule === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Muro social:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.social_wall === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Dominio propio:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.domain === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Grabación en la nube:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.cloud_recording === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Comunicaciones:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.communications === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Checkin:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.checkin === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Networking:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.networking === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction='vertical'>
                    <Space>
                      <Typography.Text strong>Certificados:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.certificates === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Tickets:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.tickets === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Documentos:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.documents === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Preguntas frecuentes:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.faqs === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Sección informativa:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.informative_section === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Patrocinadores:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.sponsors === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Noticias:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.news === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Productos:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.products === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Videos:</Typography.Text>
                      <Typography.Text>
                        {plan2.availables.videos === true ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        )}
                      </Typography.Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          ))}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default myPlan;
