import { useEffect } from 'react';
import { Button, Result, Typography } from 'antd';
import { useUserEvent } from '@context/eventUserContext';
import { useEventContext } from '@context/eventContext';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import Loading from '../../../profile/loading';
import { useIntl } from 'react-intl';

export function iAmRegisteredInThisEvent(cEventUser) {
  if (!cEventUser) return;

  let { value, status } = cEventUser;
  if (!value && status === 'LOADING') return 'LOADING';
  if (!value && status === 'LOADED') return 'NOT_REGISTERED';
  if (value?._id && status === 'LOADED') return 'REGISTERED';
}

export function recordTypeForThisEvent(cEvent) {
  if (!cEvent) return;

  let event = cEvent?.value;
  if (!event) return 'LOADING';
  if (event?.visibility === 'PUBLIC' && event?.allow_register === true) return 'PUBLIC_EVENT_WITH_REGISTRATION';
  if (event?.visibility === 'PUBLIC' && event?.allow_register === false) return 'UN_REGISTERED_PUBLIC_EVENT';
  if (event?.visibility === 'PRIVATE' && event?.allow_register === false) return 'PRIVATE_EVENT';
  if (event?.visibility === 'ANONYMOUS' && event?.allow_register === true)
    return 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS';
}

function ThisRouteCanBeDisplayed({ children }) {
  const intl = useIntl();
  let cEventUser = useUserEvent();
  let eventUserId = cEventUser?.value?._id;
  let eventUserStatus = cEventUser.status;
  let cEvent = useEventContext();
  let { handleChangeTypeModal } = useHelper();

  useEffect(() => {
    /** Abrir modal de registro al evento automaticamente para eventos con registro obligatorio */
    (recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION' ||
      recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS') &&
      iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED' &&
      handleChangeTypeModal('registerForTheEvent');
  }, [cEvent, eventUserId, eventUserStatus]);

  function renderTitleComponentForPublicEventWithRegistration(loading) {
    if (loading)
      return <Typography.Title level={2}>{intl.formatMessage({ id: 'modal.no_register.title2' })}</Typography.Title>;
    return <Typography.Title level={2}>{intl.formatMessage({ id: 'modal.no_register.title' })}</Typography.Title>;
  }

  function showComponentForPublicEventWithRegistration(component, loading) {
    switch (component.key) {
      case 'evento':
        return component;
      case 'VirtualConference':
        return '';

      default:
        return (
          <Result
            style={{ backgroundColor: 'white', borderRadius: '15px' }}
            className='animate__animated animate__pulse'
            status='warning'
            title={renderTitleComponentForPublicEventWithRegistration(loading)}
            extra={[
              loading ? (
                ''
              ) : (
                <Button
                  onClick={() => handleChangeTypeModal('registerForTheEvent')}
                  size='large'
                  type='primary'
                  key='goToEvent'>
                  {intl.formatMessage({ id: 'modal.feedback.enroll' })}
                </Button>
              ),
            ]}
          />
        );
    }
  }

  function showComponentunregisteredPublicEvent(component) {
    switch (component.key) {
      case 'evento':
        return component;
      case 'agenda':
        return component;
      case 'activity':
        return component;
      case 'speakers':
        return component;
      case 'videos':
        return component;
      case 'documents':
        return component;
      case 'noticias':
        return component;
      case 'faqs':
        return component;
      case 'ferias':
        return component;
      case 'partners':
        return component;
      case 'ChatList':
        return component;
      case 'VirtualConference':
        return component;
      case 'informativeSection1':
        return component;

      default:
        return (
          <Result
            className='animate__animated animate__pulse'
            status='warning'
            title={
              <Typography.Title level={2}>
                {intl.formatMessage({ id: 'modal.no_register.msg_anonymous.title' })}
              </Typography.Title>
            }
          />
        );
    }
  }

  function showComponentForprivateEvent(component) {
    switch (component.key) {
      case 'VirtualConference':
        return '';

      default:
        return (
          <Result
            className='animate__animated animate__pulse'
            status='warning'
            title={
              <Typography.Title level={2}>
                {intl.formatMessage({ id: 'modal.no_register.msg_private.title' })}
              </Typography.Title>
            }
            subTitle={
              <Typography.Paragraph
                type='secondary'
                style={{
                  fontSize: '18px',
                  overflowWrap: 'anywhere',
                }}>
                {intl.formatMessage({ id: 'modal.no_register.msg_private' })}
              </Typography.Paragraph>
            }
          />
        );
    }
  }

  return (
    <>
      {recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION' &&
        (iAmRegisteredInThisEvent(cEventUser) === 'LOADING'
          ? showComponentForPublicEventWithRegistration(children, 'LOADING')
          : iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED'
          ? showComponentForPublicEventWithRegistration(children)
          : iAmRegisteredInThisEvent(cEventUser) === 'REGISTERED' && children)}

      {recordTypeForThisEvent(cEvent) === 'UN_REGISTERED_PUBLIC_EVENT' &&
        showComponentunregisteredPublicEvent(children)}

      {recordTypeForThisEvent(cEvent) === 'PRIVATE_EVENT' &&
        (iAmRegisteredInThisEvent(cEventUser) === 'LOADING'
          ? showComponentForprivateEvent(children)
          : iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED'
          ? showComponentForprivateEvent(children)
          : iAmRegisteredInThisEvent(cEventUser) === 'REGISTERED' && children)}

      {recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS' &&
        (iAmRegisteredInThisEvent(cEventUser) === 'LOADING'
          ? showComponentForPublicEventWithRegistration(children, 'LOADING')
          : iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED'
          ? showComponentForPublicEventWithRegistration(children)
          : iAmRegisteredInThisEvent(cEventUser) === 'REGISTERED' && children)}
    </>
  );
}

export default ThisRouteCanBeDisplayed;
