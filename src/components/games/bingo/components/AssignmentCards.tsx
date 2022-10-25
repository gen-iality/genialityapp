import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, List, Row, Space, Typography } from 'antd';
import { AssignmentCardsProps } from '../interfaces/bingo';
import SearchUser from './SearchUser';
import { useState, useEffect, useRef } from 'react';
import AssignmentCard from './AssignmentCard';
import PrintComponent from './PrintComponent';
import PrintCardBoard from './PrintCardBoard';

export default function AssignmentCards({
  generateBingoForAllUsers,
  generateBingoForExclusiveUsers,
  listUsers,
  bingo,
  bingoPrint,
}: AssignmentCardsProps) {
  const [keyboard, setKeyboard] = useState('');
  const [searchData, setDataSearchData] = useState<any[]>([]);
  const bingoCardRef = useRef();
  const onSubmit = (values: string) => {
    const userSearch = listUsers.filter(
      (user) =>
        user.properties.names.toLocaleLowerCase().includes(values.toLocaleLowerCase()) ||
        user._id.includes(values) ||
        user.properties.email.toLocaleLowerCase().includes(values.toLocaleLowerCase())
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
    <Row gutter={[16, 16]} style={{ padding: '20px' }}>
      <Col span={24}>
        <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
          <Row justify='space-between'>
            <Typography.Title level={5}>Lista de participantes</Typography.Title>
            <Space wrap>
              <Button
                type='primary'
                disabled={bingo.bingo_values.length < bingo.dimensions.minimun_values}
                style={{ minWidth: '250px' }}
                onClick={generateBingoForAllUsers}>
                Generar cartones a todos
              </Button>
              <Button
                disabled={bingo.bingo_values.length < bingo.dimensions.minimun_values}
                type='primary'
                style={{ minWidth: '250px' }}
                onClick={generateBingoForExclusiveUsers}>
                Generar cartones faltantes
              </Button>
            </Space>
            {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
              <PrintCardBoard bingoCardRef={bingoCardRef} cardboardCode='AlUserBingo' />
            )}
          </Row>
          <br />
          <SearchUser onSubmit={onSubmit} handleChange={handleChange} keyboard={keyboard} />
          <br />
          {searchData.length > 0 && (
            <List
              dataSource={searchData}
              className='desplazar'
              style={{ marginTop: '10px', minHeight: '100%', maxHeight: '60vh', overflowY: 'scroll' }}
              renderItem={(user: any, index) => {
                return <AssignmentCard user={user} key={index} bingo={bingo} />;
              }}
            />
          )}
        </Card>
      </Col>
      {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
        <PrintComponent
          bingoCardRef={bingoCardRef}
          bingoUsers={bingoPrint}
          bingo={bingo}
          cardboardCode='BingoCards'
          isPrint
        />
      )}

      {/* <Col span={12}></Col> */}
    </Row>
  );
}
