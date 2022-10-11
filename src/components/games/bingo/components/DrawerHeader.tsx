import { DispatchMessageService } from '@/context/MessageService';
import { Button, Col, Modal, PageHeader, Popconfirm, Space, Typography } from 'antd';
import { DrawerHeaderInterface } from '../interfaces/bingo';
import AppsBoxIcon from '@2fd/ant-design-icons/lib/AppsBox';

const { Title } = Typography;

const DrawerHeader = ({ cardboardCode, backgroundColor, color }: DrawerHeaderInterface) => {
  return (
    <Space>
      <AppsBoxIcon
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          height: '40px',
          width: '40px',
          borderRadius: '8px',
          backgroundColor: backgroundColor,
          color: color,
        }}
      />
      <Space direction='vertical' size={-3}>
        <Typography.Text type='secondary' style={{ fontSize: '14px' }}>
          ID del Cartón
        </Typography.Text>
        <Typography.Text strong style={{ fontSize: '14px' }}>
          {cardboardCode}
        </Typography.Text>
      </Space>
    </Space>
  );
};

export default DrawerHeader;
