import { Descriptions, Space, Typography } from 'antd';
import React from 'react';
import { Bingo, RamdonBingoValue } from '../interfaces/bingo';
import BingoCard from './BingoCard';
export default function PrintComponent({
  bingo,
  bingoCardRef,
  bingoUsers,
  isPrint,
  cardboardCode,
}: {
  bingo: Bingo;
  bingoCardRef: any;
  cardboardCode: string;
  bingoUsers: any[];
  isPrint?: boolean;
}) {
  console.log('bingos', bingo);
  return (
    <div
      style={{
        display: 'none',
      }}>
      <div ref={bingoCardRef}>
        {bingoUsers.map((userBingo: any) => {
          return (
            <div style={{ padding: '50px', width: '1270px', height: '720px' }}>
              <Space style={{ width: '100%', height: '100%' }} direction='vertical'>
                <Descriptions
                  size='small'
                  bordered
                  column={1}
                  title={
                    <Typography.Title style={{ textTransform: 'capitalize' }} level={4}>
                      {bingo.name}
                    </Typography.Title>
                  }
                  layout='vertical'>
                  <Descriptions.Item label={<Typography.Text type='secondary'>ID del Cartón</Typography.Text>}>
                    <Typography.Text strong>{userBingo.id}</Typography.Text>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions size='small' bordered column={2} layout='vertical'>
                  <Descriptions.Item label={<Typography.Text type='secondary'>Nombre</Typography.Text>}>
                    <Typography.Text strong>{userBingo?.names}</Typography.Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<Typography.Text type='secondary'>Correo electrónico</Typography.Text>}>
                    <Typography.Text strong>{userBingo?.email}</Typography.Text>
                  </Descriptions.Item>
                </Descriptions>
                <BingoCard
                  bingo={bingo}
                  arrayDataBingo={userBingo.values}
                  arrayLocalStorage={[]}
                  changeValueLocalStorage={() => {}}
                  getBingoListener={() => {}}
                  setOpenOrClose={() => {}}
                  isPrint
                />
              </Space>
            </div>
          );
        })}
      </div>
    </div>
  );
}
