import { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { firestore } from '@helpers/firebase';
import { ExternalSurvey } from '@helpers/request';
import { EditOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '../../../context/MessageService';

export default class SurveyExternal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishedSurveys: [],
    };
  }
  componentDidMount = () => {
    //
    this.listenActivitySurveysExternal();
  };

  listenActivitySurveysExternal = async () => {
    try {
      let resp = await ExternalSurvey(this.props.meeting_id, true);
      if (resp != null) {
        let surveyList = resp.polls;
        this.setState({ publishedSurveys: surveyList, loading: true });
      }
    } catch (error) {
      error;
    }
  };

  Details = async () => {
    //CREAR SURVEY PARAMETROS INICIALIZADOS
    // Revisar esta función... creo que no se usa para nada
  };

  updateSurvey = (survey_id, data) => {
    return new Promise((resolve) => {
      firestore
        .collection('surveys')
        .doc(survey_id)
        .update({ ...data })
        .then(() => resolve({ message: 'Evaluación actualizada', state: 'updated' }));
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
      <Card title='Gestor de evaluaciones externas'>
        {this.props.isExternal ? (
          <>
            <Row style={{ padding: '8px 16px' }}>
              <Col xs={5} lg={2}>
                <label className='label'>Tìtulo</label>
              </Col>
              <Col xs={17} lg={16}>
                <label className='label'>Pregunta</label>
              </Col>
            </Row>
            {publishedSurveys.map((survey) => {
              return (
                <Row style={{ marginTop: '10px' }} key={survey.id}>
                  <Col style={{ marginRight: '5px' }} xs={5} lg={2}>
                    {survey.title}
                  </Col>
                  <Col xs={17} lg={16}>
                    {survey.questions[0].name}
                  </Col>
                  <Col>
                    <EditOutlined onClick={() => this.Details(survey.id)} />
                  </Col>
                </Row>
              );
            })}
          </>
        ) : (
          <div>No hay evaluaciones publicadas para esta lección</div>
        )}
      </Card>
    );
  }
}
