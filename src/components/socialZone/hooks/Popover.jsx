import React from 'react';
import { Tooltip, Skeleton, Card, Avatar } from 'antd';
import { UserOutlined, MessageTwoTone, UsergroupAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { InitialsNameUser } from './index';

const { Meta } = Card;

const PopoverInfoUser = ({ item, props }) => {
  return (
    <Skeleton loading={false} avatar active>
      <Card
        style={{ width: 300, padding: '0', color: 'black' }}
        actions={[
          <Tooltip title='Ver perfil'>
            <UserOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
          </Tooltip>,
          <Tooltip title='Chat(Hablar)'>
            <MessageTwoTone
              onClick={() =>
                props.createNewOneToOneChat(
                  props.currentUser.uid,
                  props.currentUser.names,
                  item.user.uid,
                  item.user.names
                )
              }
              style={{ fontSize: '20px', color: '#1890FF' }}
            />
            ,
          </Tooltip>,

          <Tooltip title='Enviar solicitud Contacto'>
            <UsergroupAddOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
          </Tooltip>,

          <Tooltip title='Invitar Video llamada'>
            <VideoCameraOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
          </Tooltip>,
        ]}>
        <Meta
          avatar={
            item.user?.image ? (
              <Avatar src={item.user?.image} />
            ) : (
              <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={30}>
                {InitialsNameUser(item.user.names)}
              </Avatar>
            )
          }
          title={item.user.names}
          description={item.user.email}
        />
      </Card>
    </Skeleton>
  );
};

export default PopoverInfoUser;
