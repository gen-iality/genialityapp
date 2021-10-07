import React, { useContext } from 'react';
import Avatar from 'antd/lib/avatar/avatar';

import { Button, Drawer, Row, Space, Tooltip, Col, Spin, List, notification, Typography } from 'antd';
import { UsergroupAddOutlined, CommentOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { UseCurrentUser } from '../../../Context/userContext';
import { formatDataToString } from '../../../helpers/utils';

import { HelperContext } from '../../../Context/HelperContext';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import { connect } from 'react-redux';
import { addNotification, isMyContacts, SendFriendship } from '../../../helpers/netWorkingFunctions';
import { UseEventContext } from '../../../Context/eventContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import { setUserAgenda } from '../../../redux/networking/actions';
import withContext from '../../../Context/withContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { useIntl } from 'react-intl';

const DrawerProfile = (props) => {
  let cUser = UseCurrentUser();
  let cEvent = UseEventContext();
  let cEventUser = UseUserEvent();
  let { propertiesProfile, handleChangeTypeModal } = useContext(HelperContext);
  const [userSelected, setUserSelected] = useState();
  const [isMycontact, setIsMyContact] = useState();
  const [isMe, setIsMe] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (props.profileuser !== null) {
      let isContact = isMyContacts(props.profileuser, props.cHelper.contacts);
      setIsMe(cUser.value._id == props.profileuser._id);
      setIsMyContact(isContact);
      setUserSelected(props.profileuser);
    }
  }, [props.profileuser]);

  return (
    <>
      <Drawer
        zIndex={5000}
        visible={props.viewPerfil}
        closable={true}
        onClose={() => props.setViewPerfil({ view: !props.viewPerfil, perfil: null })}
        width={'52vh'}
        bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}>
        <Row justify='center' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
          <Space size={0} direction='vertical' style={{ textAlign: 'center' }}>
            <Avatar
              size={110}
              src={
                userSelected && userSelected.properties && userSelected.properties['picture']
                  ? userSelected.properties['picture']
                  : 'https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png'
              }
            />
            <Typography.Paragraph style={{ fontSize: '20px', width: '250px' }}>
              {userSelected != null
                ? userSelected && userSelected.properties && userSelected.properties.names
                  ? userSelected.properties.names
                  : userSelected.properties && userSelected.properties.name
                  ? userSelected.properties.name
                  : ''
                : ''}
            </Typography.Paragraph>
            <Typography.Paragraph type='secondary' style={{ fontSize: '16px', width: '250px' }}>
              {userSelected && userSelected.properties && userSelected.properties?.email}
            </Typography.Paragraph>
            {isMe && (
              <Button
                onClick={() => {
                  props.setViewPerfil({ view: !props.viewPerfil, perfil: null });
                  handleChangeTypeModal('update');
                }}
                type='text'
                size='middle'
                style={{ backgroundColor: '#F4F4F4', color: '#FAAD14' }}>
                {intl.formatMessage({ id: 'modal.title.update', defaultMessage: 'Actualizar mis datos' })}
              </Button>
            )}
          </Space>
          <Col span={24}>
            <Row justify='center' style={{ marginTop: '20px' }}>
              <Space size='middle'>
                <Tooltip title='Solicitar contacto'>
                  {userSelected && userSelected._id !== cUser.value._id && (
                    <Button
                      size='large'
                      shape='circle'
                      icon={<UsergroupAddOutlined />}
                      onClick={async () => {
                        let sendResp = await SendFriendship(
                          {
                            eventUserIdReceiver: userSelected.eventUserId,
                            userName:
                              userSelected.properties.name ||
                              userSelected.properties.names ||
                              userSelected.properties?.email,
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
                              (cEventUser.value.names || cEventUser.value.user.names || cEventUser.value.user.name) +
                              'te ha enviado solicitud de amistad',
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
                      }}
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
          </Col>
        </Row>
        <Row justify='center' style={{ paddingLeft: '15px', paddingRight: '5px' }}>
          <Col
            className='asistente-list' //agrega el estilo a la barra de scroll
            span={24}
            style={{ marginTop: '20px', height: '50vh', maxHeight: '50vh', overflowY: 'auto' }}>
            {(!userSelected || !propertiesProfile) && (
              <Spin style={{ padding: '50px' }} size='large' tip='Cargando...'></Spin>
            )}

            {
              //userSelected._id == cUser.value._id ? (

              <List
                bordered
                dataSource={propertiesProfile && propertiesProfile.propertiesUserPerfil}
                renderItem={(item) =>
                  ((item.visibleByContacts && isMycontact && !item.sensibility) ||
                    !item.sensibility ||
                    userSelected?._id == cUser.value._id) &&
                  userSelected?.properties[item.name] &&
                  item.name !== 'picture' &&
                  item.name !== 'imagendeperfil' &&
                  item.type !== 'password' &&
                  item.type !== 'avatar' && (
                    <List.Item>
                      <List.Item.Meta
                        title={item.label}
                        description={formatDataToString(
                          item.type !== 'codearea'
                            ? userSelected.properties[item.name]
                            : '(+' + userSelected.properties['code'] + ')' + userSelected.properties[item.name],
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
