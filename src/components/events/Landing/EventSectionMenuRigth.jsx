import React, { useState, useContext } from 'react';
import { Layout, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import SocialZone from '../../socialZone/socialZone';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import MenuRigth from './Menus/MenuRigth';
import { connect } from 'react-redux';
const { Sider } = Layout;
import { UseEventContext } from '../../../Context/eventContext';
import { setSpaceNetworking } from '../../../redux/networking/actions';
import { HelperContext } from '../../../Context/HelperContext';
import DrawerProfile from './DrawerProfile';

const EventSectionMenuRigth = (props) => {
  let [optionselected, setOptionselected] = useState(1);
  let cEvent = UseEventContext();
  let { isCollapsedMenuRigth, HandleOpenCloseMenuRigth, tabsGenerals } = useContext(HelperContext);

  return (
    <Sider
      className='collapse-chatEvent'
      style={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg }}
      trigger={null}
      width={400}
      collapsed={isCollapsedMenuRigth}>
      {!props.viewPerfil ? (
        <div className='Chat-Event' style={{ height: '100%' }}>
          {isCollapsedMenuRigth ? (
            <>
              <MenuRigth currentActivity={props.currentActivity} tabs={tabsGenerals} generalTabs={props.generalTabs} />
            </>
          ) : (
            <>
              <Button
                id='button_open_menu'
                className='animate__animated animate__headShake animate__slower animate__infinite'
                type='link'
                onClick={() => HandleOpenCloseMenuRigth(true)}>
                <ArrowRightOutlined style={{ fontSize: '20px', color: cEvent.value.styles.textMenu }} />
              </Button>
              <SocialZone
                totalMessages={props.totalNewMessages}
                optionselected={optionselected}
                tab={1}
                generalTabs={props.generalTabs}
                currentActivity={props.currentActivity}
              />
            </>
          )}
        </div>
      ) : (
        <DrawerProfile />
      )}
    </Sider>
  );
};
const mapStateToProps = (state) => ({
  viewPerfil: state.viewPerfilReducer.view,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
});

const mapDispatchToProps = {
  setViewPerfil,
  setSpaceNetworking,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventSectionMenuRigth);
