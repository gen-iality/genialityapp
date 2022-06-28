import { Row, Col, Card, Typography, Divider, Space } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

const plan = ({ plan, mine, children }) => {
  return (
    <Card style={{ borderRadius: '15px' }}>
      {mine && (
        <Divider>
          <strong>Disponible en tu plan {plan.name}</strong>
        </Divider>
      )}

      <Row gutter={[12, 12]} wrap>
        {/* {children} */}
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
  );
};

export default plan;
