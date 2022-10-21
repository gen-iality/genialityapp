import { Typography } from 'antd';
import React from 'react';
import { Bingo, RamdonBingoValue } from '../interfaces/bingo';
import BingoCard from './BingoCard';
export default function PrintComponent({
  bingo,
  arrayDataBingo,
  bingoCardRef,
  cardboardCode,
  bingoUsers,
}: {
  bingo: Bingo;
  arrayDataBingo: RamdonBingoValue[];
  bingoCardRef: any;
  cardboardCode: string;
  bingoUsers: any[];
  isPrint?: boolean;
}) {
  console.log('🚀 ~ file: PrintComponent.tsx ~ line 19 ~ bingoUsers', bingoUsers);
  return (
    <div
      style={{
        display: 'none',
      }}>
      <div ref={bingoCardRef}>
        {bingoUsers.map((userBingo: any) => {
          console.log('🚀 ~ file: PrintComponent.tsx ~ line 32 ~ {bingoUsers.map ~ userBingo', userBingo);
          return (
            <>
              <BingoCard
                bingo={bingo}
                arrayDataBingo={userBingo.values_bingo_card}
                arrayLocalStorage={[]}
                changeValueLocalStorage={() => {}}
                getBingoListener={() => {}}
                setOpenOrClose={() => {}}
                isPrint
              />
              <Typography.Text strong>
                ID:
                {userBingo._id}
              </Typography.Text>
              <Typography.Text strong>
                Nombre:
                {userBingo?.names}
              </Typography.Text>
              <Typography.Text strong>
                Nombre:
                {userBingo?.email}
              </Typography.Text>
            </>
          );
        })}
      </div>
    </div>
  );
}
