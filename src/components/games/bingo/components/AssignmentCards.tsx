import { useRef } from 'react';
import { Button, Card, Col, List, Row, Space, Typography } from 'antd';
import { AssignmentCardsProps } from '../interfaces/bingo';
import SearchUser from './SearchUser';
import AssignmentCard from './AssignmentCard';
import PrintComponent from './PrintComponent';
import PrintCardBoard from './PrintCardBoard';
import { CartonsList } from './cartons/CartonsList';
import { useGetBingoUsers } from '../hooks/useGetBingoUsers';

const AssignmentCards = ({ generateBingoForAllUsers, generateBingoForExclusiveUsers, bingo }: AssignmentCardsProps) => {
  const bingoCardRef = useRef();
  const { isLoadingBingoUser, pagination, filteredList: bingoUsers, setSearchTerm, searchTerm } = useGetBingoUsers(
    bingo.event_id
  );

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const onSubmitSearchUser = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Row gutter={[16, 16]} style={{ padding: '20px' }}>
      <Col span={12}>
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
          <SearchUser onSubmit={onSubmitSearchUser} handleChange={handleChange} keyboard={searchTerm} />
          <br />
          {bingoUsers.length > 0 && (
            <List
              loading={isLoadingBingoUser}
              dataSource={bingoUsers}
              className='desplazar'
              style={{ marginTop: '10px', minHeight: '100%', maxHeight: '60vh', overflowY: 'scroll' }}
              pagination={pagination}
              renderItem={(user, index) => {
                return <AssignmentCard bingoUser={user} key={index} bingo={bingo} index={index} />;
              }}
            />
          )}
        </Card>
      </Col>
      <Col span={12}>
        <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
          <CartonsList bingo={bingo} />
          <br />
        </Card>
      </Col>
      {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
        <PrintComponent
          bingoCardRef={bingoCardRef}
          bingoUsers={bingoUsers.map((bingoUser: any) => {
            return {
              code: bingoUser?.bingo_card?.code,
              email: bingoUser?.properties?.email,
              id: bingoUser?.bingo_card?.event_user_id,
              names: bingoUser?.properties?.names,
              values: bingoUser?.bingo_card?.values_bingo_card,
            };
          })}
          bingo={bingo}
          cardboardCode='BingoCards'
          isPrint
        />
      )}
    </Row>
  );
};
export default AssignmentCards;
