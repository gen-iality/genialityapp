import React from 'react';
import PropertiesProfile from './PropertiesProfile';
import ContactRequest from './ContactRequest';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import { Row, Col, Space, Drawer } from 'antd';

const DrawerProfile = (props) => {
  return (
    <Drawer
      zIndex={5000}
      visible={props.visiblePerfil}
      closable={true}
      onClose={() => props.collapsePerfil(null)}
      width={'52vh'}
      bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}>
      <Row justify='center' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <Space size={0} direction='vertical' style={{ textAlign: 'center' }}>
          <Avatar size={110} src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
          <Text style={{ fontSize: '20px' }}>
            {props.cUser && props.cUser.names
              ? props.cUser.names
              : props.cUser && props.cUser.name
              ? props.cUser.name
              : ''}
          </Text>
          <Text type='secondary' style={{ fontSize: '16px' }}>
            {props.cUser && props.cUser.email}
          </Text>
        </Space>
        <Col span={24}>
          <Row justify='center' style={{ marginTop: '20px' }}>
            {/*SOLICITUDES DE AMISTAD*/}
            <ContactRequest
              collapsePerfil={props.collapsePerfil}
              SendFriendship={props.SendFriendship}
              addNotification={props.addNotification}
              AgendarCita={props.AgendarCita}
              UpdateChat={props.UpdateChat}
            />
          </Row>
        </Col>
      </Row>
      <Row justify='center' style={{ paddingLeft: '15px', paddingRight: '5px' }}>
        {props.propertiesUserPerfil && <PropertiesProfile propertiesUserPerfil={props.propertiesUserPerfil} />}
      </Row>
    </Drawer>
  );
};

export default DrawerProfile;
