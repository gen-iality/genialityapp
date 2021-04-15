import React, { useEffect } from 'react';
import { Tooltip, Skeleton, Card, Avatar } from 'antd';
import { UserOutlined, MessageTwoTone, UsergroupAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { InitialsNameUser } from './index';
import { prop } from 'ramda';

const { Meta } = Card;

const PopoverInfoUser = ({ item, props }) => {
  return (
    <Skeleton loading={false} avatar active>
      <Card
        style={{ width: 300, padding: '0', color: 'black' }}
        actions={[
          props.containNetWorking && (
            <Tooltip
              title='Ver perfil'
              onClick={() => {
                props.perfil(item);
              }}>
              <UserOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),
          /* props.containNetWorking && (
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
            </Tooltip>
          ),
 */
          props.containNetWorking && (
            <Tooltip title='Enviar solicitud Contacto'>
              <UsergroupAddOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),

          props.containNetWorking && (
            <Tooltip title='Invitar Video llamada'>
              <VideoCameraOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),
        ]}>
        <Meta
          avatar={
            item.user?.image ? (
              <Avatar src={item.user?.image} />
            ) : (
              <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={30}>
                {InitialsNameUser(item.names)}
              </Avatar>
            )
          }
          title={item.names}
          description={item.email}
        />
      </Card>
    </Skeleton>
  );
};

export default PopoverInfoUser;
