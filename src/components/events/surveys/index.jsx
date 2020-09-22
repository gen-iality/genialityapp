import React, { Component } from "react";
import * as Cookie from "js-cookie";
import { SurveyAnswers } from "./services";
import API, { Actions, SurveysApi,TicketsApi } from "../../../helpers/request";
import { firestore } from "../../../helpers/firebase";
import SurveyList from "./surveyList";
import RootPage from "./rootPage";
import { Spin, Button, Card } from "antd";

const surveyButtons = {
  text: {
    color: "inherit",
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
      surveyLabel: {},
      defaultSurveyLabel: {
        name: "Encuestas",
        section: "survey",
        icon: "FileUnknownOutlined",
        checked: false,
        permissions: "public",
      },
    };
  }

  openSurvey = (currentSurvey) => {
    console.log("Esta es la encuesta actual:", currentSurvey);
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

    let {event} = this.props;
    let user = await this.getCurrentUser();
    let eventUser = await this.getCurrentEvenUser(event._id);

    

    console.log("surveydebug eventUser",eventUser);
    this.setState({ currentUser: user, eventUser:eventUser }, this.listenSurveysData);
    this.userVote();
    this.getItemsMenu();
  }

  componentDidUpdate(prevProps, prevState) {
    this.listenSurveysData(prevProps);
    if (this.props.usuarioRegistrado !== prevProps.usuarioRegistrado) {
      this.setState({ usuarioRegistrado: this.props.usuarioRegistrado });
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
      let $query = firestore.collection("surveys");
      $query = $query.where("isPublished", "==", "true");

      //Le agregamos el filtro por evento
      if (event && event._id) {
        $query = $query.where("eventId", "==", event._id);
      }


      let publishedSurveys = [];
      $query.onSnapshot(async (surveySnapShot) => {

        console.log("surveySnapShot", surveySnapShot, surveySnapShot.size);

        if (surveySnapShot.size === 0) {
          console.log("surveySnapShotINNER");
          this.setState({ selectedSurvey: {}, surveyVisible: false, surveysData: [] });
          return;
        }
        console.log("surveySnapShotFINAL");
        publishedSurveys = [];
        surveySnapShot.forEach(function (doc) {
          publishedSurveys.push({ ...doc.data(), _id: doc.id });
        });

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



        this.setState({ surveysData: surveysData, surveyVisible:surveysData && surveysData.length }, this.seeIfUserHasVote);
      });
    }
  };

  // Funcion que valida si el usuario ha votado en cada una de las encuestas
  seeIfUserHasVote = async () => {
    let { currentUser, surveysData } = this.state;
    const { event } = this.props;

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
    console.log("stateSurveys", stateSurveys);
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
    let evius_token = Cookie.get("evius_token");
    let response = await TicketsApi.getByEvent(eventId, evius_token);
    return (response && response.data.length)?response.data[0]:null;

  };


  // Funcion para consultar la informacion del actual usuario
  getCurrentUser = () => {
    let evius_token = Cookie.get("evius_token");
    return new Promise(async (resolve, reject) => {
      if (!evius_token) {
        resolve(false);
      } else {
        try {
          const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
          if (resp.status === 200) {
            const data = resp.data;
            this.setState({ usuarioRegistrado: true });
            // Solo se desea obtener el id del usuario
            resolve(data);
          }
        } catch (error) {
          const { status } = error.response;
          console.log("STATUS", status, status === 401);
          reject(error.response);
        }
      }
    });
  };

  getItemsMenu = async () => {
    let { defaultSurveyLabel } = this.state;
    const { event } = this.props;
    const response = await Actions.getAll(`/api/events/${event._id}`);

    let surveyLabel = response.itemsMenu.survey || defaultSurveyLabel;
    this.setState({ surveyLabel });
  };

  // Funcion para cambiar entre los componentes 'ListSurveys y SurveyComponent'
  toggleSurvey = (data, reload) => {
    if (typeof data === "boolean" || data === undefined) {
      this.setState({ selectedSurvey: {} });
      if (data === true) this.listenSurveysData();
    } else if (data.hasOwnProperty("_id")) {
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
    let {
      selectedSurvey,
      surveysData,
      currentUser,
      usuarioRegistrado,
      eventUser,
      userVote,
      surveyVisible,
      surveyLabel,
    } = this.state;
    const { event } = this.props;

    if (selectedSurvey.hasOwnProperty("_id"))
      return (
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
      );

    if (!surveysData) return <Spin></Spin>;

    return (
      <div>
        {this.state.availableSurveysBar && (surveysData && surveysData.length > 0) && (
          <Button
            className={` ${surveysData && !surveyVisible && !userVote && surveysData.length > 0 ? "parpadea" : ""}`}
            onClick={this.surveyVisible}>
            {!userVote ? (
              surveysData.length > 0 && (
                <span>
                  {!surveyVisible ? "Ver" : "Ocultar"}{" "}
                  <b style={surveyButtons.text}>&nbsp;{surveysData && surveysData.length}&nbsp;</b>
                  {surveyLabel.name && surveyLabel.name.replace(/((e)?s)$|(e)?s\s/gi, this.pluralToSingular)}
                  disponible(s).
                </span>
              )
            ) : (
                <span>{!surveyVisible ? "Ver" : "Ocultar"} Resultados</span>
              )}
          </Button>
        )}
        {(this.state.surveyVisible || !this.state.availableSurveysBar) && (
          <Card>
            <SurveyList
              jsonData={surveysData}
              usuarioRegistrado={usuarioRegistrado}
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
