import { CurrentEventContext } from '@/context/eventContext';
import { firestore } from '@/helpers/firebase';
import { AgendaApi } from '@/helpers/request';
import { Spin, Timeline } from 'antd';
import { useContext, useEffect, useState } from 'react';
import moment from 'moment';

const ActivityBlock = () => {
  const cEvent = useContext(CurrentEventContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cEvent.value) return;
    setLoading(true);
    obtenerActivity();
    async function obtenerActivity() {
      const { data } = await AgendaApi.byEvent(cEvent.value._id);
      const listActivity = [];
      if (data) {
        await Promise.all(
          data.map(async (activity) => {
            const dataActivity = await firestore
              .collection('events')
              .doc(cEvent?.value?._id)
              .collection('activities')
              .doc(activity._id)
              .get();
            if (dataActivity.exists) {
              let { habilitar_ingreso, isPublished, meeting_id, platform } = dataActivity.data();
              const activityComplete = { ...activity, habilitar_ingreso, isPublished, meeting_id, platform };
              listActivity.push(activityComplete);
            } else {
              let updatedActivityInfo = {
                habilitar_ingreso: true,
                isPublished: true,
                meeting_id: null,
                platform: null,
              };
              const activityComplete = { ...activity, updatedActivityInfo };
              listActivity.push(activityComplete);
            }
          })
        );
        //MOSTRAR SOLO ACTIVIDADES PUBLICADAS
        let filterActivity = listActivity?.filter(
          (activity) => activity.isPublished === true || activity.isPublished === undefined
        );
        //ORDENAR ACTIVIDADES
        filterActivity = filterActivity.sort(
          (a, b) => moment(a.datetime_start).toDate() - moment(b.datetime_start).toDate()
        );

        setActivities(filterActivity);
        setLoading(false);
      } else {
        setActivities([]);
        setLoading(false);
      }
      //console.log('DATA NEW==>', data);
    }
  }, [cEvent.value]);
  return !loading ? (
    <Timeline>
      {activities.map((activity) => {
        return (
          <Timeline.Item key={activity?._id}>
            {activity?.name} {activity?.datetime_start}
          </Timeline.Item>
        );
      })}
    </Timeline>
  ) : (
    <Spin />
  );
};

export default ActivityBlock;
