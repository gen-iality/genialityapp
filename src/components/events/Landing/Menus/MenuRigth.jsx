import React from 'react';
import { Menu, Badge } from 'antd';
import { CommentOutlined, TeamOutlined, PieChartOutlined } from '@ant-design/icons';
import { UseEventContext } from '../../../../Context/eventContext';

const MenuRigth = (props) => {
  let cEvent = UseEventContext();

  return (
    <Menu theme='light' style={{ backgroundColor: cEvent.styles?.toolbarMenuSocial }}>
      {(props.state.generalTabs?.publicChat || props.state.generalTabs?.privateChat) && (
        <Menu.Item
          key='1'
          icon={
            <>
              <Badge count={props.state.totalNewMessages}>
                <CommentOutlined
                  style={{
                    fontSize: '24px',
                    color: cEvent.styles.color_icon_socialzone,
                  }}
                />
              </Badge>
            </>
          }
          style={{ marginTop: '12px', marginBottom: '22px' }}
          onClick={() => props.toggleCollapsed(1)}></Menu.Item>
      )}

      {/*bloqueado temporalmente mientras se agrega este control de manera global y no a una actividad*/}
      {props.state.generalTabs?.attendees && (
        <Menu.Item
          key='2'
          icon={
            <TeamOutlined
              style={{
                fontSize: '24px',
                color: cEvent.styles.color_icon_socialzone,
              }}
            />
          }
          onClick={() => props.toggleCollapsed(2)}></Menu.Item>
      )}
      {props.state.currentActivity !== null &&
        props.state?.tabs &&
        (props.state.tabs.surveys === 'true' || props.state.tabs.surveys === true) && (
          <Menu.Item
            key='3'
            icon={
              <Badge dot={props.state.hasOpenSurveys}>
                <PieChartOutlined
                  style={{
                    fontSize: '24px',
                    color: cEvent.styles.color_icon_socialzone,
                  }}
                />
              </Badge>
            }
            onClick={() => props.toggleCollapsed(3)}></Menu.Item>
        )}
      {props.state.currentActivity !== null &&
        props.state?.tabs &&
        (props.state.tabs.games === 'true' || props.state.tabs.games === true) && (
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
              props.state.setMainStage('game');
              props.toggleCollapsed(4);
            }}></Menu.Item>
        )}
    </Menu>
  );
};

export default MenuRigth;
