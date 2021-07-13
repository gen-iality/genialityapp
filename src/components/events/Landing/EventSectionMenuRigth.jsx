import React, { useState, useEffect } from 'react';
import { Layout, Button, Drawer, Row, Space, Tooltip, Col, Spin, List } from 'antd';
import { ArrowRightOutlined, UsergroupAddOutlined, CommentOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import SocialZone from '../../socialZone/socialZone';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import MenuRigth from './Menus/MenuRigth';
import { connect } from 'react-redux';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import { formatDataToString } from '../../../helpers/utils';
const { Sider } = Layout;
import { UseEventContext } from '../../../Context/eventContext';
import { UseCurrentUser } from '../../../Context/userContext';

const EventSectionMenuRigth = (props) => {
  const [isCollapsed, setisCollapsed] = useState(true);
  const [visiblePerfil, setVisiblePerfil] = useState(true);
  const [userPerfil, setUserPerfil] = useState(true);
  const [propertiesUserPerfil, setPropertiesUserPerfil] = useState(null);
  let [optionselected, setOptionselected] = useState(1);
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();

  function handleCollapsed() {
    setisCollapsed(!isCollapsed);
  }

  return (
    <Sider
      className='collapse-chatEvent'
      style={{ backgroundColor: cEvent.value.styles.toolbarDefaultBg }}
      trigger={null}
      width={400}
      collapsed={isCollapsed}>
      {props.viewPerfil ? (
        <div className='Chat-Event'>
          {isCollapsed ? (
            <>
              <MenuRigth
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
                <ArrowRightOutlined style={{ fontSize: '24px', color: cEvent.value.styles.textMenu }} />
              </Button>

              <SocialZone
                totalMessages={props.totalNewMessages}
                optionselected={optionselected}
                tab={1}
                generalTabs={props.generalTabs}
                notNewMessages={props.notNewMessage}
                tabselected={props.tabselected}
                settabselected={props.settabselected}
              />
            </>
          )}
        </div>
      ) : (
        <Drawer
      
          zIndex={5000}
          visible={visiblePerfil}
          closable={true}
          onClose={() => props.setViewPerfil(!props.viewPerfil)}
          width={'52vh'}
          bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}>
          <Row justify='center' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <Space size={0} direction='vertical' style={{ textAlign: 'center' }}>
              <Avatar size={110} src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
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
                    {userPerfil._id !== cUser.value._id && (
                      <Button
                        size='large'
                        shape='circle'
                        icon={<UsergroupAddOutlined />}
                      />
                    )}
                  </Tooltip>
                  <Tooltip title='Ir al chat privado'>
                    {userPerfil._id !== cUser.value._id && (
                      <Button
                        size='large'
                        shape='circle'
                        onClick={async () => {
                          var us = await this.loadDataUser(this.state.userPerfil);
                          this.collapsePerfil();
                          this.UpdateChat(
                            cUser.value.uid,
                            cUser.value.names || cUser.value.name,
                            this.state.userPerfil.iduser,
                            this.state.userPerfil.names || this.state.userPerfil.name
                          );
                        }}
                        icon={<CommentOutlined />}
                      />
                    )}
                  </Tooltip>
                  <Tooltip title='Solicitar cita'>
                    {userPerfil._id !== cUser.value._id && (
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
              {!propertiesUserPerfil && <Spin style={{ padding: '50px' }} size='large' tip='Cargando...'></Spin>}

              {propertiesUserPerfil && (
                <List
                  bordered
                  dataSource={propertiesUserPerfil && propertiesUserPerfil}
                  renderItem={(item) =>
                    (((!item.visibleByContacts || item.visibleByContacts == 'public') && !item.visibleByAdmin) ||
                      userPerfil._id == cUser.value._id) &&
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
        </Drawer>
      )}
    </Sider>
  );
};
const mapStateToProps = (state) => ({
  viewPerfil: state.viewPerfilReducer.view,
});

const mapDispatchToProps = {
  setViewPerfil,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventSectionMenuRigth);
