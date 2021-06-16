import React from 'react';
import { Menu, Row } from 'antd';
import { useRouteMatch, Link } from 'react-router-dom';
import * as iconComponents from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;

const SocialMenu = ({ event }) => {
  return (
    <Menu mode='none'>
      <Menu.Item key='1' icon={<AppstoreOutlined />} />
    </Menu>
  );
};

export default SocialMenu;
