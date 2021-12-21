import React from 'react';
import { Button, Result, Typography } from 'antd';
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
                Este evento requiere que los asistentes se registren para poder participar.{console.log(children)}
              </Typography.Paragraph>
            }
            extra={[
              <Button size='large' type='primary' key='goToEvent'>
                Registrarme
              </Button>,
            ]}
          />
        ) : (
          iAmRegisteredInThisEvent() === 'registered' && children
        ))}
      {recordTypeForThisEvent() === 'unregisteredPublicEvent' && children}
      {recordTypeForThisEvent() === 'privateEvent' && (
        <Result status='warning' title='Lo sentimos' subTitle='Este evento es privado necesitas estar invitado' />
      )}
    </>
  );
}

export default ThisRouteCanBeDisplayed;
