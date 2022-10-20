import { useState } from 'react';
import { Layout, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import SocialZone from '../../socialZone/socialZone';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import MenuRigth from './Menus/MenuRigth';
import { connect } from 'react-redux';
const { Sider } = Layout;
import { useEventContext } from '@context/eventContext';
import { setSpaceNetworking } from '../../../redux/networking/actions';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import DrawerProfile from './DrawerProfile';



const EventSectionMenuRigth = (props) => {
  const [optionselected, setOptionselected] = useState(1);
  const cEvent = useEventContext();
  const { isCollapsedMenuRigth, HandleOpenCloseMenuRigth, tabsGenerals } = useHelper();

  const ToggleVisibility = <Button
  id='button_open_menu'
  className='animate__animated animate__headShake animate__slower animate__infinite'
  type='link'
  onClick={() => HandleOpenCloseMenuRigth(true)}>
  <ArrowRightOutlined style={{ fontSize: '20px', color: cEvent.value.styles.textMenu }} />
</Button>;

  return (
    <Sider
      className='collapse-chatEvent'
      style={{ backgroundColor: cEvent.value.styles?.toolbarDefaultBg   }}
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
              <SocialZone
                totalMessages={props.totalNewMessages}
                optionselected={optionselected}
                tab={1}
                generalTabs={props.generalTabs}
                currentActivity={props.currentActivity}
                ToggleVisibilityButton={ToggleVisibility}
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
