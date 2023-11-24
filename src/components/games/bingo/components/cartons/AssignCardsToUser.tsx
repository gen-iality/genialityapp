import { List, Modal, ModalProps } from 'antd';
import { useGetBingoUsers } from '../../hooks/useGetBingoUsers';
import { BingoUserItem } from '../bingo-user/BingoUserItem';
import { Bingo } from '../../interfaces/bingo';

interface Props extends ModalProps {
  eventId: string;
  bingo: Bingo;
  bingoCartonId: string;
}
export const AssignCardsToUser = ({ eventId, bingo, ...modalProps }: Props) => {
  const { bingoUsers, isLoadingBingoUser, pagination } = useGetBingoUsers(eventId);
  return (
    <Modal {...modalProps} footer={null} title='Asignar carton a un usuario'>
      <List
        loading={isLoadingBingoUser}
        dataSource={bingoUsers}
        className='desplazar'
        style={{ marginTop: '10px', minHeight: '100%', maxHeight: '60vh', overflowY: 'scroll' }}
        pagination={{ ...pagination, position: 'both', showTotal: (total) => <p>Total: {total}</p> }}
        renderItem={(user, index) => {
          return <BingoUserItem bingoUser={user} bingo={bingo} index={index}/>;
        }}
      />
    </Modal>
  );
};
