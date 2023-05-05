import { AgendaApi } from "@/helpers/request";
import { Agenda, ApiGeneric } from "../types";
import { firestore } from "@/helpers/firebase";

export const obtenerActivity = async (eventId : string,setActivities : React.Dispatch<React.SetStateAction<Agenda[]>>) => {
    const { data } : ApiGeneric<Agenda>  = await AgendaApi.byEvent(eventId);
    const listActivity : Agenda[] = [];
    if (data) {
      await Promise.all(
        data.map(async (activity) => {
          const dataActivity = await firestore
            .collection('events')
            .doc(eventId)
            .collection('activities')
            .doc(activity._id)
            .get();
          if (dataActivity.exists) {
            let { habilitar_ingreso, isPublished, meeting_id, platform } : any= dataActivity.data();
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
       filterActivity = filterActivity.sort((a, b) => new Date(a.datetime_start).getTime() - new Date(b.datetime_start).getTime()
       ); 
        console.log('filterActivity',filterActivity);
        
      setActivities(filterActivity);
    } else {
      setActivities([]);
    }
  }