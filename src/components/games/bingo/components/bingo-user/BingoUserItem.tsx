import { List, Avatar, Space, Tag, Button } from 'antd';
import { useRef } from 'react';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Bingo, IBingoUser } from '../../interfaces/bingo';

interface Props {
  bingoUser: IBingoUser;
  bingo: Bingo;
  index: number;
}
export const BingoUserItem = ({ bingoUser, bingo, index }: Props) => {
  const bingoUserRef = useRef(null);
  return (
    <>
      <List.Item
        key={`${bingoUser?._id || index}-user-bingo-${index}`}
        actions={[
          <Space align='center'>
            {bingoUser?.bingo ? (
              <>
                <CheckCircleOutlined style={{ color: 'green', fontSize: '21px' }} />
                <Tag color='green' style={{ padding: '4px 8px', fontSize: '14px' }}>
                  Carton asignado
                </Tag>
              </>
            ) : (
              <>
                <Button type='primary'>Asignar</Button>
              </>
            )}
          </Space>,
        ]}>
        <List.Item.Meta
          avatar={
            bingoUser?.picture ? (
              <Avatar src={bingoUser?.picture} size={47} />
            ) : (
              <Avatar icon={<UserOutlined />} size={47} />
            )
          }
          title={bingoUser?.names}
          description={bingoUser?.email}
        />
      </List.Item>
    </>
  );
};
