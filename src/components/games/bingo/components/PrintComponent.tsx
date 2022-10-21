import { Space, Typography } from 'antd';
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
  return (
    <div
      style={{
        display: 'none',
      }}>
      <div ref={bingoCardRef}>
        {bingoUsers.map((userBingo: any) => {
          return (
            <>
              <BingoCard
                bingo={bingo}
                arrayDataBingo={userBingo.values}
                arrayLocalStorage={[]}
                changeValueLocalStorage={() => {}}
                getBingoListener={() => {}}
                setOpenOrClose={() => {}}
                isPrint
              />
              <Space>
                <Typography.Text strong>
                  ID:
                  {userBingo.id}
                </Typography.Text>
                <Typography.Text strong>
                  Nombre:
                  {userBingo?.names}
                </Typography.Text>
                <Typography.Text strong>
                  Email:
                  {userBingo?.email}
                </Typography.Text>
              </Space>
            </>
          );
        })}
      </div>
    </div>
  );
}
