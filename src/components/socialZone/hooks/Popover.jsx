import React, { useEffect } from 'react';
import { Tooltip, Skeleton, Card, Avatar, notification, Spin } from 'antd';
import { UserOutlined, UsergroupAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { InitialsNameUser } from './index';
import { HelperContext } from '../../../context/HelperContext';
import { useContext } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import { addNotification, haveRequest, isMyContacts, SendFriendship } from '../../../helpers/netWorkingFunctions';
import { UseUserEvent } from '../../../context/eventUserContext';
import { UseEventContext } from '../../../context/eventContext';
import { setUserAgenda } from '../../../redux/networking/actions';
import { useState } from 'react';
import { EventsApi } from '../../../helpers/request';

const { Meta } = Card;

const PopoverInfoUser = (props) => {
  const [userSelected, setUserSelected] = useState();
  let eventUserContext = UseUserEvent();
  let eventContext = UseEventContext();
  let {
    containtNetworking,
    getPropertiesUserWithId,
    propertiesProfile,
    propertiesOtherprofile,
    requestSend,
    obtenerContactos,
    contacts,
  } = useContext(HelperContext);

  useEffect(() => {
    let user = { _id: props.item.iduser, properties: props.item.properties, eventUserId: props.item._id, send: 0 };   
    setUserSelected(user);
    obtainContacts();
    async function obtainContacts() {
      await obtenerContactos();
    }
    return ()=>{
      setUserSelected(null);
    }
  }, [props.item.iduser]);

  return (
    <Skeleton loading={false} avatar active>
      <Card
        bordered={false}
        style={{ width: '300px', padding: '0', color: 'black' }}
        actions={
          containtNetworking && [
            userSelected ? (
              <Tooltip title='Ver perfil' onClick={() => props.setViewPerfil({ view: true, perfil: userSelected })}>
                <UserOutlined style={{ fontSize: '20px', color: '#1890FF' }} />
              </Tooltip>
            ) : (
              <Spin />
            ),
            userSelected ? (
              <Tooltip
                onClick={
                  haveRequest(userSelected, requestSend, 1) ||
                  (userSelected.send && userSelected.send == 1) ||
                  isMyContacts(userSelected, contacts)
                    ? null
                    : async () => {
                        setViewPerfil({ view: false, perfil: userSelected });
                        let userSelectedTwo = { ...userSelected, loading: true };
                        setUserSelected(userSelectedTwo);
                        let userReceive = {
                          eventUserIdReceiver: userSelected.eventUserId,
                          userName:
                            userSelected.properties.names ||
                            userSelected.properties.name ||
                            userSelected.properties.email,
                        };
                        let sendResp = await SendFriendship(userReceive, eventUserContext.value, eventContext.value);
                        if (sendResp._id) {
                          let notificationR = {
                            idReceive: userSelected._id,
                            idEmited: sendResp._id,
                            emailEmited: eventUserContext.value.email || eventUserContext.value.user.email,
                            message:
                              (eventUserContext.value.names ||
                                eventUserContext.value.user.names ||
                                eventUserContext.value.user.name) + ' te ha enviado solicitud de contacto',
                            name: 'notification.name',
                            type: 'amistad',
                            state: '0',
                          };
                          let userSelectedTwo = { ...userSelected, loading: false, send: 1 };
                          setUserSelected(userSelectedTwo);

                          addNotification(notificationR, eventContext.value, eventUserContext.value);
                          notification['success']({
                            message: 'Correcto!',
                            description: 'Se ha enviado la solicitud de amistad correctamente',
                          });
                        }
                      }
                }
                title={
                  !userSelected.loading
                    ? isMyContacts(userSelected, contacts)
                      ? 'Ya es tu contacto'
                      : haveRequest(userSelected, requestSend, 1) || (userSelected.send && userSelected.send == 1)
                      ? 'Solicitud de contacto enviada'
                      : 'Enviar solicitud Contacto'
                    : ''
                }>
                {!userSelected.loading ? (
                  <UsergroupAddOutlined
                    style={{
                      fontSize: '20px',
                      color:
                        haveRequest(userSelected, requestSend, 1) ||
                        (userSelected.send && userSelected.send == 1) ||
                        isMyContacts(userSelected, contacts)
                          ? 'gray'
                          : '#1890FF',
                    }}
                  />
                ) : (
                  <Spin />
                )}
              </Tooltip>
            ) : (
              <Spin />
            ),
            userSelected ? (
              <Tooltip title='Agendar cita'>
                <VideoCameraOutlined
                  onClick={async () => {
                    setViewPerfil({ view: false, perfil: userSelected });
                    //SE CREA EL OBJETO CON ID INVERTIDO PARA QUE EL COMPONENTE APPOINT MODAL FUNCIONE CORRECTAMENTE
                    let evetuser = userSelected._id;
                    let userReview = {
                      ...userSelected,
                      _id: userSelected.eventUserId,
                      evetuserId: evetuser,
                    };
                    props.setUserAgenda(userReview);
                  }}
                  style={{ fontSize: '20px', color: '#1890FF' }}
                />
              </Tooltip>
            ) : (
              <Spin />
            ),
          ]
        }>
        <Meta
          avatar={
            props.item.user?.image || props.item.imageProfile ? (
              <Avatar src={props.item.user?.image || props.item.imageProfile} size={40} />
            ) : (
              <Avatar style={{ backgroundColor: '#4A90E2', color: 'white' }} size={40}>
                {InitialsNameUser(props.item.name ? props.item.name : 'User')}
              </Avatar>
            )
          }
          title={
            <a
              style={{ color: '#3273dc' }}
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
  setUserAgenda,
};

export default connect(null, mapDispatchToProps)(withRouter(PopoverInfoUser));
