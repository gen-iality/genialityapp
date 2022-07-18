import { Row, Col, Card, Typography, Divider, Space } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const plan = ({ plan, mine, children }) => {
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
        {/* {children} */}
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
                    {plan?.availables?.chat === true ? (
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
                    {plan?.availables?.schedule === true ? (
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
                    {plan?.availables?.social_wall === true ? (
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
                    {plan?.availables?.domain === true ? (
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
                    {plan?.availables?.cloud_recording === true ? (
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
                    {plan?.availables?.communications === true ? (
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
                    {plan?.availables?.checking === true ? (
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
                    {plan?.availables?.speakers === true ? (
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
                    {plan?.availables?.networking === true ? (
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
                    {plan?.availables?.support_email === true ? (
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
                    {plan?.availables?.tickets === true ? (
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
                    {plan?.availables?.documents === true ? (
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
                    {plan?.availables?.faqs === true ? (
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
                    {plan?.availables?.informative_section === true ? (
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
                    {plan?.availables?.sponsors === true ? (
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
                    {plan?.availables?.news === true ? (
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
                    {plan?.availables?.products === true ? (
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
                    {plan?.availables?.videos === true ? (
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
