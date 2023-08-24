import { DownloadOutlined } from '@ant-design/icons';
import { Button, Grid, List, Typography } from 'antd';
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
          size={screens.xs ? 'small' : 'large'}
          onClick={() => generateCert(eventUser, certificate, eventValue)}
          type='default'
          style={{
            boxShadow: 'none',
          }}
          icon={screens.xs && <DownloadOutlined /* style={{ color: eventValue.styles.textMenu }}*/ />}>
          {!screens.xs && (
            <Typography.Text /*style={{ color: eventValue.styles.textMenu }} */>Descargar</Typography.Text>
          )}
        </Button>
      }>
      <List.Item.Meta title={<Typography.Text strong>{eventUser.properties.names}</Typography.Text>} />
    </List.Item>
  );
};
