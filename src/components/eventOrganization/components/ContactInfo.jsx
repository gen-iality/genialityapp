import { MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import { Result, Typography, Descriptions, Space } from 'antd';

const ContactInfo = ({ organization }) => {
  return (
    <Result
      style={{ textAlign: 'center', padding: 0 }}
      status='warning'
      title={`Acceso bloqueado a ${organization?.name}.`}
      subTitle={
        <Typography>
          Lamentamos informarte que tu acceso al contenido de {organization?.name} ha sido bloqueado. Entendemos que
          esta situación pueda ser frustrante, y estamos aquí para ayudarte a resolverla. Puedes contactarnos a los
          siguientes medios:
        </Typography>
      }>
      <Descriptions layout='horizontal' bordered column={{ xs: 1, sm: 1, md: 1, lg: 3, xl: 12, xxl: 8 }}>
        {organization?.contact?.email && (
          <Space size={16} wrap>
            <Typography key="email">
              <MailOutlined style={{ marginRight: '8px' }} />
              {organization.contact.email}
            </Typography>
            {organization?.contact?.celular && (
              <Typography  key="celular">
                <PhoneOutlined style={{ marginRight: '8px' }} />
                {organization.contact.celular}
              </Typography>
            )}
            {organization?.social_networks?.yourSite && (
              <Typography.Link key="website" href={organization.social_networks.yourSite} target='_blank' rel='noopener noreferrer'>
                <GlobalOutlined style={{ marginRight: '8px' }} />
                Sitio web
              </Typography.Link>
            )}
          </Space>
        )}
      </Descriptions>
    </Result>
  );
};

export default ContactInfo;
