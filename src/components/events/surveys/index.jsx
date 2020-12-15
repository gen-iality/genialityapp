import React, { Component } from 'react';
import * as Cookie from 'js-cookie';
import { SurveyAnswers } from './services';
import { Actions, SurveysApi, TicketsApi } from '../../../helpers/request';
import { firestore } from '../../../helpers/firebase';
import SurveyList from './surveyList';
import RootPage from './rootPage';
import { Spin, Button, Card } from 'antd';

const surveyButtons = {
  text: {
    color: 'inherit',
  },
};

// function playFrequency(frequency) {
//   var audioContext = new AudioContext();
//   // create 2 second worth of audio buffer, with single channels and sampling rate of your device.
//   var sampleRate = audioContext.sampleRate;
//   var duration = 0.5 * sampleRate;
//   var numChannels = 1;
//   var buffer = audioContext.createBuffer(numChannels, duration, sampleRate);
//   // fill the channel with the desired frequency's data
//   var channelData = buffer.getChannelData(0);
//   for (var i = 0; i < sampleRate; i++) {
//     channelData[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
//   }

//   // create audio source node.
//   var source = audioContext.createBufferSource();
//   source.buffer = buffer;
//   source.connect(audioContext.destination);

//   // finally start to play
//   source.start(0);
// }

class SurveyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey: {},
      surveysData: undefined,
      currentUser: null,
      loading: true,
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
      //Contador encuestas calificables
      counterQuestions: 0,
      counterOkAnswers: 0,
      scoreMinimumForWin: 10,
    };
  }

  openSurvey = (currentSurvey) => {
    // eslint-disable-next-line no-console
    console.log('Esta es la encuesta actual:', currentSurvey);
  };

  surveyVisible = () => {
    // if (this.state.surveysData.length === 1 && !this.state.surveyVisible) {
    //   this.toggleSurvey(this.state.surveysData[0]);
    // }

    this.setState({
      surveyVisible: !this.state.surveyVisible,
    });
  };

  async componentDidMount() {
    let { event, currentUser } = this.props;
    let eventUser = await this.getCurrentEvenUser(event._id);

    this.setState({ currentUser: currentUser, eventUser: eventUser }, this.listenSurveysData);
    this.userVote();
    this.getItemsMenu();
  }

  async componentDidUpdate(prevProps) {
    this.listenSurveysData(prevProps);
    if (this.props.usuarioRegistrado !== prevProps.usuarioRegistrado) {
      this.setState({ usuarioRegistrado: this.props.usuarioRegistrado });
    }

    //No es la manera ideal pero aqui forzamos una revisión en la base de datos para asber si el usuario ya voto
    //mejor tener esto en forma de contexto o algo similar
    if (this.state.forceCheckVoted) {
      await this.seeIfUserHasVote();
      this.setState({ forceCheckVoted: false });
    }
  }

  /**
   * Desde firebase monitorea si hubo algún cambio y consulta la nueva
   * información desde la base de datos principal
   */

  listenSurveysData = async (prevProps) => {
    const { event, activity } = this.props;
    if (!prevProps || event !== prevProps.event || activity !== prevProps.activity) {
      //Agregamos un listener a firestore para detectar cuando cambia alguna propiedad de las encuestas
      let $query = firestore.collection('surveys');
      $query = $query.where('isPublished', '==', 'true');

      //Le agregamos el filtro por evento
      if (event && event._id) {
        $query = $query.where('eventId', '==', event._id);
      }

      let publishedSurveys = [];
      $query.onSnapshot(async (surveySnapShot) => {
        //console.log("surveySnapShot", surveySnapShot, surveySnapShot.size);

        if (surveySnapShot.size === 0) {
          this.setState({ selectedSurvey: {}, surveyVisible: false, surveysData: [] });
          return;
        }
        publishedSurveys = [];
        surveySnapShot.forEach(function(doc) {
          publishedSurveys.push({ ...doc.data(), _id: doc.id });
        });

        //Filtramos las encuestas que  pueden ver los usuarios anónimos
        if (!this.state.currentUser) {
          publishedSurveys = publishedSurveys.filter((item) => item.allow_anonymous_answers !== 'false');
        }

        let publishedSurveysIds = publishedSurveys.map((item) => item._id);

        let surveysData = await SurveysApi.getAll(event._id);
        surveysData = surveysData.data;

        //Filtramos si la encuesta esta relacionada a una actividad y estamos en esa actividad
        if (activity && activity._id) {
          surveysData = surveysData.filter((item) => item.activity_id === activity._id);
        }

        surveysData = surveysData.filter((item) => publishedSurveysIds.indexOf(item._id) !== -1);
        this.setState({ surveyRecentlyChanged: true });

        if (surveysData && surveysData.length > 0) {
          //playFrequency(500)
        }

        setTimeout(() => {
          this.setState({ surveyRecentlyChanged: false });
        }, 3000);

        this.setState(
          { surveysData: surveysData, surveyVisible: surveysData && surveysData.length },
          this.seeIfUserHasVote
        );
      });
    }
  };

  // Funcion que valida si el usuario ha votado en cada una de las encuestas
  seeIfUserHasVote = async () => {
    let { currentUser, surveysData } = this.state;
    const { event } = this.props;

    // eslint-disable-next-line no-unused-vars
    const votesUserInSurvey = new Promise((resolve, reject) => {
      let surveys = [];

      // Se itera surveysData y se ejecuta el servicio que valida las respuestas
      let userHasVoted = false;
      surveysData.forEach(async (survey, index, arr) => {
        if (currentUser) {
          userHasVoted = await SurveyAnswers.getUserById(event._id, survey, currentUser._id);
          surveys.push({ ...arr[index], userHasVoted });
        } else {
          // Esto solo se ejecuta si no hay algun usuario logeado
          // eslint-disable-next-line no-unused-vars
          const guestUser = new Promise((resolve, reject) => {
            let surveyId = localStorage.getItem(`userHasVoted_${survey._id}`);
            surveyId ? resolve(true) : resolve(false);
          });
          let guestHasVote = await guestUser;
          surveys.push({ ...arr[index], userHasVoted: guestHasVote });
        }

        if (surveys.length === arr.length) resolve(surveys);
      });
    });

    let stateSurveys = await votesUserInSurvey;

    this.setState({ surveysData: stateSurveys });
    // if (stateSurveys.length && stateSurveys.length === 1 && !stateSurveys[0].userHasVoted && this.state.availableSurveysBar) {
    //   this.toggleSurvey(stateSurveys[0]);
    // }

    // bucle que verifica si el usuario contesto las encuestas
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
    let evius_token = Cookie.get('evius_token');
    if (!evius_token) return null;
    let response = await TicketsApi.getByEvent(eventId, evius_token);
    return response && response.data.length ? response.data[0] : null;
  };

  getItemsMenu = async () => {
    let { defaultSurveyLabel } = this.state;
    const { event } = this.props;
    const response = await Actions.getAll(`/api/events/${event._id}`);

    let surveyLabel = response.itemsMenu.survey || defaultSurveyLabel;
    this.setState({ surveyLabel });
  };

  // Funcion para cambiar entre los componentes 'ListSurveys y SurveyComponent'
  // eslint-disable-next-line no-unused-vars
  toggleSurvey = (data, reload) => {
    if (typeof data === 'boolean' || data === undefined) {
      this.setState({ selectedSurvey: {}, forceCheckVoted: true });
      if (data === true) this.listenSurveysData();
    } else if (data.hasOwnProperty('_id')) {
      let { _id, open, userHasVoted, questions } = data;
      let selectedSurvey = { _id, open, userHasVoted, questions };
      this.setState({ selectedSurvey });
    }
  };

  pluralToSingular = (char) => {
    char = char.trim();
    return `(${char}) `;
  };

  render() {
    let { selectedSurvey, surveysData, currentUser, eventUser, userVote, surveyVisible, surveyLabel } = this.state;
    const { event } = this.props;

    if (selectedSurvey.hasOwnProperty('_id'))
      return (
        this.state.surveyVisible != false && (
          <RootPage
            selectedSurvey={selectedSurvey}
            userHasVoted={selectedSurvey.userHasVoted}
            idSurvey={selectedSurvey._id}
            toggleSurvey={this.toggleSurvey}
            eventId={event._id}
            currentUser={currentUser}
            eventUser={eventUser}
            openSurvey={selectedSurvey.open}
            surveyLabel={surveyLabel}
          />
        )
      );

    if (!surveysData) return <Spin></Spin>;

    return (
      <div>
        {this.state.availableSurveysBar && surveysData && surveysData.length > 0 && (
          <Button
            className={` ${surveysData && !surveyVisible && !userVote && surveysData.length > 0 ? 'parpadea' : ''}`}
            onClick={this.surveyVisible}>
            {!userVote ? (
              surveysData.length > 0 && (
                <span>
                  {!surveyVisible ? 'Ver' : 'Ocultar'}{' '}
                  <b style={surveyButtons.text}>&nbsp;{surveysData && surveysData.length}&nbsp;</b>
                  {surveyLabel.name && surveyLabel.name.replace(/((e)?s)$|(e)?s\s/gi, this.pluralToSingular)}
                  disponible(s).
                </span>
              )
            ) : (
              <span>{!surveyVisible ? 'Ver' : 'Ocultar'} Resultados</span>
            )}
          </Button>
        )}
        {(this.state.surveyVisible || !this.state.availableSurveysBar) && (
          <Card>
            <SurveyList
              jsonData={surveysData}
              usuarioRegistrado={currentUser}
              eventUser={eventUser}
              showSurvey={this.toggleSurvey}
              surveyLabel={surveyLabel}
            />
          </Card>
        )}
      </div>
    );
  }
}

export default SurveyForm;
