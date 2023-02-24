import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { firestore } from '../../../../helpers/firebase';

function listenSurveysData(event: any, activity: any, currentUser: any, callback: any) {
   //Listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
   let $query = firestore.collection('surveys');

   //Filtro por evento
   if (event && event._id) {
      // @ts-ignore
      $query = $query.where('eventId', '==', event._id);
   }

   $query.onSnapshot((surveySnapShot) => {
      const eventSurveys: any[] = []; // Almacena el Snapshot de todas las encuestas del evento
      let publishedSurveys = [];

      if (surveySnapShot.size === 0) {
         const result = { selectedSurvey: {}, surveyVisible: false, publishedSurveys: [], hasOpenSurveys: false };
         callback(result);
         return;
      }

      surveySnapShot.forEach(function(doc) {
         eventSurveys.push({ ...doc.data(), _id: doc.id });
      });

      // Listado de encuestas publicadas del evento
      publishedSurveys = eventSurveys.filter(
         (survey) =>
            (parseStringBoolean(survey.isPublished)) &&
            ((activity && survey.activity_id === activity._id) ||  parseStringBoolean(survey.isGlobal))
      );

      // Cuando el currentUser se toma de redux sin una sesion corresponde a un objeto vacio
      if (Object.keys(currentUser).length === 0) {
         publishedSurveys = publishedSurveys.filter((item) => {
            return parseStringBoolean(item.allow_anonymous_answers);
         });
      }

      const openSurveys = publishedSurveys.filter(
         (survey) => survey.isOpened && (parseStringBoolean(survey.isOpened))
      );

      const hasOpenSurveys = openSurveys.length > 0 ? true : false;

      const surveyVisible = publishedSurveys && publishedSurveys.length;

      const result = { publishedSurveys, surveyVisible, loading: true, hasOpenSurveys };

      callback(result);
   });
}

export default listenSurveysData;
