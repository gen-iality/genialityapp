import React from 'react';
import { List, Avatar } from 'antd';
import PrintCardBoard from './PrintCardBoard';
import PrintComponent from './PrintComponent';
import { useRef } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
export default function AssignmentCard({ user, bingo, index }: any) {
  const bingoUser = useRef(null);
  return (
    <List.Item
      key={`${user?._id || index}-user-bingo-${index}`}
      actions={[
        <>
          {user?.bingo ? (
            <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
          )}
          {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
            <PrintCardBoard cardboardCode={user?._id} bingoCardRef={bingoUser} />
          )}
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
      {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
        <PrintComponent
          bingoCardRef={bingoUser}
          bingoUsers={[
            {
              names: user?.properties?.names,
              email: user?.properties?.email,
              id: user?.bingo_card?._id,
              values: user?.bingo_card?.values_bingo_card,
            },
          ]}
          bingo={bingo}
          cardboardCode='BingoCards'
          isPrint
          key={`${user?._id || index}-user-print-${index}`}
        />
      )}
    </List.Item>
  );
}
