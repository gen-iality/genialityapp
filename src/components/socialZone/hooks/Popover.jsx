import React, { useEffect } from 'react';
import { Tooltip, Skeleton, Card, Avatar } from 'antd';
import { UserOutlined, UsergroupAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { InitialsNameUser } from './index';
import { HelperContext } from '../../../Context/HelperContext';
import { useContext } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';

const { Meta } = Card;

const PopoverInfoUser = (props) => {
  let { containtNetworking, getPropertiesUserWithId, propertiesProfile, propertiesOtherprofile } = useContext(
    HelperContext
  );

  useEffect(() => {
    let iduser = props.item.iduser;
    getPropertiesUserWithId(iduser);
  }, []);

  return (
    <Skeleton loading={false} avatar active>
      <Card
        style={{ width: 300, padding: '0', color: 'black' }}
        actions={[
          containtNetworking && (
            <Tooltip
              title='Ver perfil'
              onClick={() => props.setViewPerfil({ view: true, perfil: propertiesOtherprofile })}>
              <UserOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),

          !containtNetworking && (
            <Tooltip
              // onClick={async () => {
              //   var us = await loadDataUser(props.item);

              //   var sendResp = await props.sendFriendship({
              //     eventUserIdReceiver: us._id,
              //     userName: props.item.names || props.item.email || props.item.name,
              //   });
              //   if (sendResp._id) {
              //     let notification = {
              //       idReceive: us.account_id,
              //       idEmited: sendResp._id,
              //       emailEmited: props.currentUser.email,
              //       message: 'Te ha enviado solicitud de amistad',
              //       name: 'notification.name',
              //       type: 'amistad',
              //       state: '0',
              //     };

              //     await props.notificacion(notification, props.currentUser._id);
              //   }
              // }}
              title='Enviar solicitud Contacto'>
              <UsergroupAddOutlined style={{ fontSize: '20px', color: '#1890FF' }} />,
            </Tooltip>
          ),

          !containtNetworking && (
            <Tooltip title='Agendar cita'>
              <VideoCameraOutlined
                // onClick={async () => {
                //   var us = await props.loadDataUser(props.item);

                //   if (us) {
                //     props.agendarCita(us._id, us);
                //   }
                // }}
                style={{ fontSize: '20px', color: '#1890FF' }}
              />
              ,
            </Tooltip>
          ),
        ]}>
        <Meta
          avatar={
            props.item.user?.image ? (
              <Avatar src={props.item.user?.image} />
            ) : (
              <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={30}>
                {InitialsNameUser(props.item.name ? props.item.name : 'User')}
              </Avatar>
            )
          }
          title={
            <a
              onClick={
                props.containNetWorking
                  ? () => {
                      props.perfil(props.item);
                    }
                  : null
              }>
              {props.item.name ? props.item.name : props.item.names}
            </a>
          }
          description={props.item.email}
        />
      </Card>
    </Skeleton>
  );
};

const mapDispatchToProps = {
  setViewPerfil,
};

export default connect(null, mapDispatchToProps)(withRouter(PopoverInfoUser));
