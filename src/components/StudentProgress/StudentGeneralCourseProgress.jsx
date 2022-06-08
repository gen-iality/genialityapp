import { useEffect, useState, useMemo } from 'react';
import { firestore } from '../../helpers/firebase';
import { AgendaApi } from '../../helpers/request';

import CourseProgress from './CourseProgress';

// Do handly if they cannot get data from URI params
import { UseCurrentUser } from '../../context/userContext';
import { EventsApi } from '../../helpers/request';

let initialContextState_EventContext = { error: null, status: 'LOADING', value: null, nameEvent: null };
let initialContextState_UserEvent = { status: 'LOADING', value: null };

function StudentGeneralCourseProgress(props) {
  const { progressType, hasProgressLabel = false, eventId } = props;

  let cUser = UseCurrentUser();

  const [cEventContext, setCEventContext] = useState(initialContextState_EventContext);
  const [cEventUser, setCEventUser] = useState(initialContextState_UserEvent);
  let [activities_attendeex, setActivities_attendee] = useState([]);
  let [activities, setActivities] = useState([]);

  // Set cEventContext
  useEffect(() => {
    if (!eventId) return;
    EventsApi.getOne(eventId).then((eventGlobal) => {
      const dataevent = { status: 'LOADED', value: eventGlobal, nameEvent: eventId, isByname: false };
      setCEventContext(dataevent);
    });
  }, [eventId]);

  // Set cEventUser
  useEffect(() => {
    let event_id = cEventContext.value?._id;
    if (cUser.value == null || cUser.value == undefined) return;
    async function asyncdata() {
      try {
        EventsApi.getStatusRegister(event_id, cUser.value.email).then((responseStatus) => {
          if (responseStatus.data.length > 0) {
            setCEventUser({ status: 'LOADED', value: responseStatus.data[0] });
          } else {
            setCEventUser({ status: 'LOADED', value: null });
          }
        });
      } catch (e) {
        setCEventUser({ status: 'LOADED', value: null });
      }
    }

    if (!event_id) return;
    asyncdata();
  }, [cEventContext.value, cUser.value]);

  // Take data
  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cEventUser || !cEventUser.value) return;

    setActivities_attendee([]);
    const loadData = async () => {
      const { data } = await AgendaApi.byEvent(cEventContext.value._id);
      setActivities(data);
      data.map(async (activity) => {
        let activity_attendee = await firestore
          .collection(`${activity._id}_event_attendees`)
          .doc(cEventUser.value._id)
          .get(); //checkedin_at
        if (activity_attendee.exists) {
          setActivities_attendee((past) => [...past, activity_attendee.data()]);
        }
      });
    };
    loadData();
    return () => {};
  }, [cEventContext.value, cEventUser.value]);

  const progressPercentValue = useMemo(
    () => Math.round(((activities_attendeex.length || 0) / (activities.length || 0)) * 100),
    [activities_attendeex, activities]
  );

  const progressStats = useMemo(() => `${activities_attendeex.length || 0}/${activities.length || 0}`, [
    activities_attendeex,
    activities,
  ]);

  if (cUser.value == null || cUser.value == undefined) {
    return <></>;
  }

  return (
    <CourseProgress
      hasProgressLabel={hasProgressLabel}
      progressStats={progressStats}
      progressPercentValue={progressPercentValue}
      progressType={progressType}
      noProgressSymbol
    />
  );
}

export default StudentGeneralCourseProgress;
