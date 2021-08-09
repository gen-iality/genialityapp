import React, { useState } from 'react';
import PropertiesProfile from './PropertiesProfile';
import ContactRequest from './ContactRequest';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import { Layout, Button, Drawer, Row, Space, Tooltip, Col, Spin, List } from 'antd';
import { ArrowRightOutlined, UsergroupAddOutlined, CommentOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { UseCurrentUser } from '../../../Context/userContext';
import { formatDataToString } from '../../../helpers/utils';
const DrawerProfile = (props) => {
  const [visiblePerfil, setVisiblePerfil] = useState(true);
  const [userPerfil, setUserPerfil] = useState(true);
  const [propertiesUserPerfil, setPropertiesUserPerfil] = useState(null);

  let cUser = UseCurrentUser();
  return (
    <Drawer
      zIndex={5000}
      visible={visiblePerfil}
      closable={true}
      onClose={() => props.setViewPerfil(!props.viewPerfil)}
      width={'52vh'}
      bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}>
      <Row justify='center' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <Space size={0} direction='vertical' style={{ textAlign: 'center' }}>
          <Avatar size={110} src='https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png' />
          <Text style={{ fontSize: '20px' }}>
            {userPerfil && userPerfil.names ? userPerfil.names : userPerfil && userPerfil.name ? userPerfil.name : ''}
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
                  <Button size='large' shape='circle' icon={<UsergroupAddOutlined />} />
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
                    <List.Item.Meta title={item.label} description={formatDataToString(userPerfil[item.name], item)} />
                  </List.Item>
                )
              }
            />
          )}
        </Col>
      </Row>
    </Drawer>
  );
};

export default DrawerProfile;
