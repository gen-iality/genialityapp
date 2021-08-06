import React from 'react';
import { Tooltip, Skeleton, Card, Avatar } from 'antd';
import { UserOutlined, UsergroupAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { InitialsNameUser } from './index';
import { HelperContext } from '../../../Context/HelperContext';
import { useContext } from 'react';

const { Meta } = Card;

const PopoverInfoUser = ({ item, props }) => {
  let { containtNetworking } = useContext(HelperContext);

  return (
    <Skeleton loading={false} avatar active>
      <Card
        style={{ width: 300, padding: '0', color: 'black' }}
        actions={[
          containtNetworking && (
            <Tooltip
              title='Ver perfil'
              onClick={() => {
                props.perfil(item);
              }}>
              <UserOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),

          !containtNetworking && (
            <Tooltip
              onClick={async () => {
                var us = await props.loadDataUser(item);

                var sendResp = await props.sendFriendship({
                  eventUserIdReceiver: us._id,
                  userName: item.names || item.email || item.name,
                });
                if (sendResp._id) {
                  let notification = {
                    idReceive: us.account_id,
                    idEmited: sendResp._id,
                    emailEmited: props.currentUser.email,
                    message: 'Te ha enviado solicitud de amistad',
                    name: 'notification.name',
                    type: 'amistad',
                    state: '0',
                  };

                  await props.notificacion(notification, props.currentUser._id);
                }
              }}
              title='Enviar solicitud Contacto'>
              <UsergroupAddOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),

          !containtNetworking && (
            <Tooltip title='Agendar cita'>
              <VideoCameraOutlined
                onClick={async () => {
                  var us = await props.loadDataUser(item);

                  if (us) {
                    props.agendarCita(us._id, us);
                  }
                }}
                style={{ fontSize: '20px', color: '#1890FF' }}
              />
              ,
            </Tooltip>
          ),
        ]}>
        <Meta
          avatar={
            item.user?.image ? (
              <Avatar src={item.user?.image} />
            ) : (
              <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={30}>
                {InitialsNameUser(item.name ? item.name : 'User')}
              </Avatar>
            )
          }
          title={
            <a
              onClick={
                props.containNetWorking
                  ? () => {
                      props.perfil(item);
                    }
                  : null
              }>
              {item.name ? item.name : item.names}
            </a>
          }
          description={item.email}
        />
      </Card>
    </Skeleton>
  );
};

export default PopoverInfoUser;
