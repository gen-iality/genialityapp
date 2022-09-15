import { recordTypeForThisEvent } from '@/components/events/Landing/helpers/thisRouteCanBeDisplayed';
import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { UseCurrentUserContext } from '@/context/userContext';
import { Button, Spin } from 'antd';
import useEventAccessAction from './useEventAccessAction';

const EventAccessAction = () => {
  let cEvent = UseEventContext();
  let cUser = UseCurrentUserContext();
  let cEventUser = UseUserEvent();

  let attendee_status = () => {
    let status = 'NO_USER';
    status = cUser.value?._id ? 'WITH_USER' : status;
    status = cEventUser.value?._id ? 'WITH_ASSISTANT' : status;
    return status;
  };

  let current_attendee_status = attendee_status();
  let event_access_type = recordTypeForThisEvent(cEvent)!;
  let type_event = cEvent.value?.type_event;

  if (!type_event) return <Spin />;

  let eventAction: string = useEventAccessAction({ event_access_type, type_event, current_attendee_status });

  return (
    <div>
      {/* <div>EventAccessAction</div>
      <div>Event ID: {cEvent.value._id}</div>
      <div>Event_access_type: {event_access_type}</div>
      <div>Event Mode: {type_event}</div>
      <div>current_attendee_status: {current_attendee_status}</div> */}
      {eventAction === 'REGISTER' && (
        <Button type='text' size='large'>
          {eventAction}
        </Button>
      )}
      {eventAction === 'REGISTER_USER_OR_SIGN_UP_FOR_THE_EVENT' && (
        <Button type='link' size='large'>
          {eventAction}
        </Button>
      )}
      {eventAction === 'REGISTER_EVENT' && (
        <Button type='ghost' size='large'>
          {eventAction}
        </Button>
      )}
      {eventAction === 'YOU_ARE_ALREADY_REGISTERED' && (
        <Button type='default' size='large'>
          {eventAction}
        </Button>
      )}
      {eventAction === 'JOIN_OR_EXTERNAL_LINK' && (
        <Button type='dashed' size='large'>
          {eventAction}
        </Button>
      )}
      {eventAction === 'PRIVATE_EVENT' && (
        <Button type='primary' size='large'>
          {eventAction}
        </Button>
      )}
      {eventAction === 'ANY' && (
        <h2 style={{ padding: '10px', background: 'rgba(10,10,10,0.2)', borderRadius: '8px' }}>
          <b>{eventAction}</b>
        </h2>
      )}
    </div>
  );
};
export default EventAccessAction;
