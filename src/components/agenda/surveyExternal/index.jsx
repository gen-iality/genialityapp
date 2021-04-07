import React, { Component } from 'react';
import { Card, Row, Col, message } from 'antd';
import { firestore } from '../../../helpers/firebase';
import SurveyItem from '../surveyManager/surveyItem';
import { ExternalSurvey } from '../../../helpers/request';
import { EditOutlined } from '@ant-design/icons';
import { SurveysApi} from '../../../helpers/request';


export default class SurveyExternal extends Component {
  constructor(props) {

    super(props);
    this.state = {
      publishedSurveys: [],   
    };
  }
  componentDidMount = () => {
    //console.log("IS EXTERNAL=>"+this.props.isExternal)
    this.listenActivitySurveysExternal();
   
  };

  listenActivitySurveysExternal = async () => {

    try {
        let resp=await ExternalSurvey(this.props.meeting_id,true);       
        if(resp!=null){
            let surveyList=resp.polls;
            this.setState({ publishedSurveys:surveyList, loading: true });
        } 
    } catch (error) {
       console.log("ERROR=>"+error); 
    }     
    
  };

  Details=async(surveyId)=>{
    console.log("SURVEY ID=>"+surveyId);
    //CREAR SURVEY PARAMETROS INICIALIZADOS     
     const data = {
      survey: null,
      publish: 'true',
      open: 'false',
      allow_anonymous_answers: false,
      allow_gradable_survey: false,
      show_horizontal_bar: false,
      allow_vote_value_per_user: 'false',
      freezeGame: false,
      event_id: this.props.event._id,
      activity_id: this.props.activity_id,
      points: 1,
      initialMessage: "",
      time_limit: 0,
      win_Message: "",
      neutral_Message: "",
      lose_Message: "",
      isGlobal: false,
      hasMinimumScore: false,
      minimumScore: 0,
    };
    const save = await SurveysApi.createOne(this.props.event._id, data);
    const idSurveyE = save._id;
  }




  updateSurvey = (survey_id, data) => {
    return new Promise((resolve, reject) => {
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
      message.success(result.message);
    }
  };

  render() {
    const { publishedSurveys } = this.state;
    return (
      <Card title='Gestor de encuestas externas'>
        {this.props.isExternal? (
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
             return <Row style={{marginTop:"10px"}} key={survey.id}><Col style={{marginRight:"5px"}} xs={5} lg={2}>{survey.title}</Col><Col xs={17} lg={16}>{survey.questions[0].name}</Col><Col><EditOutlined onClick={()=>this.Details(survey.id)} /></Col></Row>
            })}
         </>
        ) : (
          <div>No hay encuestas publicadas para esta actividad</div>
        )}
      </Card>
    );
  }
}
