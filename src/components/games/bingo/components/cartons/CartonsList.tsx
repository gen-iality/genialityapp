import { Button, List, Row, Space, Typography } from 'antd';
import { Bingo } from '../../interfaces/bingo';
import { useCrudBingoCartons } from '../../hooks';
import { useModalLogic } from '@/hooks/useModalLogic';
import { GenerateCartons } from '../GenerateCartons';
import { CartonItem } from './CartonItem';
import PrintComponent from '../PrintComponent';
import { useRef } from 'react';
import PrintCardBoard from '../PrintCardBoard';
import RenderBingoCarton from './RenderBingoCarton';

interface Props {
  bingo: Bingo;
}
export const CartonsList = ({ bingo }: Props) => {
  const bingoCardRef = useRef();
  const { bingoCartons, isLoadingBingoCartons, pagination, fetchData: fetchBingoCartons } = useCrudBingoCartons(
    bingo._id
  );
  const { isOpenModal, closeModal, openModal } = useModalLogic();

  return (
    <>
      <Row justify='space-between'>
        <Typography.Title level={5}>Lista de cartones</Typography.Title>
        <Space wrap>
          <Button type='primary' style={{ minWidth: '250px' }} onClick={openModal}>
            Generar cartones
          </Button>
          {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
            <PrintCardBoard bingoCardRef={bingoCardRef} cardboardCode='AlUserBingo' />
          )}
        </Space>

        {isOpenModal && (
          <GenerateCartons
            bingoId={bingo._id}
            visible={isOpenModal}
            onCancel={closeModal}
            fetchBingoCartons={fetchBingoCartons}
            closeModal={closeModal}
          />
        )}
      </Row>
      <List
        loading={isLoadingBingoCartons}
        dataSource={bingoCartons}
        className='desplazar'
        style={{ marginTop: '10px', minHeight: '100%', maxHeight: '60vh', overflowY: 'scroll' }}
        pagination={{ ...pagination, position: 'both', showTotal: (total) => <p>Total: {total}</p> }}
        renderItem={(bingoCartonItem) => {
          return <CartonItem bingoCartonItem={bingoCartonItem} bingo={bingo} />;
        }}
      />

      {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
        <RenderBingoCarton
          bingoCardRef={bingoCardRef}
          bingoUsers={bingoCartons.map((bingoUser: any) => {
            return {
              code: bingoUser?.bingo_card?.code,
              email: bingoUser?.properties?.email,
              id: bingoUser?.bingo_card?.event_user_id,
              names: bingoUser?.properties?.names,
              values: bingoUser?.values_bingo_card,
            };
          })}
          bingo={bingo}
          cardboardCode='BingoCards'
          isPrint
        />
      )}
    </>
  );
};
