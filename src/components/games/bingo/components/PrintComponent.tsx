import { Typography } from 'antd';
import React from 'react';
import { Bingo, RamdonBingoValue } from '../interfaces/bingo';
import BingoCard from './BingoCard';
export default function PrintComponent({
  bingo,
  arrayDataBingo,
  bingoCardRef,
  cardboardCode,
}: {
  bingo: Bingo;
  arrayDataBingo: RamdonBingoValue[];
  bingoCardRef: any;
  cardboardCode: string;
}) {
  return (
    <div
      style={{
        display: 'none',
      }}>
      <div
        style={{
          width: '210mm',
          minHeight: '297mm',
        }}
        ref={bingoCardRef}>
        <BingoCard
          bingo={bingo}
          arrayDataBingo={arrayDataBingo}
          arrayLocalStorage={[]}
          changeValueLocalStorage={() => {}}
          getBingoListener={() => {}}
          setOpenOrClose={() => {}}
        />
        <Typography.Text strong>
          ID:
          {cardboardCode}
        </Typography.Text>
      </div>
    </div>
  );
}
