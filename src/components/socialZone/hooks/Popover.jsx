import { useEffect, useState } from 'react';
import { Tooltip, Skeleton, Card, Avatar, notification, Spin } from 'antd';
import { UserOutlined, UsergroupAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { InitialsNameUser } from './index';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import { addNotification, haveRequest, isMyContacts, SendFriendship } from '@helpers/netWorkingFunctions';
import { useUserEvent } from '@context/eventUserContext';
import { useEventContext } from '@context/eventContext';
import { setUserAgenda } from '../../../redux/networking/actions';
import { EventsApi } from '@helpers/request';

const { Meta } = Card;

const PopoverInfoUser = (props) => {
  const [userSelected, setUserSelected] = useState();
  const eventUserContext = useUserEvent();
  const eventContext = useEventContext();
  const {
    containtNetworking,
    getPropertiesUserWithId,
    propertiesProfile,
    propertiesOtherprofile,
    requestSend,
    obtenerContactos,
    contacts,
  } = useHelper();

  useEffect(() => {
    const user = { _id: props.item.iduser, properties: props.item.properties, eventUserId: props.item._id, send: 0 };
    setUserSelected(user);
    obtainContacts();
    async function obtainContacts() {
      await obtenerContactos();
    }
    return () => {
      setUserSelected(null);
    };
  }, [props.item.iduser]);

  return (
    <Skeleton avatar active>
      <Card
        style={{ width: '300px', padding: '0', color: 'black' }}
        actions={
          containtNetworking && [
            userSelected ? (
              <Tooltip title="Ver perfil" onClick={() => props.setViewPerfil({ view: true, perfil: userSelected })}>
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
                        const userSelectedTwo = { ...userSelected, loading: true };
                        setUserSelected(userSelectedTwo);
                        const userReceive = {
                          eventUserIdReceiver: userSelected.eventUserId,
                          userName:
                            userSelected.properties.names ||
                            userSelected.properties.name ||
                            userSelected.properties.email,
                        };
                        const sendResp = await SendFriendship(userReceive, eventUserContext.value, eventContext.value);
                        if (sendResp._id) {
                          const notificationR = {
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
                          const userSelectedTwo = { ...userSelected, loading: false, send: 1 };
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
              <Tooltip title="Agendar cita">
                <VideoCameraOutlined
                  onClick={async () => {
                    setViewPerfil({ view: false, perfil: userSelected });
                    // Se crea el objeto con id invertido para que el componente appoint modal funcione correctamente
                    const evetuser = userSelected._id;
                    const userReview = {
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
