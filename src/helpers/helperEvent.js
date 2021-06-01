//METODO PARA OBTENER ENCUESTAS
export async function listenSurveysData(event_id) {
  if (!event_id) {
    return [];
  }

  let $query = firestore.collection('surveys').where('eventId', '==', event_id);
  $query.onSnapshot(async (surveySnapShot) => {
    const eventSurveys = [];
    if (surveySnapShot.size === 0) {
      this.setState({ selectedSurvey: {}, surveyVisible: false, publishedSurveys: [] });
      return;
    }
    surveySnapShot.forEach(function(doc) {
      eventSurveys.push({ ...doc.data(), _id: doc.id });
    });

    this.setState({ eventSurveys });
  });
}
