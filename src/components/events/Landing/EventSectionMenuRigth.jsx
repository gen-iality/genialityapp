import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, ArrowRightOutlined } from '@ant-design/icons';
import SocialZone from '../../socialZone/socialZone';
import {setViewPerfil}  from '../../../redux/viewPerfil/actions';

import MenuRigth from './Menus/MenuRigth';
import { connect } from 'react-redux';
import { set } from 'lodash-es';
const { Sider } = Layout;
const EventSectionMenuRigth = (props) => {
   const [isCollapsed, setisCollapsed] = useState(true);
   const [tab, setTab] = useState(1);
   let [optionselected, setOptionselected] = useState(1);

   function handleCollapsed() {  
      props.setViewPerfil(!isCollapsed)
      setisCollapsed(!isCollapsed);     
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
         collapsed={isCollapsed && props.viewPerfil }>
         <div className='Chat-Event'>
            { isCollapsed && props.viewPerfil  ? (
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
                     perfil={collapsePerfil}
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
         </div>
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
