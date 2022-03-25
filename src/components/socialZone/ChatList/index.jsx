import { List, Badge, Tabs } from 'antd';
import * as notificationsActions from '../../../redux/notifications/actions';
import { UseEventContext } from '../../../context/eventContext';
import { UseCurrentUser } from '../../../context/userContext';
import { UseUserEvent } from '../../../context/eventUserContext';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import UsersCard from '../../shared/usersCard';

import ThisRouteCanBeDisplayed, {
  iAmRegisteredInThisEvent,
  recordTypeForThisEvent,
} from '../../events/Landing/helpers/thisRouteCanBeDisplayed';
import AnonymousEvenUserForm from '../hooks/anonymousEvenUserForm';
const { TabPane } = Tabs;
const { setNotification } = notificationsActions;

const styleList = {
  padding: 5,
  borderRadius: '10px',
  backgroundColor: '#ffffff63',
};

const ChatList = (props) => {
  let cUser = UseCurrentUser();
  let cEvent = UseEventContext();
  let cEventUser = UseUserEvent();

  let { chatActual, HandleGoToChat, privateChatsList, chatPublicPrivate, HandlePublicPrivate } = useHelper();

  // constante para insertar texto dinamico con idioma
  const intl = useIntl();

  function callback(key) {
    if (key === 'public') {
      if (chatActual) {
        HandleGoToChat(null, null, null, null, null);
      }
    }
    if (key === 'private') {
      if (chatActual) {
        HandleGoToChat(null, null, null, null, null);
      }
    }

    HandlePublicPrivate(key);
  }

  if (
    (iAmRegisteredInThisEvent(cEventUser) === 'LOADING' || iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED') &&
    recordTypeForThisEvent(cEvent) == 'UN_REGISTERED_PUBLIC_EVENT' &&
    props.generalTabs?.publicChat
  ) {
    return <AnonymousEvenUserForm />;
  }

  let userNameActive = cUser.value?.name ? cUser.value?.name : cUser.value?.names;
  let anonymous = cUser.value?.isAnonymous ? cUser.value?.isAnonymous : 'false';

  return (
    <Tabs style={{ marginTop: '-18px' }} activeKey={chatPublicPrivate} size='small' onChange={callback} centered>
      {props.generalTabs.publicChat && (
        <TabPane
          tab={
            <div style={{ color: cEvent.value.styles.textMenu }}>
              <FormattedMessage id='tabs.public.socialzone' defaultMessage='Público' />
            </div>
          }
          key='public'>
          <iframe
            style={{ marginTop: `${props.props.mobile && props.props.mobile === true ? '-74px' : '-45px'}` }}
            title='chatevius'
            className='ChatEviusLan'
            src={
              'https://chatevius.netlify.app?nombre=' +
              userNameActive +
              '&chatid=event_' +
              cEvent.value?._id +
              '&usereventid=' +
              cEventUser.value?._id +
              '&eventid=' +
              cEvent.value?._id +
              '&userid=' +
              cUser.value?.uid +
              '&version=0.0.2' +
              '&anonimo=' +
              anonymous
            }></iframe>
        </TabPane>
      )}

      {props.generalTabs.privateChat && recordTypeForThisEvent(cEvent) !== 'UN_REGISTERED_PUBLIC_EVENT' && (
        <TabPane
          tab={
            <>
              <Badge
                size='small'
                style={{ minWidth: '10px', height: '10px', padding: '0px', color: cEvent.value.styles.textMenu }}
                count={0}>
                <div style={{ color: cEvent.value.styles.textMenu }}>
                  <FormattedMessage id='tabs.private.socialzone' defaultMessage='Privados' />
                  {chatActual && chatActual.chatname
                    ? ` ( ${intl.formatMessage({ id: 'tabs.private.socialzone.message' })} )`
                    : ''}
                </div>
              </Badge>
            </>
          }
          key='private'>
          {!chatActual.chatname && (
            <ThisRouteCanBeDisplayed>
              <List
                key='PrivateChat'
                className='asistente-list'
                style={styleList}
                dataSource={privateChatsList}
                renderItem={(item) => <UsersCard type='privateChat' item={item} />}
              />
            </ThisRouteCanBeDisplayed>
          )}

          {chatActual.chatname && (
            <>
              <iframe
                style={{ marginTop: `${props.props.mobile && props.props.mobile === true ? '-74px' : '-45px'}` }}
                title='chatevius'
                className='ChatEviusLan'
                src={
                  'https://chatevius.netlify.app?iduser=' +
                  chatActual?.idotheruser +
                  '&chatid=' +
                  chatActual?.chatid +
                  '&eventid=' +
                  cEvent.value?._id +
                  '&usereventid=' +
                  cEventUser.value?._id +
                  '&userid=' +
                  cUser.value?.uid +
                  '&nombre=' +
                  chatActual?.chatname
                }></iframe>
            </>
          )}
        </TabPane>
      )}
    </Tabs>
  );
};

const mapStateToProps = (state) => ({
  mainStage: state.stage.data.mainStage,
  currentSurvey: state.survey.data.currentSurvey,
  currentActivity: state.stage.data.currentActivity,
  viewNotification: state.notifications.data,
});

const mapDispatchToProps = {
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
