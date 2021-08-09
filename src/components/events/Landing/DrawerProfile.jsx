import React, { useState, useEffect, useContext } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import { Button, Drawer, Row, Space, Tooltip, Col, Spin, List } from 'antd';
import { UsergroupAddOutlined, CommentOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { UseCurrentUser } from '../../../Context/userContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import { formatDataToString } from '../../../helpers/utils';
import { HelperContext } from '../../../Context/HelperContext';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import { connect } from 'react-redux';

const DrawerProfile = (props) => {
  let cUser = UseCurrentUser();
  let cEventUser = UseUserEvent();
  let { propertiesProfile } = useContext(HelperContext);

  console.log('eventuserdrawer', cEventUser);
  console.log('properties', propertiesProfile);
  return (
    <Drawer
      zIndex={5000}
      visible={props.viewPerfil}
      closable={true}
      onClose={() => props.setViewPerfil(!props.viewPerfil)}
      width={'52vh'}
      bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}>
      <Row justify='center' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <Space size={0} direction='vertical' style={{ textAlign: 'center' }}>
          <Avatar
            size={110}
            src='https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png'
          />
          <Text style={{ fontSize: '20px' }}>
            {props.profileuser && props.profileuser.names
              ? props.profileuser.names
              : props.profileuser && props.profileuser.name
              ? props.profileuser.name
              : ''}
          </Text>
          <Text type='secondary' style={{ fontSize: '16px' }}>
            {props.profileuser && props.profileuser.email}
          </Text>
        </Space>
        <Col span={24}>
          <Row justify='center' style={{ marginTop: '20px' }}>
            <Space size='middle'>
              <Tooltip title='Solicitar contacto'>
                {props.profileuser && props.profileuser._id !== cUser.value._id && (
                  <Button size='large' shape='circle' icon={<UsergroupAddOutlined />} />
                )}
              </Tooltip>
              <Tooltip title='Ir al chat privado'>
                {props.profileuser && props.profileuser._id !== cUser.value._id && (
                  <Button
                    size='large'
                    shape='circle'
                    onClick={async () => {
                      var us = await this.loadDataUser(props.profileuser);
                      this.collapsePerfil();
                      this.UpdateChat(
                        cUser.value.uid,
                        cUser.value.names || cUser.value.name,
                        props.profileuser.iduser,
                        props.profileuser.names || props.profileuser.name
                      );
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
                      var us = await this.loadDataUser(props.profileuser);
                      console.log('USER PERFIL=>', us);
                      console.log(props.profileuser);
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
          {!props.profileuser && <Spin style={{ padding: '50px' }} size='large' tip='Cargando...'></Spin>}

          {props.profileuser._id == cUser.value._id ? (
            <List
              bordered
              dataSource={propertiesProfile && propertiesProfile.propertiesUserPerfil}
              renderItem={(item) =>
                (((!item.visibleByContacts || item.visibleByContacts == 'public') && !item.visibleByAdmin) ||
                  props.profileuser._id == cUser.value._id) &&
                props.profileuser[item.name] && (
                  <List.Item>
                    <List.Item.Meta
                      title={item.label}
                      description={formatDataToString(props.profileuser[item.name], item)}
                    />
                  </List.Item>
                )
              }
            />
          ) : (
            <h1>es otro perfil</h1>
          )}
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
  );
};

const mapStateToProps = (state) => ({
  viewPerfil: state.viewPerfilReducer.view,
  profileuser: state.viewPerfilReducer.perfil,
});

const mapDispatchToProps = {
  setViewPerfil,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerProfile);
