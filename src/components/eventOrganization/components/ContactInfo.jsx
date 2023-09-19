import { MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import { Row, Col, Card, Result, Typography, Descriptions } from 'antd';

const ContactInfo = ({ organization }) => {
  const contactNumber = organization?.contact?.celular ? organization?.contact?.celular : null;
  const data = [
    {
      key: 'email',
      label: <MailOutlined />,
      value: organization?.contact?.email,
    },
    {
      key: 'contactNumber',
      label: <PhoneOutlined />,
      value: contactNumber,
    },
    {
      key: 'social_networks',
      label: <GlobalOutlined />,
      value: organization?.social_networks?.yourSite ? (
        <a href={organization?.social_networks?.yourSite} target='_blank' rel='noopener noreferrer'>
          Sitio web
        </a>
      ) : null,
    },
  ];

  return (
    <Row justify='center' style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Row gutter={[0, 32]}>
          <Card
            bodyStyle={{ paddingTop: '0px' }}
            headStyle={{ border: 'none' }}
            style={{ width: '100%', borderRadius: 20, margin: '0 auto' }}>
            <Result
              style={{ textAlign: 'center' }}
              status='warning'
              title={`Acceso bloqueado a ${organization?.name}.`}
              subTitle={
                <Typography>
                  Lamentamos informarte que tu acceso al contenido de {organization?.name} ha sido bloqueado. Entendemos
                  que esta situación pueda ser frustrante, y estamos aquí para ayudarte a resolverla, Puedes
                  contactarnos a los siguientes medios:
                </Typography>
              }>
              <Descriptions layout='vertical' labelStyle={{ textAlign: 'center' }} contentStyle={{ textAlign: 'center' }}>
                {data.map(
                  (item) =>
                    item.value != null && (
                      <Descriptions.Item key={item.key} label={item.label}>
                        {item.value}
                      </Descriptions.Item>
                    )
                )}
              </Descriptions>
            </Result>
          </Card>
        </Row>
      </Col>
    </Row>
  );
};

export default ContactInfo;
