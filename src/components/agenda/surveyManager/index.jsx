import { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { firestore, fireRealtime } from '../../../helpers/firebase';
import SurveyItem from './surveyItem';
import { DispatchMessageService } from '../../../context/MessageService';

export default class SurveyManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishedSurveys: [],
    };
  }
  componentDidMount = () => {
    this.listenActivitySurveys();
  };

  listenActivitySurveys = () => {
    const { event_id, activity_id } = this.props;
    //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
    let $query = firestore.collection('surveys');

    //Le agregamos el filtro por curso
    if (event_id) {
      $query = $query.where('eventId', '==', event_id);
    }

    $query.onSnapshot(async (surveySnapShot) => {
      // Almacena el Snapshot de todas las encuestas del curso

      const eventSurveys = [];
      let publishedSurveys = [];

      if (surveySnapShot.size === 0) {
        this.setState({ publishedSurveys: [] });
        return;
      }

      surveySnapShot.forEach(function(doc) {
        eventSurveys.push({ ...doc.data(), survey_id: doc.id });
      });

      // Listado de encuestas publicadas del curso
      publishedSurveys = eventSurveys.filter(
        (survey) => survey.activity_id === activity_id || survey.isGlobal === 'true'
      );

      this.setState({ publishedSurveys, loading: true });
    });
  };

  updateSurvey = (survey_id, data) => {
    return new Promise((resolve) => {
      //Abril 2021 @todo migracion de estados de firestore a firebaserealtime
      //let eventId = surveyInfo.eventId || 'general';
      let eventId = data.eventId || 'general';
      fireRealtime.ref('events/' + eventId + '/surveys/' + survey_id).update(data);
      firestore
        .collection('surveys')
        .doc(survey_id)
        .update({ ...data })
        .then(() => resolve({ message: 'Encuesta Actualizada', state: 'updated' }));
    });
  };

  handleChange = async (survey_id, data) => {
    const result = await this.updateSurvey(survey_id, data);

    if (result && result.state === 'updated') {
      DispatchMessageService({
        type: 'success',
        msj: result.message,
        action: 'show',
      });
    }
  };

  render() {
    const { publishedSurveys } = this.state;
    return (
      <Card title='Gestor de encuestas'>
        {publishedSurveys.length > 0 ? (
          <>
            <Row style={{ padding: '8px 16px' }}>
              <Col xs={12} lg={8}>
                <label className='label'>Encuesta</label>
              </Col>
              <Col xs={4} lg={3}>
                <label className='label'>Publicar</label>
              </Col>
              <Col xs={4} lg={2}>
                <label className='label'>Abrir</label>
              </Col>
              {/* <Col xs={4} lg={2}>
                <label className='label'>Pausar</label>
              </Col> */}
            </Row>
            {publishedSurveys.map((survey) => {
              return <SurveyItem key={`survey-${survey.survey_id}`} survey={survey} onChange={this.handleChange} />;
            })}
          </>
        ) : (
          <div>No hay encuestas publicadas para esta lección</div>
        )}
      </Card>
    );
  }
}
