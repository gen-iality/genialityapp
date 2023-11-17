import { useRef } from 'react';
import { Button, List, Space } from 'antd';
import { Bingo, BingoCarton } from '../../interfaces/bingo';
import PrintComponent from '../PrintComponent';
import PrintCardBoard from '../PrintCardBoard';
import { useModalLogic } from '@/hooks/useModalLogic';
import { deleteBingoCarton } from '../../services/bingo-cartons.service';

interface Props {
  bingoCartonItem: BingoCarton;
  bingo: Bingo;
  fetchBingoCartons: () => Promise<void>;
}
export const CartonItem = ({ bingoCartonItem, bingo, fetchBingoCartons }: Props) => {
  const bingoUserRef = useRef(null);
  const { closeModal, isOpenModal, openModal } = useModalLogic();
  const onDeleteCarton = async () => {
    const { error } = await deleteBingoCarton(bingoCartonItem.bingo_id, bingoCartonItem._id);
    if (!error) fetchBingoCartons();
  };

  return (
    <>
      <List.Item
        key={bingoCartonItem._id}
        actions={[
          <Space align='center'>
            <PrintCardBoard cardboardCode={bingoCartonItem?._id} bingoCardRef={bingoUserRef} />
            <Button type='dashed' onClick={onDeleteCarton}>
              Eliminar
            </Button>
            {/* {bingoCartonItem.event_user_id ? (
              <Tag color='green' style={{ padding: '4px 8px', fontSize: '14px' }}>
                Asignado
              </Tag>
            ) : (
              <Button onClick={openModal}>Asignar usuario</Button>
            )} */}
          </Space>,
        ]}>
        <List.Item.Meta title={bingoCartonItem.code} />
        {/*  {isOpenModal && (
          <AssignCardsToUser
            bingoCartonId={bingoCartonItem._id}
            visible={isOpenModal}
            onCancel={closeModal}
            eventId={bingoCartonItem.event_id}
            bingo={bingo}
          />
        )} */}
      </List.Item>
      {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
        <PrintComponent
          bingoCardRef={bingoUserRef}
          bingoUsers={[
            {
              names: '',
              email: '',
              id: bingoCartonItem._id,
              values: bingoCartonItem.values_bingo_card,
              code: bingoCartonItem?.code,
            },
          ]}
          bingo={bingo}
          cardboardCode='BingoCards'
          isPrint
          key={`${bingoCartonItem?._id}-user-print`}
        />
      )}
    </>
  );
};
