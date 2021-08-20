import React, { useContext } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import { Button, Drawer, Row, Space, Tooltip, Col, Spin, List, notification } from 'antd';
import { UsergroupAddOutlined, CommentOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { UseCurrentUser } from '../../../Context/userContext';
import { formatDataToString } from '../../../helpers/utils';
import ProfileAttende from './ProfileAttende';
import { HelperContext } from '../../../Context/HelperContext';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import { connect } from 'react-redux';
import { addNotification, SendFriendship } from '../../../helpers/netWorkingFunctions';
import { UseEventContext } from '../../../Context/eventContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import {setUserAgenda} from '../../../redux/networking/actions'

const DrawerProfile = (props) => {
  let cUser = UseCurrentUser();
  let cEvent=UseEventContext();
  let cEventUser=UseUserEvent();
  let { propertiesProfile } = useContext(HelperContext);
  
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
            src='https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png'
          />
          <Text style={{ fontSize: '20px' }}>
            {props.profileuser!=null && props.profileuser.properties && props.profileuser.properties.names
              ? props.profileuser.properties.names
              : props.profileuser.properties && props.profileuser.properties.name
              ? props.profileuser.properties.name
              : ''}
          </Text>
          <Text type='secondary' style={{ fontSize: '16px' }}>
            {props.profileuser && props.profileuser.properties  && props.profileuser.properties?.email}
          </Text>
        </Space>
        <Col span={24}>
          <Row justify='center' style={{ marginTop: '20px' }}>
            <Space size='middle'>
              <Tooltip title='Solicitar contacto'>
                {props.profileuser && props.profileuser._id !== cUser.value._id && (
                  <Button size='large' shape='circle'  icon={<UsergroupAddOutlined />} 
                    onClick={async ()=>{
                                    
                     let sendResp= await  SendFriendship({eventUserIdReceiver:props.profileuser.eventUserId, userName:props.profileuser.properties.name || props.profileuser.properties.names || props.profileuser.properties?.email   },cEventUser.value,cEvent.value)
                                       
                      if (sendResp._id) {
                        let notificationR = {
                          idReceive: props.profileuser._id,
                          idEmited: sendResp._id,
                          emailEmited:
                          cEventUser.value?.email ||
                          cEventUser.value.user?.email,
                          message:
                            ( cEventUser.value.names ||
                              cEventUser.value.user.names||  cEventUser.value.user.name) +
                            'te ha enviado solicitud de amistad',
                          name: 'notification.name',
                          type: 'amistad',
                          state: '0',
                        };      
                        addNotification(
                          notificationR,
                          cEvent.value,
                          cEventUser.value
                        ); 
                        props.setViewPerfil({ view: !props.viewPerfil, perfil: null })
                        notification['success']({
                          message: 'Correcto!',
                          description:
                            'Se ha enviado la solicitud de amistad correctamente',
                        });                       
                     }else{
                       console.log("Error al guardar")
                     }
                    }}
                  />
                )}
              </Tooltip>
              <Tooltip title='Ir al chat privado'>
                {props.profileuser && props.profileuser._id !== cUser.value._id && (
                  <Button
                    size='large'
                    shape='circle'
                    onClick={async () => {
                      alert("CHAT PRIVADO")                      
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
                {props.profileuser._id !== cUser.value._id && (
                  <Button
                    size='large'
                    shape='circle'
                    onClick={async () => {
                      props.setUserAgenda({...props.profileuser,userId:props.profileuser._id,_id:props.profileuser.eventUserId})
                      props.setViewPerfil({ view: !props.viewPerfil, perfil: null })
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
          style={{ marginTop: '20px', height: '45vh', maxHeight: '45vh', overflowY: 'scroll' }}>
          {!props.profileuser && <Spin style={{ padding: '50px' }} size='large' tip='Cargando...'></Spin>}

          {//props.profileuser._id == cUser.value._id ? (
            <List
              bordered
              dataSource={propertiesProfile && propertiesProfile.propertiesUserPerfil}
              renderItem={(item) =>
                (((!item.visibleByContacts || item.visibleByContacts == 'public') && !item.visibleByAdmin) ||
                  props.profileuser._id == cUser.value._id) &&
                props.profileuser.properties[item.name] && (
                  <List.Item>
                    <List.Item.Meta
                      title={item.label}
                      description={formatDataToString(props.profileuser.properties[item.name], item)}
                    />
                  </List.Item>
                )
              }
            />
          /*) : (
            <ProfileAttende />
          )}*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(DrawerProfile);
