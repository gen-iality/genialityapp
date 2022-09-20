import { recordTypeForThisEvent } from '@/components/events/Landing/helpers/thisRouteCanBeDisplayed';
import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { UseCurrentUserContext } from '@/context/userContext';
import { EventAccessAction } from './EventAccessAction';
import useEventAccessAction from './useEventAccessAction';

const EventAccessActionContainer = () => {
  let cEvent = UseEventContext();
  let cUser = UseCurrentUserContext();
  let cEventUser = UseUserEvent();

  let attendee_status = () => {
    let status = 'NO_USER';
    status = cUser.value?._id ? 'WITH_USER' : status;
    status = cUser.value?._id && cEventUser.value?._id ? 'WITH_ASSISTANT' : status;
    return status;
  };

  let current_attendee_status = attendee_status();
  let event_access_type = recordTypeForThisEvent(cEvent)!;
  let type_event = cEvent.value?.type_event;

  if (!type_event) return <> </>;

  let eventAction: string = useEventAccessAction({ event_access_type, type_event, current_attendee_status });

  return <EventAccessAction eventAction={eventAction} />;
};
export default EventAccessActionContainer;
