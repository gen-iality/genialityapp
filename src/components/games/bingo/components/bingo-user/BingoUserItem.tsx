import { List, Avatar, Space, Tag } from 'antd';
import { useRef } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Bingo, IBingoUser } from '../../interfaces/bingo';
import PrintCardBoard from '../PrintCardBoard';
import PrintComponent from '../PrintComponent';

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
              <CheckCircleOutlined style={{ color: 'green', fontSize: '21px' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red', fontSize: '21px' }} />
            )}
            {bingo.bingo_values.length >= bingo.dimensions.minimun_values && bingoUser?.bingo_card?.code ? (
              <PrintCardBoard cardboardCode={bingoUser?._id} bingoCardRef={bingoUserRef} />
            ) : (
              <Tag color='error' style={{ padding: '4px 8px', fontSize: '14px' }}>
                Sin cartón
              </Tag>
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
        {bingo.bingo_values.length >= bingo.dimensions.minimun_values && (
          <PrintComponent
            bingoCardRef={bingoUserRef}
            bingoUsers={[
              {
                names: bingoUser?.names,
                email: bingoUser?.email,
                id: bingoUser?.bingo_card?._id,
                values: bingoUser?.bingo_card?.values_bingo_card,
                code: bingoUser?.bingo_card?.code,
              },
            ]}
            bingo={bingo}
            cardboardCode='BingoCards'
            isPrint
            key={`${bingoUser?._id || index}-user-print-${index}`}
          />
        )}
      </List.Item>
    </>
  );
};
