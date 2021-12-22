import React, { useContext } from 'react';
import { Button, Result, Typography } from 'antd';
import { UseUserEvent } from '../../../../Context/eventUserContext';
import { UseEventContext } from '../../../../Context/eventContext';
import HelperContext from '../../../../Context/HelperContext';
import Loading from '../../../profile/loading';

export function iAmRegisteredInThisEvent(cEventUser) {
  if (!cEventUser.value && cEventUser.status === 'LOADING') return 'LOADING';
  if (!cEventUser.value && cEventUser.status === 'LOADED') return 'NOT_REGISTERED';
  if (cEventUser.value._id && cEventUser.status === 'LOADED') return 'REGISTERED';
}

export function recordTypeForThisEvent(cEvent) {
  let event = cEvent.value;
  if (!event) return 'LOADING';
  if (event.visibility === 'PUBLIC' && event.allow_register === true) return 'PUBLIC_EVENT_WITH_REGISTRATION';
  if (event.visibility === 'PUBLIC' && event.allow_register === false) return 'UN_REGISTERED_PUBLIC_EVENT';
  if (event.visibility === 'PRIVATE' && event.allow_register === false) return 'PRIVATE_EVENT';
}

function ThisRouteCanBeDisplayed({ children }) {
  let cEventUser = UseUserEvent();
  let cEvent = UseEventContext();
  let { handleChangeTypeModal } = useContext(HelperContext);

  function showComponentForPublicEventWithRegistration(component) {
    switch (component.key) {
      case 'evento':
        return component;
      case 'VirtualConference':
        return '';

      default:
        return (
          <Result
            className='animate__animated animate__pulse'
            status='warning'
            title={<Typography.Title level={2}>Usuario no registrado al evento</Typography.Title>}
            subTitle={
              <Typography.Paragraph
                type='secondary'
                style={{
                  fontSize: '18px',
                  overflowWrap: 'anywhere',
                }}>
                Este evento requiere que los asistentes se registren para poder participar.
              </Typography.Paragraph>
            }
            extra={[
              <Button
                onClick={() => handleChangeTypeModal('registerForTheEvent')}
                size='large'
                type='primary'
                key='goToEvent'>
                Registrarme
              </Button>,
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

      default:
        return (
          <Result
            className='animate__animated animate__pulse'
            status='warning'
            title={<Typography.Title level={2}>Usuario no registrado al evento</Typography.Title>}
            subTitle={
              <Typography.Paragraph
                type='secondary'
                style={{
                  fontSize: '18px',
                  overflowWrap: 'anywhere',
                }}>
                Este evento es publico pero para poder acceder a esta función requiere que los asistentes se registren.
              </Typography.Paragraph>
            }
            extra={[
              <Button
                onClick={() => handleChangeTypeModal('registerForTheEvent')}
                size='large'
                type='primary'
                key='goToEvent'>
                Registrarme
              </Button>,
            ]}
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
            title={<Typography.Title level={2}>Lo sentimos</Typography.Title>}
            subTitle={
              <Typography.Paragraph
                type='secondary'
                style={{
                  fontSize: '18px',
                  overflowWrap: 'anywhere',
                }}>
                Este evento es privado para poder participar debes estar invitado.
              </Typography.Paragraph>
            }
            extra={[
              <Button
                onClick={() => alert('Por favor llamar al numero 📱+57-321-253-24-51')}
                size='large'
                type='primary'
                key='goToEvent'>
                Contactarme con el administrador
              </Button>,
            ]}
          />
        );
    }
  }
  // console.log('debu iAmRegisteredInThisEvent ', iAmRegisteredInThisEvent());
  // console.log('debu recordTypeForThisEvent ', recordTypeForThisEvent());
  return (
    <>
      {recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION' &&
        (iAmRegisteredInThisEvent(cEventUser) === 'LOADING' ? (
          <Loading />
        ) : iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED' ? (
          showComponentForPublicEventWithRegistration(children)
        ) : (
          iAmRegisteredInThisEvent() === 'REGISTERED' && children
        ))}

      {recordTypeForThisEvent(cEvent) === 'UN_REGISTERED_PUBLIC_EVENT' &&
        showComponentunregisteredPublicEvent(children)}

      {recordTypeForThisEvent(cEvent) === 'PRIVATE_EVENT' &&
        (iAmRegisteredInThisEvent(cEventUser) === 'LOADING'
          ? showComponentForprivateEvent(children)
          : iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED'
          ? showComponentForprivateEvent(children)
          : iAmRegisteredInThisEvent(cEventUser) === 'REGISTERED' && children)}
    </>
  );
}

export default ThisRouteCanBeDisplayed;
