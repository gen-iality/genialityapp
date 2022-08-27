import { useEffect, useState, useMemo, memo } from 'react';
import { firestore } from '@helpers/firebase';
import { AgendaApi } from '@helpers/request';

import CourseProgress from './CourseProgress';

import { UseEventContext } from '@context/eventContext';
import { UseUserEvent } from '@context/eventUserContext';

import type AgendaType from '@Utilities/types/AgendaType';

type CurrentEventAttendees = any; // TODO: define this type and move to @Utilities/types/

export interface StudentSelfCourseProgressProps {
  progressType: 'circle' | 'block',
  hasProgressLabel?: boolean,
};

function StudentSelfCourseProgress(props: StudentSelfCourseProgressProps) {
  const {
    progressType,
    hasProgressLabel = false,
  } = props;

  const cEventContext = UseEventContext();
  const cEventUser = UseUserEvent();

  let [activitiesAttendee, setActivitiesAttendee] = useState<CurrentEventAttendees[]>([]);
  let [allActivities, setAllActivities] = useState<AgendaType[]>([]);

  // Take data
  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cEventUser || !cEventUser.value) return;

    setActivitiesAttendee([]);
    const loadData = async () => {
      const { data }: { data: AgendaType[] } = await AgendaApi.byEvent(cEventContext.value._id);
      setAllActivities(data);
      const existentActivities = data.map(async (activity) => {
        const activityAttendee = await firestore
          .collection(`${activity._id}_event_attendees`)
          .doc(cEventUser.value._id)
          .get(); //checkedin_at
        if (activityAttendee.exists) return activityAttendee.data() as CurrentEventAttendees;
        return null;
      });
      // Filter existent activities and set the state
      setActivitiesAttendee(
        // Promises don't bite :)
        (await Promise.all(existentActivities)).filter((item) => !!item)
      );
    };
    loadData();
  }, [cEventContext.value, cEventUser.value]);

  const progressPercentValue: number = useMemo(() => (
    Math.round(((activitiesAttendee.length || 0) / (allActivities.length || 0)) * 100)
  ), [activitiesAttendee, allActivities]);

  const progressStats: string = useMemo(() => (
    `${activitiesAttendee.length || 0}/${allActivities.length || 0}`
  ), [activitiesAttendee, allActivities]);

  return (
    <CourseProgress
      hasProgressLabel={hasProgressLabel}
      progressStats={progressStats}
      progressPercentValue={progressPercentValue}
      progressType={progressType}
    />
  );
}

export default memo(StudentSelfCourseProgress);
