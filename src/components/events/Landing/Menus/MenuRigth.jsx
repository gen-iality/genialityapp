import React from 'react';
import { Menu, Badge } from 'antd';
import { CommentOutlined, TeamOutlined, PieChartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import GamepadVariantOutline from '@2fd/ant-design-icons/lib/GamepadVariantOutline';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withContext from '../../../../Context/withContext'

const MenuRigth = (props) => {
  const animateIcon = 'animate__animated animate__bounceIn';

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
                color: props.cEvent.value.styles?.textMenu,
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
            <span>
              <Badge count={props.totalNewMessages}>
                <CommentOutlined
                  className={animateIcon}
                  style={{
                    fontSize: '30px',
                    color: props.cEvent.value.styles.textMenu,
                  }}
                />
              </Badge>
            </span>
          }
          style={{ paddingTop: '20px' }}
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
              className={animateIcon + ' animate__delay-2s'}
              style={{
                fontSize: '30px',
                color: props.cEvent.value.styles.textMenu,
              }}
            />
          }
          style={{ paddingTop: '20px' }}
          onClick={() => {
            props.handleCollapsed();
            props.settabselected('2');
          }}></Menu.Item>
      )}
      {props.currentActivity !== null && props.tabs && (props.tabs.surveys === 'true' || props.tabs.surveys === true) && (
        <Menu.Item
          key='3'
          icon={
            <span>
              <Badge dot={props.hasOpenSurveys}>
                <PieChartOutlined
                  className={animateIcon + ' animate__delay-3s'}
                  style={{
                    fontSize: '30px',
                    color: props.cEvent.value.styles.textMenu,
                  }}
                />
              </Badge>
            </span>
          }
          style={{ paddingTop: '20px' }}
           onClick={() =>  {
            props.handleCollapsed();
            props.settabselected('3');
           }}
        ></Menu.Item>
      )}
      {props.currentActivity !== null && props.tabs && (props.tabs.games === 'true' || props.tabs.games === true) && (
        <Menu.Item
          key='4'
          icon={
            <GamepadVariantOutline
              className={animateIcon + ' animate__delay-4s'}
              style={{
                fontSize: '32px',
                color: props.cEvent.value.styles.textMenu,
              }}
            />
          }
          style={{ paddingTop: '20px' }}
          onClick={() => {
            props.handleCollapsed();
            props.settabselected('4');
          }}></Menu.Item>
      )}
    </Menu>
  );
};


const mapStateToProps = (state) => ({
  currentActivity: state.stage.data.currentActivity,
});

let MenuRigthWithContext = withContext(MenuRigth)
export default connect(mapStateToProps, null)(withRouter(MenuRigthWithContext));


