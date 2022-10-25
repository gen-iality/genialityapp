import React from 'react';
import { List, Avatar } from 'antd';
import PrintCardBoard from './PrintCardBoard';
import PrintComponent from './PrintComponent';
import { useRef } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
export default function AssignmentCard({ user, bingo }: any) {
  const bingoUser = useRef(null);
  return (
    <List.Item
      key={user?._id}
      actions={[
        <>
          {user?.bingo ? (
            <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
          )}
          <PrintCardBoard cardboardCode={user?._id} bingoCardRef={bingoUser} />
        </>,
      ]}>
      <List.Item.Meta
        avatar={
          user?.properties?.picture ? (
            <Avatar src={user?.properties?.picture} size={47} />
          ) : (
            <Avatar icon={<UserOutlined />} size={47} />
          )
        }
        title={user?.properties?.names}
        description={user?.properties?.email}
      />
      <PrintComponent
        bingoCardRef={bingoUser}
        bingoUsers={[
          {
            names: user.properties.names,
            email: user.properties.email,
            id: user.bingo_card._id,
            values: user.bingo_card.values_bingo_card,
          },
        ]}
        bingo={bingo}
        cardboardCode='BingoCards'
        isPrint
      />
    </List.Item>
  );
}
