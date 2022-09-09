import { useEffect, useState, useMemo, memo, ReactNode } from 'react';
import { firestore } from '@helpers/firebase';
import { AgendaApi } from '@helpers/request';

import CourseProgress from './CourseProgress';

import { UseEventContext } from '@context/eventContext';
import { UseUserEvent } from '@context/eventUserContext';

import type AgendaType from '@Utilities/types/AgendaType';
import { Spin } from 'antd';

type CurrentEventAttendees = any; // TODO: define this type and move to @Utilities/types/

export interface StudentSelfCourseProgressProps {
  progressType: 'circle' | 'block',
  hasProgressLabel?: boolean,
  activityFilter?: (a: AgendaType) => boolean,
  customTitle?: string,
};

function StudentSelfCourseProgress(props: StudentSelfCourseProgressProps) {
  const {
    progressType,
    hasProgressLabel = false,
    activityFilter = (a: AgendaType) => true,
    customTitle,
  } = props;

  const cEventContext = UseEventContext();
  const cEventUser = UseUserEvent();

  const [activitiesAttendee, setActivitiesAttendee] = useState<CurrentEventAttendees[]>([]);
  const [allActivities, setAllActivities] = useState<AgendaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Take data
  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cEventUser || !cEventUser.value) return;

    setActivitiesAttendee([]);
    const loadData = async () => {
      const { data }: { data: AgendaType[] } = await AgendaApi.byEvent(cEventContext.value._id);
      const filteredData = data.filter(activityFilter);
      setAllActivities(filteredData);
      const existentActivities = filteredData.map(async (activity) => {
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
    loadData().then(() => setIsLoading(false));
  }, [cEventContext.value, cEventUser.value]);

  const progressPercentValue: number = useMemo(() => (
    Math.round(((activitiesAttendee.length || 0) / (allActivities.length || 0)) * 100)
  ), [activitiesAttendee, allActivities]);

  const progressStats = useMemo(() => (
    isLoading ? <Spin/> : `${activitiesAttendee.length || 0}/${allActivities.length || 0}`
  ), [isLoading, activitiesAttendee, allActivities]);

  return (
    <CourseProgress
      title={customTitle}
      hasLabel={hasProgressLabel}
      stats={progressStats || <Spin/>}
      percentValue={progressPercentValue}
      type={progressType}
    />
  );
}

export default memo(StudentSelfCourseProgress);
