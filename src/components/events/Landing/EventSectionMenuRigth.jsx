import React, { useState, useEffect } from 'react';
import { Layout, Button, Drawer, Row, Space, Tooltip, Col, Spin, List } from 'antd';
import { MenuUnfoldOutlined, ArrowRightOutlined, UsergroupAddOutlined, CommentOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import SocialZone from '../../socialZone/socialZone';
import {setViewPerfil}  from '../../../redux/viewPerfil/actions';

import MenuRigth from './Menus/MenuRigth';
import { connect } from 'react-redux';
import { set } from 'lodash-es';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import { formatDataToString } from '../../../helpers/utils';
const { Sider } = Layout;
const EventSectionMenuRigth = (props) => {
   const [isCollapsed, setisCollapsed] = useState(true);
   const [visiblePerfil, setVisiblePerfil] = useState(true);
   const [userPerfil, setUserPerfil] = useState(true);
   const [tab, setTab] = useState(1);
   let [optionselected, setOptionselected] = useState(1);

   function handleCollapsed() {       
      setisCollapsed(!isCollapsed);     
   }
  async function collapsePerfil  (userPerfil) {
      console.log('USER PERFIL COLLAPASE');
      console.log(userPerfil);
      setVisiblePerfil(true); 
      if (userPerfil != null) {
        var data = await this.loadDataUser(userPerfil);
        console.log('--------------------------');
        console.log(data);
  
        setUserPerfil({ ...data.properties, iduser: userPerfil.iduser || data._id });
  
        if (data) {
          const respProperties = await this.getProperties(data._id);
          console.log(respProperties);
        }
      } else {
        setUserPerfil(props.cUser)
      }
    }

   useEffect(()=>{
      setisCollapsed(props.viewPerfil); 
      props.viewPerfil? setTab(1):setTab(2)
   },[props.viewPerfil])

   return (
      <Sider
         className='collapse-chatEvent'
         style={{ backgroundColor: props.cEvent.styles.toolbarDefaultBg }}
         trigger={null}
         width={400}
         collapsed={isCollapsed}>
        {props.viewPerfil ? <div className='Chat-Event'>
            { isCollapsed ? (
               <>
                  <MenuRigth
                     cEvent={props.cEvent}
                     cUser={props.cUser}
                     handleCollapsed={handleCollapsed}
                     currentActivity={props.currentActivity}
                     tabs={props.tabs}
                     generalTabs={props.generalTabs}
                     tabselected={props.tabselected}
                     settabselected={props.settabselected}
                  />
               </>
            ) : (
               <>
                  <Button
                     className='animate__animated animate__headShake animate__slower animate__infinite'
                     type='link'
                     onClick={handleCollapsed}>
                     <ArrowRightOutlined style={{ fontSize: '24px', color: props.cEvent.styles.textMenu }} />
                  </Button>

                 <SocialZone
                     // updateChat={this.state.updateChat}
                     // collapse={this.state.collapsed}
                     totalMessages={props.totalNewMessages}
                     // agendarCita={this.AgendarCita}
                     // loadDataUser={this.loadDataUser}
                     // obtenerPerfil={this.obtenerUserPerfil}
                     // notificacion={this.addNotification}
                     // sendFriendship={this.SendFriendship}
                     //perfil={collapsePerfil}
                     // tcollapse={this.toggleCollapsed}
                     optionselected={optionselected}
                     tab={2}
                     // section={this.state.section}
                     // containNetWorking={this.state.containNetWorking}
                     // eventSurveys={this.state.eventSurveys}
                     generalTabs={props.generalTabs}
                     // publishedSurveys={props.publishedSurveys}
                     notNewMessages={props.notNewMessage}
                     cEvent={props.cEvent}
                     cUser={props.cUser}
                     tabselected={props.tabselected}
                     settabselected={props.settabselected}
                  />
               </>

               
            )}
         </div>:   
         <Drawer
                            zIndex={5000}
                            visible={visiblePerfil}
                            closable={true}
                            onClose={() => props.setViewPerfil(!props.viewPerfil)}
                            width={'52vh'}
                            bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}>
                            <Row justify='center' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                              <Space size={0} direction='vertical' style={{ textAlign: 'center' }}>
                                <Avatar
                                  size={110}
                                  src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                />
                                <Text style={{ fontSize: '20px' }}>
                                  {userPerfil && userPerfil.names
                                    ? userPerfil.names
                                    : userPerfil && userPerfil.name
                                    ? userPerfil.name
                                    : ''}
                                </Text>
                                <Text type='secondary' style={{ fontSize: '16px' }}>
                                  {userPerfil && userPerfil.email}
                                </Text>
                              </Space>
                              <Col span={24}>
                                <Row justify='center' style={{ marginTop: '20px' }}>
                                  <Space size='middle'>
                                    <Tooltip title='Solicitar contacto'>
                                      <Button
                                        size='large'
                                        shape='circle'
                                        onClick={async () => null/* {
                                          var us = await this.loadDataUser(this.state.userPerfil);
                                          console.log('USER PERFIL=>', us);
                                          this.collapsePerfil();

                                          var sendResp = await this.SendFriendship({
                                            eventUserIdReceiver: us._id,
                                            userName: this.state.userPerfil.names || this.state.userPerfil.email,
                                          });
                                          if (sendResp._id) {
                                            let notification = {
                                              idReceive: us.account_id,
                                              idEmited: sendResp._id,
                                              emailEmited: currentUser.email,
                                              message: 'Te ha enviado solicitud de amistad',
                                              name: 'notification.name',
                                              type: 'amistad',
                                              state: '0',
                                            };
                                            console.log('RESPUESTA SEND AMISTAD' + sendResp._id);
                                            await this.addNotification(notification, currentUser._id);
                                          }
                                        }}*/}
                                        icon={<UsergroupAddOutlined />}
                                      />
                                    </Tooltip>
                                    <Tooltip title='Ir al chat privado'>
                                      <Button
                                        size='large'
                                        shape='circle'
                                        onClick={async () => {
                                          var us = await this.loadDataUser(this.state.userPerfil);
                                          this.collapsePerfil();
                                          this.UpdateChat(
                                            props.cUser.uid,
                                            props.cUser.names || props.cUser.name,
                                            this.state.userPerfil.iduser,
                                            this.state.userPerfil.names || this.state.userPerfil.name
                                          );
                                        }}
                                        icon={<CommentOutlined />}
                                      />
                                    </Tooltip>
                                    <Tooltip title='Solicitar cita'>
                                      <Button
                                        size='large'
                                        shape='circle'
                                        onClick={async () => {
                                          var us = await this.loadDataUser(this.state.userPerfil);
                                          console.log('USER PERFIL=>', us);
                                          console.log(this.state.userPerfil);
                                          if (us) {
                                            this.collapsePerfil();
                                            this.AgendarCita(us._id, us);
                                          }
                                        }}
                                        icon={<VideoCameraAddOutlined />}
                                      />
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
                                {!propertiesUserPerfil && (
                                  <Spin style={{ padding: '50px' }} size='large' tip='Cargando...'></Spin>
                                )}
                                {/*this.state.propertiesUserPerfil &&
                                  this.state.propertiesUserPerfil.map(
                                    (property, key) =>
                                      this.state.userPerfil[property.name] !== undefined &&
                                      !property.visibleByAdmin && (
                                        <div key={'contact-property' + key}>
                                          {
                                            <p>
                                              <strong>{property.label}</strong>:{' '}
                                              {formatDataToString(this.state.userPerfil[property.name], property)}
                                            </p>
                                          }
                                        </div>
                                      )
                                        )*/}
                                {propertiesUserPerfil && (
                                  <List
                                    bordered
                                    dataSource={propertiesUserPerfil && propertiesUserPerfil}
                                    renderItem={(item) =>
                                      !item.visibleByContacts &&
                                      !item.visibleByAdmin &&
                                      userPerfil[item.name] && (
                                        <List.Item>
                                          <List.Item.Meta
                                            title={item.label}
                                            description={formatDataToString(userPerfil[item.name], item)}
                                          />
                                        </List.Item>
                                      )
                                    }
                                  />
                                )}
                              </Col>
                            </Row>
                          </Drawer>}
      </Sider>
   );
};
const mapStateToProps = (state) => ({
   viewPerfil: state. viewPerfilReducer.view,
   
 });
 
 const mapDispatchToProps = {  
   setViewPerfil,
 };
 
 export default connect(mapStateToProps, mapDispatchToProps) (EventSectionMenuRigth);
