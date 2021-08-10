import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import SocialZone from '../../socialZone/socialZone';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import MenuRigth from './Menus/MenuRigth';
import { connect } from 'react-redux';
const { Sider } = Layout;
import { UseEventContext } from '../../../Context/eventContext';
import { setSpaceNetworking } from '../../../redux/networking/actions';
import DrawerProfile from './DrawerProfile';

const EventSectionMenuRigth = (props) => {
  let [optionselected, setOptionselected] = useState(1);
  let cEvent = UseEventContext();

  function handleCollapsed() {
    props.setSpaceNetworking(!props.viewSocialZoneNetworking);
  }

  return (
    <Sider
      className='collapse-chatEvent'
      style={{ backgroundColor: cEvent.value.styles.toolbarDefaultBg }}
      trigger={null}
      width={400}
      collapsed={props.viewSocialZoneNetworking}>
      {!props.viewPerfil ? (
        <div className='Chat-Event'>
          {props.viewSocialZoneNetworking ? (
            <>
              <MenuRigth
                handleCollapsed={handleCollapsed}
                currentActivity={props.currentActivity}
                tabs={props.tabs}
                generalTabs={props.generalTabs}
                tabselected={props.tabselected}
                settabselected={props.settabselected}
                setchattab={props.setchattab}
                chattab={props.chattab}
              />
            </>
          ) : (
            <>
              <Button
                className='animate__animated animate__headShake animate__slower animate__infinite'
                type='link'
                onClick={() => handleCollapsed()}>
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
                listOfEventSurveys={props.listOfEventSurveys}
                loadingSurveys={props.loadingSurveys}
                setchattab={props.setchattab}
                chattab={props.chattab}
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
