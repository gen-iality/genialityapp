import React from 'react';
import { Result } from 'antd';
import { UseUserEvent } from '../../../../Context/eventUserContext';
import { UseEventContext } from '../../../../Context/eventContext';
import Loading from '../../../profile/loading';

function ThisRouteCanBeDisplayed({ children }) {
  let cEventUser = UseUserEvent();
  let cEvent = UseEventContext();

  function iAmRegisteredInThisEvent() {
    if (!cEventUser.value && cEventUser.status === 'LOADING') return 'loading';
    if (!cEventUser.value && cEventUser.status === 'LOADED') return 'notRegistered';
    if (cEventUser.value._id && cEventUser.status === 'LOADED') return 'registered';
  }

  function recordTypeForThisEvent() {
    let event = cEvent.value;
    if (!event) return 'loading';
    if (event.visibility === 'PUBLIC' && event.allow_register === true) return 'publicEventWithRegistration';
    if (event.visibility === 'PUBLIC' && event.allow_register === false) return 'unregisteredPublicEvent';
    if (event.visibility === 'PRIVATE' && event.allow_register === false) return 'privateEvent';
  }

  console.log('debu ', recordTypeForThisEvent());
  return (
    <>
      {recordTypeForThisEvent() === 'publicEventWithRegistration' &&
        (iAmRegisteredInThisEvent() === 'loading' ? (
          <Loading />
        ) : iAmRegisteredInThisEvent() === 'notRegistered' ? (
          <Result status='error' title='Lo sentimos' subTitle='Para acceder a este evento debes estar registrado' />
        ) : (
          iAmRegisteredInThisEvent() === 'registered' && children
        ))}
      {recordTypeForThisEvent() === 'unregisteredPublicEvent' && (
        <Result
          status='success'
          title='Genial 📎'
          subTitle='Participa de este evento sin limites, no todos nuestros eventos son publicos'
        />
      )}
      {recordTypeForThisEvent() === 'privateEvent' && (
        <Result status='warning' title='Lo sentimos' subTitle='Este evento es privado necesitas estar invitado' />
      )}
    </>
  );
}

export default ThisRouteCanBeDisplayed;
