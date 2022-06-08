import { useEffect, useState, useMemo } from 'react';
import { firestore } from '../../helpers/firebase';
import { AgendaApi } from '../../helpers/request';

import CourseProgress from './CourseProgress';

import { UseEventContext } from '../../context/eventContext';
import { UseUserEvent } from '../../context/eventUserContext';

function StudentSelfCourseProgress(props) {
  const { progressType, hasProgressLabel = false } = props;

  const cEventContext = UseEventContext();
  const cEventUser = UseUserEvent();

  let [activities_attendeex, setActivities_attendee] = useState([]);
  let [activities, setActivities] = useState([]);

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

export default StudentSelfCourseProgress;
