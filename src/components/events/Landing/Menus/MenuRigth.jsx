import { useEffect, useState } from 'react';
import { Menu, Badge } from 'antd';
import { CommentOutlined, TeamOutlined, PieChartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import GamepadVariantOutline from '@2fd/ant-design-icons/lib/GamepadVariantOutline';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withContext from '../../../../context/withContext';
import { useHelper } from '../../../../context/helperContext/hooks/useHelper';
import { UseEventContext } from '../../../../context/eventContext';
import { recordTypeForThisEvent } from '../helpers/thisRouteCanBeDisplayed';

const MenuRigth = (props) => {
  let cEvent = UseEventContext();
  const [typeEvent, settypeEvent] = useState();

  let {
    HandleOpenCloseMenuRigth,
    HandleChatOrAttende,
    eventPrivate,
    totalPrivateMessages,
    currentActivity,
    tabsGenerals,
  } = useHelper();

  useEffect(() => {
    settypeEvent(recordTypeForThisEvent(cEvent));
  }, [cEvent]);

  // const animateIcon = 'animate__animated animate__bounceIn';

  return (
    <Menu mode='none' theme='light' style={stylesMenuItems}>
      <>
        {(props.generalTabs?.publicChat || props.generalTabs?.privateChat || props.generalTabs?.attendees) && (
          <Menu.Item
            id={'openMenu'}
            // className='animate__animated animate__headShake animate__slower animate__infinite'
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
            onClick={() => HandleOpenCloseMenuRigth(false)}></Menu.Item>
        )}
        {(props.generalTabs?.publicChat || props.generalTabs?.privateChat) && (
          <Menu.Item
            key='1'
            icon={
              <span>
                <Badge count={totalPrivateMessages}>
                  <CommentOutlined
                    // className={animateIcon}
                    style={{
                      fontSize: '30px',
                      color: props.cEvent.value.styles?.textMenu,
                    }}
                  />
                </Badge>
              </span>
            }
            style={{ paddingTop: '20px' }}
            onClick={() => {
              HandleOpenCloseMenuRigth(false);
              HandleChatOrAttende('1');
            }}></Menu.Item>
        )}
        {/*bloqueado temporalmente mientras se agrega este control de manera global y no a una actividad*/}
        {props.generalTabs?.attendees && typeEvent != 'UN_REGISTERED_PUBLIC_EVENT' && (
          <Menu.Item
            key='2'
            icon={
              <TeamOutlined
                // className={animateIcon + ' animate__delay-2s'}
                style={{
                  fontSize: '30px',
                  color: props.cEvent.value.styles?.textMenu,
                }}
              />
            }
            style={{ paddingTop: '20px' }}
            onClick={() => {
              HandleOpenCloseMenuRigth(false);
              HandleChatOrAttende('2');
            }}></Menu.Item>
        )}
        {currentActivity != null &&
          // currentActivity.habilitar_ingreso === 'open_meeting_room' &&
          typeEvent != 'UN_REGISTERED_PUBLIC_EVENT' && (
            <Menu.Item
              key='3'
              icon={
                <span>
                  <Badge dot={props.hasOpenSurveys}>
                    <PieChartOutlined
                      // className={animateIcon + ' animate__delay-3s'}
                      style={{
                        fontSize: '30px',
                        color: props.cEvent.value.styles?.textMenu,
                      }}
                    />
                  </Badge>
                </span>
              }
              style={{ paddingTop: '20px' }}
              onClick={() => {
                HandleOpenCloseMenuRigth(false);
                HandleChatOrAttende('3');
              }}></Menu.Item>
          )}
        <>
          {tabsGenerals &&
            tabsGenerals.games &&
            currentActivity != null &&
            currentActivity.habilitar_ingreso === 'open_meeting_room' && (
              <Menu.Item
                key='4'
                icon={
                  <GamepadVariantOutline
                    // className={animateIcon + ' animate__delay-4s'}
                    style={{
                      fontSize: '32px',
                      color: props.cEvent.value.styles?.textMenu,
                    }}
                  />
                }
                style={{ paddingTop: '20px' }}
                onClick={() => {
                  HandleOpenCloseMenuRigth(false);
                  HandleChatOrAttende('4');
                }}></Menu.Item>
            )}
        </>
      </>
    </Menu>
  );
};

let MenuRigthWithContext = withContext(MenuRigth);
export default connect(null, null)(withRouter(MenuRigthWithContext));
