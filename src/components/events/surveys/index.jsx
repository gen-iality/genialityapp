import { Component } from 'react';
import { connect } from 'react-redux';
import { Actions, TicketsApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';
import SurveyList from './surveyList';
import SurveyDetailPage from './SurveyDetailPage';
import { Card } from 'antd';
import * as SurveyActions from '../../../redux/survey/actions';
import withContext from '../../../context/withContext';
import { GetTokenUserFirebase } from '@helpers/HelperAuth';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

class SurveyForm extends Component {
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
        name: 'Evaluaciones',
        section: 'survey',
        icon: 'FileUnknownOutlined',
        checked: false,
        permissions: 'public',
      },

      // luego de cargar el componente este estado permanece escuchando todas las encuestas del curso
      eventSurveys: [], // Todas las encuestas de un curso, este estado va a estar escuchando
      anonymousSurveys: [], // Solo encuestas que permiten usuarios anónimos
      publishedSurveys: [], // Encuestas relacionadas con la lección + globales para renderizar el listado de encuestas en componente de videoconferencia
    };
  }

  async componentDidMount() {
    // Método para escuchar todas las encuestas relacionadas con el curso
    await this.listenSurveysData();

    let eventUser = await this.getCurrentEvenUser(this.props.cEvent.value._id);

    this.setState({ eventUser: eventUser });
    // this.userVote();
    this.getItemsMenu();
  }

  listenSurveysData = async () => {
    const { activity } = this.props;

    //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
    let $query = firestore.collection('surveys');

    //Le agregamos el filtro por curso
    if (this.props.cEvent.value && this.props.cEvent.value._id) {
      $query = $query.where('eventId', '==', this.props.cEvent.value._id);
    }

    $query.onSnapshot(async (surveySnapShot) => {
      // Almacena el Snapshot de todas las encuestas del curso

      const eventSurveys = [];
      let publishedSurveys = [];

      if (surveySnapShot.size === 0) {
        this.setState({
          selectedSurvey: {},
          surveyVisible: false,
          publishedSurveys: [],
        });
        return;
      }

      surveySnapShot.forEach(function(doc) {
        eventSurveys.push({ ...doc.data(), _id: doc.id });
      });

      // Listado de encuestas publicadas del curso
      publishedSurveys = eventSurveys.filter(
        (survey) =>
          (survey.isPublished === 'true' || survey.isPublished === true) &&
          ((activity && survey.activity_id === activity._id) || survey.isGlobal === 'true')
      );

      this.setState(
        {
          publishedSurveys,
          surveyVisible: publishedSurveys && publishedSurveys.length,
          loading: true,
        },
        this.callback
      );
    });
  };

  surveyVisible = () => {
    // if (this.state.publishedSurveys.length === 1 && !this.state.surveyVisible) {
    //   this.toggleSurvey(this.state.publishedSurveys[0]);
    // }

    this.setState({
      surveyVisible: !this.state.surveyVisible,
    });
  };

  async componentDidUpdate(prevProps, prevState) {
    //this.listenSurveysData(prevProps);

    //Método que permite al componente conectar con un componente superior y subir el estado  de la encuesta actual seleccionada
    /* if (prevState.selectedSurvey !== this.state.selectedSurvey) {
      this.props.mountCurrentSurvey(this.state.selectedSurvey);
    } */

    //No es la manera ideal pero aqui forzamos una revisión en la base de datos para asber si el usuario ya voto
    //mejor tener esto en forma de contexto o algo similar
    if (prevState.forceCheckVoted !== this.state.forceCheckVoted && this.state.forceCheckVoted === true) {
      await this.callback();
    }
  }

  queryMyResponses = async (survey) => {
    //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
    let counterDocuments = 0;
    return new Promise((resolve) => {
      firestore
        .collectionGroup('responses')
        .where('id_survey', '==', survey._id)
        .where('id_user', '==', this.props.cUser.value._id)
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

    const checkMyResponses = new Promise((resolve) => {
      let filteredSurveys = [];

      publishedSurveys.forEach(async (survey, index, arr) => {
        if (this.props.cUser.value._id) {
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

    this.setState({
      publishedSurveys: stateSurveys,
      forceCheckVoted: false,
      loading: false,
    });
  };

  userVote = () => {
    const { surveysData } = this.state;
    for (const i in surveysData) {
      if (surveysData[i].userHasVoted === true) {
        this.setState({ userVote: true });
      } else if (surveysData[i].open === false) {
        this.setState({ userVote: true });
      }
    }
  };

  getCurrentEvenUser = async (eventId) => {
    let evius_token = await GetTokenUserFirebase();
    if (!evius_token) return null;
    let response = await TicketsApi.getByEvent(this.props.cEvent.value._id, evius_token);
    return response && response.data.length ? response.data[0] : null;
  };

  getItemsMenu = async () => {
    let { defaultSurveyLabel } = this.state;
    const response = await Actions.getAll(`/api/events/${this.props.cEvent.value._id}`);
    let surveyLabel = response.itemsMenu.survey || defaultSurveyLabel;
    this.setState({ surveyLabel });
  };

  // Funcion para cambiar entre los componentes 'ListSurveys y SurveyComponent'
  // eslint-disable-next-line no-unused-vars
  toggleSurvey = async (data, reload) => {
    this.setState({ selectedSurvey: data, surveyVisible: true });
    if (typeof data === 'boolean' || data === undefined) {
      this.setState({
        selectedSurvey: {},
        forceCheckVoted: true,
        loading: true,
      });
      // if (data === true) this.listenSurveysData();
    } else if (Object.prototype.hasOwnProperty.call(data, '_id')) {
      let selectedSurvey = data;
      this.setState({ selectedSurvey });
    }
  };

  pluralToSingular = (char) => {
    char = char.trim();
    return `(${char}) `;
  };

  componentWillUnmount = () => {
    const { setCurrentSurvey, setSurveyVisible } = this.props;
    setCurrentSurvey(null);
    setSurveyVisible(false);
  };

  render() {
    const { eventUser, surveyLabel } = this.state;
    const { currentUser } = this.props;

    if (this.props.currentSurvey !== null)
      return (
        this.props.surveyVisible !== false && (
          <SurveyDetailPage
          //selectedSurvey={selectedSurvey} // -> modificado en rootpage por currentsurvey
          //userHasVoted={selectedSurvey.userHasVoted} // -> modificado en rootpage por currentsurvey
          //idSurvey={selectedSurvey._id}
          //toggleSurvey={this.toggleSurvey}
          //eventId={event._id}
          //currentUser={currentUser}
          //eventUser={eventUser}
          //openSurvey={selectedSurvey.isOpened}
          //surveyLabel={surveyLabel}
          //Metodo que permite reasignar el estado (currentSurvey) del componente superior al desmontar el componente SurveyComponent
          />
        )
      );

    //if (!publishedSurveys) return <Loading />;

    return (
      <div>
        {/* {this.state.availableSurveysBar && publishedSurveys && publishedSurveys.length > 0 && (
          <Button
            className={` ${
              publishedSurveys && !surveyVisible && !userVote && publishedSurveys.length > 0 ? 'parpadea' : ''
            }`}
            onClick={this.surveyVisible}>
            {!userVote ? (
              publishedSurveys.length > 0 && (
                <span>
                  {!surveyVisible ? 'Ver' : 'Ocultar'}{' '}
                  <b style={surveyButtons.text}>&nbsp;{publishedSurveys && publishedSurveys.length}&nbsp;</b>
                  {surveyLabel.name && surveyLabel.name.replace(/((e)?s)$|(e)?s\s/gi, this.pluralToSingular)}
                  disponible(s).
                </span>
              )
            ) : (
              <span>{!surveyVisible ? 'Ver' : 'Ocultar'} Resultados</span>
            )}
          </Button>
        )} */}

        <Card>
          <SurveyList
            //jsonData={publishedSurveys}
            currentUser={currentUser}
            eventUser={eventUser}
            showSurvey={this.toggleSurvey}
            surveyLabel={surveyLabel}
            forceCheckVoted={this.state.forceCheckVoted}
            loading={this.state.loading}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentSurvey: state.survey.data.currentSurvey,
  surveyVisible: state.survey.data.surveyVisible,
});

const mapDispatchToProps = {
  setCurrentSurvey,
  setSurveyVisible,
};

let SurveyFormWithContext = withContext(SurveyForm);
export default connect(mapStateToProps, mapDispatchToProps)(SurveyFormWithContext);
