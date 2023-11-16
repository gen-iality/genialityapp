import { useRef } from 'react';
import { List, Space } from 'antd';
import { Bingo, BingoCarton } from '../../interfaces/bingo';
import PrintComponent from '../PrintComponent';
import PrintCardBoard from '../PrintCardBoard';

interface Props {
  bingoCartonItem: BingoCarton;
  bingo: Bingo;
}
export const CartonItem = ({ bingoCartonItem, bingo }: Props) => {
  const bingoUserRef = useRef(null);
  // const { closeModal, isOpenModal, openModal } = useModalLogic();
  return (
    <>
      <List.Item
        key={bingoCartonItem._id}
        actions={[
          <Space align='center'>
            <PrintCardBoard cardboardCode={bingoCartonItem?._id} bingoCardRef={bingoUserRef} />
            {/* {bingoCartonItem.event_user_id ? (
              <Tag color='error' style={{ padding: '4px 8px', fontSize: '14px' }}>
                Asignado
              </Tag>
            ) : (
              <Button onClick={openModal}>Asignar usuario</Button>
            )} */}
          </Space>,
        ]}>
        <List.Item.Meta
          /* avatar={
          user?.properties?.picture ? (
            <Avatar src={user?.properties?.picture} size={47} />
          ) : (
            <Avatar icon={<UserOutlined />} size={47} />
          )
        } */
          title={bingoCartonItem.code}
          // description={}
        />
        {/* {isOpenModal && (
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
