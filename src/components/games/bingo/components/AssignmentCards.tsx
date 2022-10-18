import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Input, List, Row, Space, Typography } from 'antd';
import { AssignmentCardsProps } from '../interfaces/bingo';
import SearchUser from './SearchUser';
import { useState, useEffect } from 'react';

export default function AssignmentCards({
  generateBingoForAllUsers,
  generateBingoForExclusiveUsers,
  listUsers,
}: AssignmentCardsProps) {
  const [keyboard, setKeyboard] = useState('');
  const [searchData, setDataSearchData] = useState<any[]>([]);
  const onSubmit = (values: string) => {
    const userSearch = listUsers.filter(
      (user) =>
        user.properties.names.toLocaleLowerCase().includes(values) ||
        user._id.includes(values) ||
        user.properties.email.toLocaleLowerCase().includes(values)
    );
    if (keyboard === '') {
      setDataSearchData(listUsers);
    }
    setDataSearchData(userSearch);
  };
  const handleChange = (event: any) => {
    setKeyboard(event.target.value);
  };
  useEffect(() => {
    onSubmit(keyboard);
    return () => {
      setDataSearchData([]);
    };
  }, [keyboard, listUsers]);

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
          <SearchUser onSubmit={onSubmit} handleChange={handleChange} keyboard={keyboard} />
          <br />
          <List
            dataSource={searchData}
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
