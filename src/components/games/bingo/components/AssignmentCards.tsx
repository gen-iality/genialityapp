import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Input, List, Row, Space, Typography } from 'antd';
import { AssignmentCardsProps } from '../interfaces/bingo';

export default function AssignmentCards({
  generateBingoForAllUsers,
  generateBingoForExclusiveUsers,
  listUsers,
}: AssignmentCardsProps) {
  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col span={24} style={{ textAlign: 'right' }}></Col>
      <Col span={12}>
        <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
          <Row justify='space-between' /* align='middle' */ wrap>
            <Typography.Title level={5}>Lista de participantes</Typography.Title>
            <Space direction='vertical'>
              <Button type='primary' onClick={generateBingoForAllUsers}>
                Generar cartones a todos
              </Button>
              <Button type='primary' onClick={generateBingoForExclusiveUsers}>
                Generar cartones faltantes
              </Button>
            </Space>
          </Row>
          <br />
          <Input.Search
            addonBefore={<UserOutlined />}
            placeholder='Buscar participante'
            allowClear
            style={{ width: '100%' }}
            /* onSearch={onSearch} */
          />
          <br />
          <List
            dataSource={listUsers}
            style={{ marginTop: '10px' }}
            renderItem={(user: any) => (
              <List.Item
                key={user?._id}
                actions={[
                  <>
                    {user?.bingo ? (
                      <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
                    )}
                  </>,
                ]}>
                <List.Item.Meta
                  avatar={
                    user?.properties?.picture ? (
                      <Avatar src={user?.properties?.picture} size={47} />
                    ) : (
                      <Avatar icon={<UserOutlined />} size={47} />
                    )
                  }
                  title={user?.properties?.names}
                  description={user?.properties?.email}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}></Col>
    </Row>
  );
}
