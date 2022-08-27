import { useEffect, useState, useMemo, memo } from 'react';
import { firestore } from '@helpers/firebase';
import { AgendaApi } from '@helpers/request';

import CourseProgress from './CourseProgress';

// Do handly if they cannot get data from URI params
import { UseCurrentUser } from '@context/userContext';
import { EventsApi } from '@helpers/request';

import type AgendaType from '@Utilities/types/AgendaType';
import { Spin } from 'antd';


type CurrentEventAttendees = any; // TODO: define this type and move to @Utilities/types/

export interface StudentGeneralCourseProgressProps {
  progressType: 'circle' | 'block',
  hasProgressLabel?: boolean,
  eventId: string,
};

function StudentGeneralCourseProgress(props: StudentGeneralCourseProgressProps) {
  const {
    progressType,
    hasProgressLabel = false,
    eventId,
  } = props;

  const cUser = UseCurrentUser();
  if (cUser.value == null || cUser.value == undefined) {
    return <></>;
  }

  const [eventUserId, setEventUserId] = useState<string | null>(null);
  const [activitiesAttendee, setActivitiesAttendee] = useState<CurrentEventAttendees[]>([]);
  const [activities, setActivities] = useState<AgendaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set cEventUser
  useEffect(() => {
    if (!eventId) return;
    if (!cUser.value) return;

    async function asyncdata() {
      try {
        EventsApi.getStatusRegister(eventId, cUser.value.email).then((responseStatus) => {
          if (responseStatus.data.length > 0) {
            console.debug('responseStatus.data', responseStatus.data);
            setEventUserId(responseStatus.data[0]._id as string);
          }
        });
      } catch (err) {
        console.error('Tried to load from EventsApi.getStatusRegister',err);
      }
    }

    asyncdata();
  }, [eventId, cUser.value]);

  // Take data
  useEffect(() => {
    if (!eventId || !eventUserId) return;

    setActivitiesAttendee([]);
    const loadData = async () => {
      const { data } = await AgendaApi.byEvent(eventId);
      setActivities(data);
      const existentActivities = data.map(async (activity: AgendaType) => {
        let activity_attendee = await firestore
          .collection(`${activity._id}_event_attendees`)
          .doc(eventUserId)
          .get(); //checkedin_at
        if (activity_attendee.exists) {
          return activity_attendee.data();
          // setActivities_attendee((past) => [...past, activity_attendee.data()]);
        }
        return null;
      });
      // Filter existent activities and set the state
      setActivitiesAttendee(
        // Promises don't bite :)
        (await Promise.all(existentActivities)).filter((item) => !!item)
      );
    };
    loadData().then(() => setIsLoading(false));
  }, [eventId, eventUserId]);

  const progressPercentValue = useMemo(() => (
    Math.round(((activitiesAttendee.length || 0) / (activities.length || 0)) * 100)
  ), [activitiesAttendee, activities]);

  const progressStats = useMemo(() => (
    isLoading ? <Spin/> : `${activitiesAttendee.length || 0}/${activities.length || 0}`
  ), [isLoading, activitiesAttendee, activities]);

  return (
    <CourseProgress
      hasLabel={hasProgressLabel}
      stats={progressStats}
      percentValue={progressPercentValue}
      type={progressType}
    />
  );
}

export default memo(StudentGeneralCourseProgress);
