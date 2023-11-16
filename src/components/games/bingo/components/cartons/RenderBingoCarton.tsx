import React from 'react';
import { Space } from 'antd';
import { Bingo } from '../../interfaces/bingo';
import BingoCard from '../BingoCard';

interface Props {
  bingo: Bingo;
  bingoCardRef: any;
  cardboardCode: string;
  bingoUsers: any[];
  isPrint?: boolean;
}
export default function RenderBingoCarton({ bingo, bingoCardRef, bingoUsers, isPrint, cardboardCode }: Props) {
  return (
    <div
      style={{
        display: 'none',
      }}>
      <div ref={bingoCardRef}>
        {bingoUsers.map((userBingo: any, index) => {
          return (
            <div key={index} style={{ padding: '50px 0px' }}>
              <Space style={{ width: '100%', height: '100%' }} direction='vertical'>
                <BingoCard
                  bingo={bingo}
                  arrayDataBingo={userBingo.values}
                  arrayLocalStorage={[]}
                  changeValueLocalStorage={() => {}}
                  getBingoListener={() => () => {}}
                  setOpenOrClose={() => {}}
                  isPrint
                  userBingoCode={userBingo.code}
                />
              </Space>
            </div>
          );
        })}
      </div>
    </div>
  );
}
