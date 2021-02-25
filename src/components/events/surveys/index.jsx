import React, { Component } from 'react';
import * as Cookie from 'js-cookie';
import { Actions, TicketsApi } from '../../../helpers/request';
import { firestore } from '../../../helpers/firebase';
import SurveyList from './surveyList';
import RootPage from './rootPage';
import { Spin, Button, Card } from 'antd';
import Loading from './loading';

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

  // eslint-disable-next-line no-unused-vars
  openSurvey = (currentSurvey) => {
    // eslint-disable-next-line no-console
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
    if (this.props.usuarioRegistrado !== prevProps.usuarioRegistrado) {
      this.setState({ usuarioRegistrado: this.props.usuarioRegistrado });
    }

    //Método que permite al componente conectar con un componente superior y subir el estado  de la encuesta actual seleccionada
    if (prevState.selectedSurvey !== this.state.selectedSurvey) {
      this.props.mountCurrentSurvey(this.state.selectedSurvey);
    }

    //No es la manera ideal pero aqui forzamos una revisión en la base de datos para asber si el usuario ya voto
    //mejor tener esto en forma de contexto o algo similar
    if (prevState.forceCheckVoted !== this.state.forceCheckVoted && this.state.forceCheckVoted === true) {
      await this.callback();
    }
  }

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
  toggleSurvey = async (data, reload) => {
    this.setState({ selectedSurvey: data, surveyVisible: true });
    if (typeof data === 'boolean' || data === undefined) {
      this.setState({ selectedSurvey: {}, forceCheckVoted: true, loading: true });
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
  render() {
    const { selectedSurvey, publishedSurveys, eventUser, userVote, surveyVisible, surveyLabel } = this.state;
    const { event, currentUser } = this.props;

    if (Object.prototype.hasOwnProperty.call(selectedSurvey, '_id'))
      return (
        surveyVisible != false && (
          <RootPage
            //selectedSurvey={selectedSurvey} // -> modificado en rootpage por currentsurvey
            //userHasVoted={selectedSurvey.userHasVoted} // -> modificado en rootpage por currentsurvey
            //idSurvey={selectedSurvey._id}
            toggleSurvey={this.toggleSurvey}
            //eventId={event._id}
            //currentUser={currentUser}
            //eventUser={eventUser}
            openSurvey={selectedSurvey.isOpened}
            surveyLabel={surveyLabel}
            //Metodo que permite reasignar el estado (currentSurvey) del componente superior al desmontar el componente SurveyComponent
          />
        )
      );

    if (!publishedSurveys) return <Loading />;

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
            jsonData={publishedSurveys}
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

export default SurveyForm;
