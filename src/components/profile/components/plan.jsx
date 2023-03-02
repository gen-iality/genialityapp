import { Row, Col, Card, Typography, Divider, Space } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const plan = ({ plan, mine }) => {
  const intl = useIntl();
  return (
    <Card style={{ borderRadius: '15px' }}>
      {mine && (
        <Divider>
          <strong>
            {intl.formatMessage({
              id: 'my_plan.available.plan',
              defaultMessage: 'Disponible en tu plan',
            })}{' '}
            {plan?.name || 'Personalizado'}
          </strong>
        </Divider>
      )}

      <Row gutter={[12, 12]} wrap>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <Space direction='vertical'>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.organizers',
                  defaultMessage: 'Organizadores',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>{plan?.availables?.organizers || 'Personalizado'}</Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.access_type',
                  defaultMessage: 'Tipo de acceso',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>{plan?.availables?.access_type || 'Personalizado'}</Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.look_and_feel',
                  defaultMessage: 'Apariencia',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>{plan?.availables?.look_and_feel || 'Personalizado'}</Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.simultaneous_rooms',
                  defaultMessage: 'Salas simultáneas',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>{plan?.availables?.simultaneous_rooms || 'Personalizado'}</Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.reports',
                  defaultMessage: 'Reporte',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>
                {(plan?.availables?.reports === 'Basicas' && 'Básico') || 'Personalizado'}
              </Typography.Text>
            </Space>

            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.mini_games',
                  defaultMessage: 'Mini juegos',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>{plan?.availables?.mini_games || 'Personalizado'}</Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.certificates',
                  defaultMessage: 'Certificados',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>
                {plan?.availables?.certificates === false ? (
                  <CloseOutlined style={{ color: 'red' }} />
                ) : plan?.availables?.certificates ? (
                  plan?.availables?.certificates
                ) : (
                  'Personalizado'
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.later_days',
                  defaultMessage: 'Días posteriores',
                })}
                :{' '}
              </Typography.Text>
              <Typography.Text>{plan?.availables?.later_days || 'Personalizado'}</Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <Space direction='vertical'>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.chat',
                  defaultMessage: 'Chat',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.chat ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.schedule',
                  defaultMessage: 'Agenda',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.schedule ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.social_wall',
                  defaultMessage: 'Muro social',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.social_wall ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.domain',
                  defaultMessage: 'Dominio propio',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.domain ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.cloud_recording',
                  defaultMessage: 'Grabación en la nube',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.cloud_recording ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.communications',
                  defaultMessage: 'Comunicaciones',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.communications ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.checkin',
                  defaultMessage: 'Checkin',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.checking ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.speakers',
                  defaultMessage: 'Conferencistas',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.speakers ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.networking',
                  defaultMessage: 'Networking',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.networking ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <Space direction='vertical'>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.support_email',
                  defaultMessage: 'Soporte de email',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.support_email ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.tickets',
                  defaultMessage: 'Tickets',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.tickets ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.documents',
                  defaultMessage: 'Documentos',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.documents ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.faqs',
                  defaultMessage: 'Preguntas frecuentes',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.faqs ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.informative_section',
                  defaultMessage: 'Sección informativa',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.informative_section ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.sponsors',
                  defaultMessage: 'Patrocinadores',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.sponsors ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.news',
                  defaultMessage: 'Noticias',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.news ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.products',
                  defaultMessage: 'Productos',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.products ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
                )}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text strong>
                {intl.formatMessage({
                  id: 'my_plan.videos',
                  defaultMessage: 'Videos',
                })}
                :
              </Typography.Text>
              <Typography.Text>
                {plan ? (
                  <>
                    {plan?.availables?.videos ? (
                      <CheckOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ color: 'red' }} />
                    )}
                  </>
                ) : (
                  <>Personalizado</>
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
