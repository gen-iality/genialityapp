import { Button, Drawer, Row, Space, Tooltip, Col, Spin, List, notification, Typography } from 'antd';
import { useCurrentUser } from '@context/userContext';
import { formatDataToString } from '@helpers/utils';

import { useHelper } from '@context/helperContext/hooks/useHelper';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import { connect } from 'react-redux';
import { addNotification, haveRequest, isMyContacts, SendFriendship } from '@helpers/netWorkingFunctions';
import { UseEventContext } from '@context/eventContext';
import { UseUserEvent } from '@context/eventUserContext';
import { setUserAgenda } from '../../../redux/networking/actions';
import withContext from '@context/withContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import BadgeAccountOutlineIcon from '@2fd/ant-design-icons/lib/BadgeAccountOutline';

const DrawerProfile = (props) => {
  let cUser = useCurrentUser();
  let cEvent = UseEventContext();
  let cEventUser = UseUserEvent();
  let { propertiesProfile, requestSend, handleChangeTypeModal } = useHelper();
  const [userSelected, setUserSelected] = useState();
  const [isMycontact, setIsMyContact] = useState();
  const [isMe, setIsMe] = useState(false);
  const [send, setSend] = useState(false);
  const [userPropertiesProfile, setUserPropertiesProfile] = useState();
  const intl = useIntl();

  useEffect(() => {
    if (props.profileuser) {
      console.log(props.profileuser._id, cEventUser.value, props.profileuser);
      if (props.profileuser._id !== cEventUser.value?.account_id) {
        let isContact = isMyContacts(props.profileuser, props.cHelper.contacts);
        setIsMe(cUser.value._id == props.profileuser._id);
        setIsMyContact(isContact);
        setUserSelected(props.profileuser);
        setUserPropertiesProfile(propertiesProfile?.propertiesUserPerfil);
      } else {
        //Si es mi usuario, no estaba mostrando el perfil de los demás usuarios
        if (cEventUser.value == null) return;
        let isContact = isMyContacts(cEventUser.value, props.cHelper.contacts);
        setIsMe(cUser.value._id == cEventUser.value.user._id);
        setIsMyContact(isContact);
        setUserSelected(cEventUser.value);
        setUserPropertiesProfile(propertiesProfile?.propertiesUserPerfil);
      }
    }
  }, [props.profileuser, cEventUser.value]);
  const haveRequestUser = (user) => {
    //console.log("HEPERVALUE==>",requestSend,user)
    return haveRequest(user, requestSend, 1);
  };

  return (
    <>
      <Drawer
        title={
          <Space>
            <BadgeAccountOutlineIcon
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                height: '40px',
                width: '40px',
                borderRadius: '8px',
                color: cEvent.value.styles.textMenu,
                backgroundColor: cEvent.value.styles.toolbarDefaultBg,
              }}
            />
            {isMe ? (
              <FormattedMessage id='header.my_data_event' defaultMessage='Mi perfil en el curso' />
            ) : (
              <FormattedMessage id='header.my_data_event2' defaultMessage='Perfil del participante en el curso' />
            )}
          </Space>
        }
        zIndex={5000}
        visible={props.viewPerfil}
        closable={true}
        onClose={() => props.setViewPerfil({ view: false, perfil: null })}
        width={'52vh'}
        bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}>
        <Row justify='center' style={{ paddingLeft: '15px', paddingRight: '10px' }}>
          <Col span={24}>
            <Typography.Paragraph>
              {isMe
                ? 'Esta es tu información suministrada para el curso'
                : ' Esta es la información suministrada para el curso'}
              <Typography.Text strong> {cEvent.value.name} </Typography.Text>
            </Typography.Paragraph>
          </Col>

          {isMe && (
            <Col span={24}>
              <Button
                onClick={() => {
                  props.setViewPerfil({ view: false, perfil: userSelected });
                  handleChangeTypeModal('update');
                }}
                type='text'
                size='middle'
                style={{ backgroundColor: '#F4F4F4', color: '#FAAD14' }}>
                {/* (props.cEvent.value.allow_register === true || props.cEvent.value.allow_register === 'true') && Este en caso de que tampoco sea para anonimo */
                props.cEvent.value.visibility === 'PUBLIC' && (
                  <>{intl.formatMessage({ id: 'modal.title.update', defaultMessage: 'Actualizar mis datos' })}</>
                )}
              </Button>
            </Col>
          )}

          {/* <Col span={24}>
            <Row justify='center' style={{ marginTop: '20px' }}>
              <Space size='middle'>
                <Tooltip title={haveRequestUser(userSelected) ? 'Solicitud pendiente' : 'Solicitar contacto'}>
                  {userSelected && userSelected._id !== cUser.value._id && (
                    <Button
                      size='large'
                      shape='circle'
                      icon={<UsergroupAddOutlined />}
                      disabled={haveRequestUser(userSelected) || isMycontact || send}
                      onClick={
                        haveRequestUser(userSelected)
                          ? null
                          : async () => {
                              setSend(true);
                              let sendResp = await SendFriendship(
                                {
                                  eventUserIdReceiver: cEventUser.value._id,
                                  userName: userSelected.name || userSelected.names || userSelected?.email,
                                },
                                cEventUser.value,
                                cEvent.value
                              );

                              if (sendResp._id) {
                                let notificationR = {
                                  idReceive: userSelected._id,
                                  idEmited: sendResp._id,
                                  emailEmited: cEventUser.value?.email || cEventUser.value.user?.email,
                                  message:
                                    (cEventUser.value.names ||
                                      cEventUser.value.user.names ||
                                      cEventUser.value.user.name) + 'te ha enviado solicitud de amistad',
                                  name: 'notification.name',
                                  type: 'amistad',
                                  state: '0',
                                };
                                addNotification(notificationR, cEvent.value, cEventUser.value);
                                props.setViewPerfil({ view: !props.viewPerfil, perfil: null });
                                notification['success']({
                                  message: 'Correcto!',
                                  description: 'Se ha enviado la solicitud de amistad correctamente',
                                });
                              } else {
                                console.log('Error al guardar');
                              }
                            }
                      }
                    />
                  )}
                </Tooltip>
                <Tooltip title='Ir al chat privado'>
                  {userSelected && userSelected._id !== cUser.value._id && (
                    <Button
                      size='large'
                      shape='circle'
                      onClick={async () => {
                        alert('CHAT PRIVADO');
                        // this.UpdateChat(
                        //   cUser.value.uid,
                        //   cUser.value.names || cUser.value.name,
                        //   props.profileuser.iduser,
                        //   props.profileuser.names || props.profileuser.name
                        // );
                      }}
                      icon={<CommentOutlined />}
                    />
                  )}
                </Tooltip>
                <Tooltip title='Solicitar cita'>
                  {userSelected?._id !== cUser.value._id && (
                    <Button
                      size='large'
                      shape='circle'
                      onClick={async () => {
                        props.setUserAgenda({
                          ...userSelected,
                          userId: userSelected._id,
                          _id: userSelected.eventUserId,
                        });
                        props.setViewPerfil({ view: !props.viewPerfil, perfil: null });
                        // alert("AGENDAR CITA")
                      }}
                      icon={<VideoCameraAddOutlined />}
                    />
                  )}
                </Tooltip>
              </Space>
            </Row>
          </Col> */}
        </Row>
        <Row justify='center' style={{ paddingLeft: '15px', paddingRight: '5px' }}>
          <Col
            className='asistente-list' //agrega el estilo a la barra de scroll
            span={24}
            style={{ marginTop: '20px', height: '50vh', maxHeight: '50vh', overflowY: 'auto' }}>
            {(!userSelected || !userPropertiesProfile) && (
              <Spin style={{ padding: '50px' }} size='large' tip='Cargando...'></Spin>
            )}

            {
              //userSelected._id == cUser.value._id ? (

              <List
                bordered
                style={{ borderRadius: '8px' }}
                dataSource={userPropertiesProfile && userPropertiesProfile}
                renderItem={(item) =>
                  ((item?.visibleByContacts && isMycontact && !item?.sensibility) || !item.sensibility) &&
                  userSelected.properties[item?.name] &&
                  item?.name !== 'picture' &&
                  item?.name !== 'imagendeperfil' &&
                  item?.type !== 'password' &&
                  item?.type !== 'avatar' && (
                    <List.Item>
                      <List.Item.Meta
                        title={item?.label}
                        description={formatDataToString(
                          item?.type !== 'codearea'
                            ? userSelected.properties[item?.name]
                            : '(+' + userSelected.properties['code'] + ')' + userSelected.properties[item?.name],
                          item
                        )}
                      />
                    </List.Item>
                  )
                }
              />

              /*) : (
            <ProfileAttende />
          )}*/
            }
            {/* {props.profileuser && (
            <List
              bordered
              dataSource={props.profileuser && props.profileuser}
              renderItem={(item) =>
                (((!item.visibleByContacts || item.visibleByContacts == 'public') && !item.visibleByAdmin) ||
                  props.profileuser._id == cUser.value._id) &&
                props.profileuser[item.name] && (
                  <List.Item>
                    <List.Item.Meta title={item.label} description={formatDataToString(props.profileuser[item.name], item)} />
                  </List.Item>
                )
              }
            />
          )} */}
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  viewPerfil: state.viewPerfilReducer.view,
  profileuser: state.viewPerfilReducer.perfil,
});

const mapDispatchToProps = {
  setViewPerfil,
  setUserAgenda,
};

export default connect(mapStateToProps, mapDispatchToProps)(withContext(DrawerProfile));
