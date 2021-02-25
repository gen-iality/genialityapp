import React, { Component } from 'react';
import { List, Button, Card, Tag, Result, Spin, Row, Col } from 'antd';
import { MehOutlined } from '@ant-design/icons';
import { firestore } from '../../../helpers/firebase';
import { connect } from 'react-redux';
import { Actions, TicketsApi } from '../../../helpers/request';
import * as Cookie from 'js-cookie';
import * as StageActions from '../../../redux/stage/actions';
import * as SurveyActions from '../../../redux/survey/actions';

const { setMainStage } = StageActions;
const { setCurrentSurvey } = SurveyActions;

const headStyle = {
  fontWeight: 300,
  textTransform: 'uppercase',
  textAlign: 'center',
  color: '#000',
};

class SurveyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey: {},
      surveysData: [],
      loading: false,
      surveyVisible: false,
      availableSurveysBar: props.availableSurveysBar || false,
      surveyRecentlyChanged: false,
      userVote: false,
      forceCheckVoted: false,
      surveyLabel: {},
      defaultSurveyLabel: {
        name: 'Encuestas',
        section: 'survey',
        icon: 'FileUnknownOutlined',
        checked: false,
        permissions: 'public',
      },

      // luego de cargar el componente este estado permanece escuchando todas las encuestas del evento
      eventSurveys: [], // Todas las encuestas de un evento, este estado va a estar escuchando
      anonymousSurveys: [], // Solo encuestas que permiten usuarios anónimos
      publishedSurveys: [], // Encuestas relacionadas con la actividad + globales para renderizar el listado de encuestas en componente de videoconferencia
    };
  }

  async componentDidMount() {
    let { event } = this.props;

    // Método para escuchar todas las encuestas relacionadas con el evento
    await this.listenSurveysData();

    // Verifica si el usuario esta inscrito en el evento para obtener su rol en compoente RootPage para saber si es un speaker
    let eventUser = await this.getCurrentEvenUser(event._id);

    this.setState({ eventUser: eventUser });
    // this.userVote();
    this.getItemsMenu();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.activity !== this.props.activity) {
      // Método para escuchar todas las encuestas relacionadas con el evento
      await this.listenSurveysData();
    }
  }

  listenSurveysData = async () => {
    const { event, activity } = this.props;

    //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
    let $query = firestore.collection('surveys');

    //Le agregamos el filtro por evento
    if (event && event._id) {
      $query = $query.where('eventId', '==', event._id);
    }

    $query.onSnapshot(async (surveySnapShot) => {
      // Almacena el Snapshot de todas las encuestas del evento

      const eventSurveys = [];
      let publishedSurveys = [];

      if (surveySnapShot.size === 0) {
        this.setState({ selectedSurvey: {}, surveyVisible: false, publishedSurveys: [] });
        return;
      }

      surveySnapShot.forEach(function(doc) {
        eventSurveys.push({ ...doc.data(), _id: doc.id });
      });

      // Listado de encuestas publicadas del evento
      publishedSurveys = eventSurveys.filter(
        (survey) =>
          (survey.isPublished === 'true' || survey.isPublished === true) &&
          ((activity && survey.activity_id === activity._id) || survey.isGlobal === 'true')
      );

      this.setState(
        { publishedSurveys, surveyVisible: publishedSurveys && publishedSurveys.length, loading: true },
        this.callback
      );
    });
  };

  queryMyResponses = async (survey) => {
    const { currentUser } = this.props;
    //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
    let counterDocuments = 0;
    return new Promise((resolve, reject) => {
      firestore
        .collectionGroup('responses')
        .where('id_survey', '==', survey._id)
        .where('id_user', '==', currentUser._id)
        .get()
        .then((result) => {
          result.forEach(function(doc) {
            if (doc.exists) {
              counterDocuments++;
            }
          });

          if (counterDocuments > 0) {
            resolve({ userHasVoted: true, totalResponses: counterDocuments });
          } else {
            resolve({ userHasVoted: false, totalResponses: counterDocuments });
          }
        });
    });
  };

  callback = async () => {
    const { publishedSurveys } = this.state;
    const { currentUser } = this.props;

    const checkMyResponses = new Promise((resolve, reject) => {
      let filteredSurveys = [];

      publishedSurveys.forEach(async (survey, index, arr) => {
        if (currentUser) {
          const result = await this.queryMyResponses(survey);
          filteredSurveys.push({
            ...arr[index],
            userHasVoted: result.userHasVoted,
            totalResponses: result.totalResponses,
          });
        }
        if (filteredSurveys.length === arr.length) resolve(filteredSurveys);
      });
    });

    let stateSurveys = await checkMyResponses;

    this.setState({ publishedSurveys: stateSurveys, forceCheckVoted: false, loading: false });
  };

  getItemsMenu = async () => {
    let { defaultSurveyLabel } = this.state;
    const { event } = this.props;
    const response = await Actions.getAll(`/api/events/${event._id}`);

    let surveyLabel = response.itemsMenu.survey || defaultSurveyLabel;
    this.setState({ surveyLabel });
  };

  getCurrentEvenUser = async (eventId) => {
    let evius_token = Cookie.get('evius_token');
    if (!evius_token) return null;
    let response = await TicketsApi.getByEvent(eventId, evius_token);
    return response && response.data.length ? response.data[0] : null;
  };

  pluralToSingular = (char, t1, t2) => {
    if (t1 !== undefined) return `${t1}${t2}`;
    return '';
  };

  handleClick = (currentSurvey) => {
    const { activity, setMainStage, setCurrentSurvey } = this.props;
    if (activity !== null) {
      setMainStage('surveyDetalle');
    }
    setCurrentSurvey(currentSurvey);
  };

  render() {
    const { surveyLabel, loading, publishedSurveys } = this.state;

    return (
      <>
        <Card className='' headStyle={headStyle}>
          {publishedSurveys && publishedSurveys.length === 0 && (
            <Result icon={<MehOutlined />} title='Aún no se han publicado encuestas' />
          )}

          {publishedSurveys && publishedSurveys.length > 0 && (
            <List
              dataSource={publishedSurveys}
              renderItem={(survey) => (
                <List.Item key={survey._id}>
                  <List.Item.Meta
                    title={survey.name}
                    style={{ textAlign: 'left' }}
                    description={
                      !loading && (
                        <Row>
                          {survey.userHasVoted && (
                            <Col>
                              <Tag color='success'>Respondida</Tag>
                            </Col>
                          )}
                          {survey.isOpened && (
                            <Col>
                              {' '}
                              {survey.isOpened == 'true' || survey.isOpened == true ? (
                                <Tag color='green'>Abierta</Tag>
                              ) : (
                                <Tag color='red'>Cerrada</Tag>
                              )}
                            </Col>
                          )}
                        </Row>
                      )
                    }
                  />
                  {loading ? (
                    <Spin />
                  ) : (
                    <>
                      <div>
                        <Button
                          type={!survey.userHasVoted && survey.isOpened === 'true' ? 'primary' : 'ghost'}
                          className={`${
                            !survey.userHasVoted && survey.isOpened === 'true'
                              ? 'animate__animated  animate__pulse animate__slower animate__infinite'
                              : ''
                          }`}
                          onClick={() => this.handleClick(survey)}
                          loading={loading}>
                          {!survey.userHasVoted && survey.isOpened === 'true'
                            ? `Ir a ${
                                surveyLabel.name
                                  ? surveyLabel.name.replace(/([^aeiou]{2})?(e)?s\b/gi, this.pluralToSingular)
                                  : 'Encuesta'
                              }`
                            : ' Ver Resultados'}
                        </Button>
                      </div>
                    </>
                  )}
                </List.Item>
              )}
            />
          )}
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  event: state.event.data,
  activity: state.stage.data.currentActivity,
  currentUser: state.user.data,
});

const mapDispatchToProps = {
  setMainStage,
  setCurrentSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
