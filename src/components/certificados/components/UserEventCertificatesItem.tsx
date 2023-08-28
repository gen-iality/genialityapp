import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Grid, List, Typography } from 'antd';
import { generateCert } from '../helpers/certificados.helper';
import { Certificates } from '../types';

interface Props {
  eventUser: any;
  certificate: Certificates;
  eventValue: any;
}

const { useBreakpoint } = Grid;

export const UserEventCertificatesItem = ({ eventUser, certificate, eventValue }: Props) => {
  const screens = useBreakpoint();

  return (
    <List.Item
      extra={
        <Button
          size={'middle'}
          onClick={() => generateCert(eventUser, certificate, eventValue)}
          type='default'
          style={{
            boxShadow: 'none',
          }}
          icon={<DownloadOutlined />}
        >
          {/* <Typography.Text >Descargar</Typography.Text> */}
        </Button>
      }>
      <List.Item.Meta 
        avatar={<Avatar src={eventUser.user.picture} icon={!eventUser.user.picture && <UserOutlined style={{fontSize: '20px'}} />} />}
        title={<Typography.Text strong>{eventUser.user.names}</Typography.Text>} 
        description={<Typography.Text>{eventUser.user.email}</Typography.Text>} 
      />
    </List.Item>
  );
};
