import React from 'react';
import { List, Avatar, Space, Typography, Alert, Tag } from 'antd';
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
        <Space align='center'>
          {user?.bingo ? (
            <CheckCircleOutlined style={{ color: 'green', fontSize: '21px' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red', fontSize: '21px' }} />
          )}
          {bingo.bingo_values.length >= bingo.dimensions.minimun_values && user?.bingo_card?.code ? (
            <PrintCardBoard cardboardCode={user?._id} bingoCardRef={bingoUser} />
          ) : (<Tag color='error' style={{ padding: '4px 8px', fontSize: '14px' }} >Sin cartón</Tag>)}
        </Space>,
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
              code: user?.bingo_card?.code,
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
