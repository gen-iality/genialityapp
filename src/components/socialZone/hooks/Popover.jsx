import React, { useEffect } from 'react';
import { Tooltip, Skeleton, Card, Avatar } from 'antd';
import { UserOutlined, MessageTwoTone, UsergroupAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { InitialsNameUser } from './index';
import { prop } from 'ramda';

const { Meta } = Card;

const PopoverInfoUser = ({ item, props }) => {
  useEffect(() => {
    console.log('POPOVER INFO USER=>', props.currentUser);
  }, []);

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
            <Tooltip
              onClick={async () => {
                console.log('ACA ITEM');
                console.log(item);

                var us = await props.loadDataUser(item);
                console.log('USER PERFIL=>', us);

                var sendResp = await props.sendFriendship({
                  eventUserIdReceiver: us._id,
                  userName: props.currentUser.names || props.currentUser.email
                });
                if (sendResp._id) {
                  let notification = {
                    idReceive: us.account_id,
                    idEmited: sendResp._id,
                    emailEmited: props.currentUser.email,
                    message: 'Te ha enviado solicitud de amistad',
                    name: 'notification.name',
                    type: 'amistad',
                    state: '0'
                  };
                  console.log('RESPUESTA SEND AMISTAD' + sendResp._id);
                  await props.notificacion(notification, props.currentUser._id);
                }
              }}
              title='Enviar solicitud Contacto'>
              <UsergroupAddOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),

          props.containNetWorking && (
            <Tooltip title='Invitar Video llamada'>
              <VideoCameraOutlined
                onClick={async () => {
                  console.log('ACA ITEM');
                  console.log(item);

                  var us = await props.loadDataUser(item);
                  console.log('USER PERFIL=>', us);
                  if (us) {
                    props.agendarCita(us._id, us);
                  }
                }}
                style={{ fontSize: '20px', color: '#1890FF' }}
              />
              ,
            </Tooltip>
          )
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
