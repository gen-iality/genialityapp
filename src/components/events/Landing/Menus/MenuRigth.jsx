import React from 'react';
import { Menu, Badge } from 'antd';
import { CommentOutlined, TeamOutlined, PieChartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';

const MenuRigth = (props) => {
  return (
    <Menu mode='none' theme='light' style={stylesMenuItems}>
      <Menu.Item
        className='animate__animated animate__headShake animate__slower animate__infinite'
        key='0'
        icon={
          <>
            <ArrowLeftOutlined
              style={{
                fontSize: '25px',
                color: props.cEvent.styles.textMenu,
              }}
            />
          </>
        }
        style={{ marginTop: '12px', marginBottom: '22px' }}
        onClick={() => props.handleCollapsed()}></Menu.Item>

      {(props.generalTabs?.publicChat || props.generalTabs?.privateChat) && (
        <Menu.Item
          key='1'
          icon={
            <>
              <Badge count={props.totalNewMessages}>
                <CommentOutlined
                  style={{
                    fontSize: '31px',
                    color: props.cEvent.styles.textMenu,
                  }}
                />
              </Badge>
            </>
          }
          style={{ marginTop: '12px', marginBottom: '22px' }}
          onClick={() => {
            props.handleCollapsed();
            props.settabselected('1');
          }}></Menu.Item>
      )}

      {/*bloqueado temporalmente mientras se agrega este control de manera global y no a una actividad*/}
      {props.generalTabs?.attendees && (
        <Menu.Item
          key='2'
          icon={
            <TeamOutlined
              style={{
                fontSize: '31px',
                color: props.cEvent.styles.textMenu,
              }}
            />
          }
          onClick={() => {
            props.handleCollapsed();
            props.settabselected('2');
          }}></Menu.Item>
      )}
      {props.currentActivity !== null && props.tabs && (props.tabs.surveys === 'true' || props.tabs.surveys === true) && (
        <Menu.Item
          key='3'
          icon={
            <Badge dot={props.hasOpenSurveys}>
              <PieChartOutlined
                style={{
                  fontSize: '31px',
                  color: props.cEvent.styles.textMenu,
                }}
              />
            </Badge>
          }
          // onClick={() => props.toggleCollapsed(3)}
        ></Menu.Item>
      )}
      {props.currentActivity !== null && props.tabs && (props.tabs.games === 'true' || props.tabs.games === true) && (
        <Menu.Item
          key='4'
          icon={
            <img
              src='https://cdn0.iconfinder.com/data/icons/gaming-console/128/2-512.png'
              style={{ width: '50px', height: '32px' }}
              alt='Games'
            />
          }
          onClick={() => {
            // props.setMainStage('game');
            // props.toggleCollapsed(4);
          }}></Menu.Item>
      )}
    </Menu>
  );
};

export default MenuRigth;
