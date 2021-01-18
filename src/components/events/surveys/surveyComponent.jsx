import React, { Component } from 'react';
import Moment from 'moment';
import { Result, Button } from 'antd';
import { FrownOutlined, SmileOutlined, MehOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import * as Cookie from 'js-cookie';
import { SurveysApi, TicketsApi } from '../../../helpers/request';
import { firestore } from '../../../helpers/firebase';
import { SurveyAnswers, SurveyPage, UserGamification, Trivia } from './services';
import Graphics from './graphics';
import * as Survey from 'survey-react';
import 'survey-react/modern.css';
import { cosh } from 'core-js/fn/math';
Survey.StylesManager.applyTheme('modern');

const MIN_ANSWER_FEEDBACK_TIME = 5;
const surveyStyle = {
  overFlowX: 'hidden',
  overFlowY: 'scroll',
};

class SurveyComponent extends Component {
  constructor(props) {
    super(props);
    this.survey = null;

    this.state = {
      surveyData: {},
      rankingList: [],
      sentSurveyAnswers: false,
      feedbackMessage: {},
      totalPoints: 0,
      eventUsers: [],
      voteWeight: 0,
      freezeGame: false,
      showMessageOnComplete: false,
      currentPage: null,
      surveyRealTime: null,
      timerPausa: null,
      survey: null,
      rankingPoints: 0,
      fiftyfitfyused: false,
    };
  }

  async componentDidMount() {
    var self = this;
    const { eventId, idSurvey } = this.props;
    let surveyData = await this.loadSurvey(eventId, idSurvey);
    let survey = new Survey.Model(surveyData);
    await this.listenAndUpdateStateSurveyRealTime(idSurvey);

    /* El render se produce antes que se cargue toda la info para que funcione bien tenemos q
    que renderizar condicionalmente el compontente de la encuesta solo cuando  surveyRealTime y survey esten cargados 
    sino se presentar comportamientos raros.
    */
    self.setState({ surveyData, idSurvey, survey });
    self.survey = survey;

    // Esto permite obtener datos para la grafica de gamificacion
    UserGamification.getListPoints(eventId, this.getRankingList);

    await this.getCurrentEvenUser();
  }

  /**
   * El quiztiene unos timers para controlar el tiempo por pregunta
   * aqui detenemos los timers o el quiz sigue avanzando y dana la lÃƒÆ’Ã‚Â³gica cambiando
   * la pregunta en la que deberian ir todos
   */
  componentWillUnmount() {
    if (this.state.survey) {
      this.state.survey.stopTimer();
    }

    if (this.state.timerPausa) {
      clearInterval(this.state.timerPausa);
    }
  }

  getRankingList = (list) => {
    this.setState({ rankingList: list });
  };

  getCurrentEvenUser = async () => {
    let evius_token = Cookie.get('evius_token');
    let eventUsers = [];
    let vote = 1;
    if (evius_token) {
      let response = await TicketsApi.getByEvent(this.props.eventId, evius_token);

      if (response.data.length > 0) {
        vote = 0;
        eventUsers = response.data;
        response.data.forEach((item) => {
          if (item.properties.pesovoto) vote += parseFloat(item.properties.pesovoto);
        });
      }
    }
    this.setState({ eventUsers: eventUsers, voteWeight: vote });
  };

  listenAndUpdateStateSurveyRealTime = async (idSurvey) => {
    var self = this;
    const { eventId, currentUser } = this.props;
    let currentPageNo = 0;

    const promiseA = new Promise((resolve, reject) => {
      try {
        firestore
          .collection('surveys')
          .doc(idSurvey)
          .onSnapshot(async (doc) => {
            let surveyRealTime = doc.data();

            //revisando si estamos retomando la encuesta en alguna página particular
            if (currentUser && currentUser._id) {
              currentPageNo = await SurveyPage.getCurrentPage(idSurvey, currentUser._id);
              surveyRealTime.currentPage = currentPageNo ? currentPageNo : 0;
            }

            self.setState({
              surveyRealTime,
              freezeGame: surveyRealTime.freezeGame,
              currentPage: surveyRealTime.currentPage,
            });
            resolve(surveyRealTime);
          });
      } catch (e) {
        reject(e);
      }
    });

    return promiseA;
  };
  // Funcion para cargar datos de la encuesta seleccionada
  loadSurvey = async (eventId, idSurvey) => {
    let { surveyData } = this.state;

    // Esto permite que el json pueda asignar el id a cada pregunta
    Survey.JsonObject.metaData.addProperty('question', 'id');
    Survey.JsonObject.metaData.addProperty('question', 'points');

    let dataSurvey = await SurveysApi.getOne(eventId, idSurvey);

    // Se crea una propiedad para paginar las preguntas
    dataSurvey.pages = [];
    // Se igual title al valor de survey
    dataSurvey.title = dataSurvey.survey;
    // Se muestra una barra de progreso en la parte superior
    dataSurvey.showProgressBar = 'bottom';
    // Esto permite que se envie los datos al pasar cada pagina con el evento onPartialSend
    dataSurvey.sendResultOnPageNext = true;
    // Esto permite ocultar el boton de devolver en la encuesta
    dataSurvey.showPrevButton = false;
    // Asigna textos al completar encuesta y al ver la encuesta vacia
    dataSurvey.completedHtml = 'Gracias por completar la encuesta!';
    //dataSurvey.questionsOnPageMode = 'singlePage';
    if (dataSurvey.allow_gradable_survey === 'true' && dataSurvey.initialMessage) {
      // Permite mostrar el contador y asigna el tiempo limite de la encuesta y por pagina
      dataSurvey.showTimerPanel = 'top';

      // Temporalmente quemado el tiempo por pregunta. El valor es en segundos
      dataSurvey.maxTimeToFinishPage = dataSurvey.time_limit ? dataSurvey.time_limit : 10;

      // Permite usar la primera pagina como introduccion
      dataSurvey.firstPageIsStarted = true;
      dataSurvey.startSurveyText = 'Iniciar Cuestionario';
      let textMessage = dataSurvey.initialMessage;
      dataSurvey['questions'].unshift({
        type: 'html',
        html: `<div style='width: 90%; margin: 0 auto;'>${textMessage}</div>`,
      });
    }

    if (dataSurvey['questions'] === undefined) return;

    // El {page, ...rest} es temporal
    // Debido a que se puede setear la pagina de la pregunta si la pregunta tiene la propiedad 'page'

    // Aqui se itera cada pregunta y se asigna a una pagina

    // eslint-disable-next-line no-unused-vars
    dataSurvey['questions'].forEach(({ page, ...rest }, index) => {
      dataSurvey.pages[index] = {
        name: `page${index + 1}`,
        key: `page${index + 1}`,
        questions: [{ ...rest, isRequired: dataSurvey.allow_gradable_survey === 'true' ? false : true }],
      };
    });

    // Se excluyen las propiedades
    // eslint-disable-next-line no-unused-vars
    const exclude = ({ survey, id, questions, ...rest }) => rest;

    surveyData = exclude(dataSurvey);
    return surveyData;
  };

  // Funcion que ejecuta el servicio para registar votos ------------------------------------------------------------------
  executePartialService = (surveyData, question, infoUser) => {
    let { eventUsers, voteWeight } = this.state;

    return new Promise((resolve, reject) => {
      // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
      let optionIndex = [];
      let optionQuantity = 0;
      let correctAnswer = false;

      // Asigna puntos si la encuesta tiene
      let surveyPoints = question.points ? parseInt(question.points) : 1;
      let rankingPoints = 0;

      //Hack rÃƒÆ’Ã‚Â¡pido para permitir preguntas tipo texto (abiertas)
      // eslint-disable-next-line no-empty
      if (question.inputType === 'text') {
      } else {
        // se valida si question value posee un arreglo 'Respuesta de opcion multiple' o un texto 'Respuesta de opcion unica'
        if (typeof question.value === 'object') {
          correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

          if (correctAnswer) rankingPoints += surveyPoints;
          question.value.forEach((value) => {
            optionIndex = [...optionIndex, question.choices.findIndex((item) => item.itemValue === value)];
          });
        } else {
          // Funcion que retorna si la opcion escogida es la respuesta correcta
          correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

          if (correctAnswer) rankingPoints += surveyPoints;
          // Busca el index de la opcion escogida
          optionIndex = question.choices.findIndex((item) => item.itemValue === question.value);
        }
        optionQuantity = question.choices.length;
      }

      let infoOptionQuestion =
        surveyData.allow_gradable_survey === 'true'
          ? { optionQuantity, optionIndex, correctAnswer }
          : { optionQuantity, optionIndex };

      // Se envia al servicio el id de la encuesta, de la pregunta y los datos
      // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
      if (infoUser) {
        SurveyAnswers.registerWithUID(
          surveyData._id,
          question.id,
          {
            responseData: question.value,
            date: new Date(),
            uid: infoUser._id,
            email: infoUser.email,
            names: infoUser.names || infoUser.displayName,
            voteValue: surveyData.allow_vote_value_per_user === 'true' && eventUsers.length > 0 && voteWeight,
          },
          infoOptionQuestion
        )
          .then((result) => {
            resolve({ responseMessage: result, rankingPoints });
          })
          .catch((err) => {
            reject({ responseMessage: err });
          });
      } else {
        // Sirve para controlar si un usuario anonimo ha votado
        localStorage.setItem(`userHasVoted_${surveyData._id}`, true);

        SurveyAnswers.registerLikeGuest(
          surveyData._id,
          question.id,
          {
            responseData: question.value || '',
            date: new Date(),
            uid: 'guest',
          },
          infoOptionQuestion
        )
          .then((result) => {
            resolve({ responseMessage: result, rankingPoints });
          })
          .catch((err) => {
            reject({ responseMessage: err });
          });
      }
    });
  };

  // Funcion que muestra el feedback dependiendo del estado
  showStateMessage = (state, questionPoints) => {
    const objMessage = {
      title: '',
      subTitle: '',
      status: state,
    };

    switch (state) {
      case 'success':
        return {
          ...objMessage,
          title: (
            <div>
              Has ganado <span style={{ fontWeight: 'bold', fontSize: '130%' }}>{questionPoints} punto(s)</span>,
              respondiendo correctamente la pregunta.
            </div>
          ),
          subTitle: '',
          icon: <SmileOutlined />,
        };

      case 'error':
        return {
          ...objMessage,
          title: <div>Debido a que no respondiste correctamente no has ganado puntos.</div>,
          subTitle: '',
          icon: <FrownOutlined />,
        };

      case 'warning':
        return {
          ...objMessage,
          title: 'No has escogido ninguna opción',
          subTitle: `No has ganado ningun punto debido a que no marcaste ninguna opción.`,
          icon: <MehOutlined />,
        };

      case 'info':
        return {
          ...objMessage,
          title: 'Estamos en una pausa',
          subTitle: `El juego se encuentra en pausa. Espera hasta el moderador reanude el juego`,
          icon: <MehOutlined />,
        };

      default:
        return { type: state };
    }
  };

  onSurveyCompleted = (values) => {
    this.sendData(values);
  };

  /*
    surveyData: (Object) Informacio general de la encuesta
    retornamos null para para detener el hilo de ejecución del método
    */
  // Funcion para enviar la informacion de las respuestas ------------------------------------------------------------------
  sendData = async (surveyModel) => {
    const { eventId, currentUser } = this.props;
    let { surveyData } = this.state;

    let rankingPointsThisPage;
    await Promise.all(
      surveyModel.currentPage.questions.map(async (question) => {
        let { rankingPoints } = await this.executePartialService(surveyData, question, currentUser);

        if (rankingPoints)
          rankingPointsThisPage = rankingPointsThisPage ? rankingPointsThisPage + rankingPoints : rankingPoints;
        this.registerRankingPoints(rankingPoints, surveyModel, surveyData, currentUser, eventId);
        return rankingPoints;
      })
    );

    //Actualizamos la página actúal, sobretodo por si se cae la conexión regresar a la última pregunta
    SurveyPage.setCurrentPage(surveyData._id, currentUser._id, surveyModel.currentPageNo);

    let isLastPage = surveyModel.isLastPage;

    if (surveyData.allow_gradable_survey === 'true') {
      if (isLastPage) {
        this.setState((prevState) => ({ showMessageOnComplete: false }));
      } else {
        this.setState({ rankingPoints: rankingPointsThisPage });
      }
    }

    // Permite asignar un estado para que actualice la lista de las encuestas si el usuario respondio la encuesta
    if (this.props.showListSurvey) this.setState({ sentSurveyAnswers: true });
  };

  registerRankingPoints = (rankingPoints, surveyModel, surveyData, currentUser, eventId) => {
    if (rankingPoints == undefined || rankingPoints == 0) return;
    if (surveyData.allow_gradable_survey !== 'true') return;

    //para guardar el score en el ranking
    let { totalPoints } = this.state;
    totalPoints += rankingPoints;
    this.setState({ totalPoints });

    // Ejecuta serivicio para registrar puntos
    UserGamification.registerPoints(eventId, {
      user_id: currentUser._id,
      user_name: currentUser.names,
      user_email: currentUser.email,
      points: rankingPoints,
    });

    Trivia.setTriviaRanking(surveyData._id, currentUser, totalPoints, surveyModel.getAllQuestions().length - 1);
    // message.success({ content: responseMessage });
  };

  /* handler cuando la encuesta cambio de pregunta */
  onCurrentPageChanged = (sender, options) => {
    if (!options.oldCurrentPage) return;
    let secondsToGo = sender.maxTimeToFinishPage - options.oldCurrentPage.timeSpent;

    //if (secondsToGo > 0) sender.stopTimer();
    sender.stopTimer();
    this.setIntervalToWaitBeforeNextPage(sender, secondsToGo);
  };

  setIntervalToWaitBeforeNextPage(survey, secondsToGo) {
    secondsToGo = secondsToGo ? secondsToGo : 0;
    secondsToGo += MIN_ANSWER_FEEDBACK_TIME;

    const timer = setInterval(() => {
      secondsToGo -= 1;
      let { rankingPoints } = this.state;
      rankingPoints = !rankingPoints ? 0 : rankingPoints;
      let typeMessage = rankingPoints > 0 ? 'success' : 'error';
      let mensaje = this.showStateMessage(typeMessage, rankingPoints);
      let mensaje_espera = `${mensaje.subTitle} Espera el tiempo indicado para seguir con el cuestionario.`;
      let mensaje_congelado = `El juego se encuentra en pausa. Espera hasta que el moderador  reanude el juego`;
      mensaje.subTitle = secondsToGo > 0 ? mensaje_espera + ' ' + secondsToGo : mensaje_congelado;
      this.setState({ feedbackMessage: mensaje });

      if (secondsToGo <= 0 && !this.state.freezeGame) {
        clearInterval(timer);
        this.setState({ feedbackMessage: {}, showMessageOnComplete: false });
        survey.startTimer();
      }
    }, 1000);

    this.setState({ timerPausa: timer });
  }

  useFiftyFifty = () => {
    let question = this.state.survey.currentPage.questions[0];

    if (!(question.correctAnswer && question.choices && question.choices.length > 2)) {
      alert('Menos de dos opciones no podemos borrar alguna');
      return;
    }
    let choices = question.choices;
    //Determinamos la cantidad de opciones a borrar (la mitad de las opciones)
    let cuantasParaBorrar = Math.floor(choices.length / 2);

    choices = choices.filter((choice) => {
      let noBorrar = question.correctAnswer === choice.value || cuantasParaBorrar-- <= 0;
      return noBorrar;
    });
    question.choices = choices;
    this.setState({ fiftyfitfyused: true });
    alert('has usado la ayuda  del 50/50');
  };

  // Funcion que se ejecuta antes del evento onComplete y que muestra un texto con los puntos conseguidos
  // eslint-disable-next-line no-unused-vars
  setFinalMessage = (survey, options) => {
    let { surveyData, totalPoints } = this.state;

    // NÃºmero total de preguntas, se resta uno porque la primer pÃ¡gina es informativa
    let totalQuestions = surveyData.pages.length - 1;

    // Umbral de exito, esta variable indica apartir de cuantos aciertos se completa con Ã©xito el cuestionario
    // Por el momento el valor esta quemado y deberÃ­a venir de un parÃ¡metro del CMS
    let scoreMinimumForWin = 10;

    let textOnCompleted = survey.completedHtml;

    survey.currentPage.questions.forEach((question) => {
      let correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;
      if (correctAnswer) totalPoints += parseInt(question.points);
    });

    if (surveyData.allow_gradable_survey === 'true') {
      let text = `Has obtenido ${totalPoints} de ${totalQuestions} puntos </br>`;
      text +=
        totalPoints >= scoreMinimumForWin
          ? `${surveyData.win_Message ? surveyData.win_Message : ''}`
          : `${surveyData.lose_Message ? surveyData.lose_Message : ''}`;

      survey.completedHtml = `${textOnCompleted}<br>${text}<br>${
        surveyData.neutral_Message ? surveyData.neutral_Message : ''
      }`;
    }
  };

  // Funcion que cambia el mensaje por defecto para el contador
  setCounterMessage = (survey, options) => {
    // Aqui se obtiene el tiempo limite de la encuesta
    // let countDown = Moment.utc((survey.maxTimeToFinish - survey.timeSpent) * 1000).format("mm:ss");
    // let timeTotal = Moment.utc(survey.maxTimeToFinish * 1000).format("mm:ss");

    // Aqui se obtiene el tiempo limite por pregunta
    let countDown = Moment.utc((survey.maxTimeToFinishPage - survey.currentPage.timeSpent) * 1000).format('mm:ss');
    let timeTotal = Moment.utc(survey.maxTimeToFinishPage * 1000).format('mm:ss');

    options.text = `Tienes ${timeTotal} para responder la pregunta. Quedan ${countDown}`;
  };

  checkCurrentPage = (survey) => {
    let { currentPage, surveyData } = this.state;

    // Este condicional sirve para retomar la encuesta donde vayan todos los demas usuarios
    if (surveyData.allow_gradable_survey === 'true') {
      //if (currentPage !== 0) survey.currentPageNo = currentPage;

      if (this.state.freezeGame) {
        survey.stopTimer();
        let result = this.showStateMessage('info');
        this.setIntervalToWaitBeforeNextQuestion(survey, result, 0);
      }
    }
  };

  render() {
    let { surveyData, sentSurveyAnswers, feedbackMessage, showMessageOnComplete, eventUsers } = this.state;

    const { showListSurvey, surveyLabel, eventId, operation } = this.props;

    if (!surveyData) return 'Cargando...';
    return (
      <div style={surveyStyle}>
        {this.state.survey && (
          <div style={{ marginTop: 5 }}>
            <Button ghost shape='round' onClick={() => showListSurvey(sentSurveyAnswers)}>
              <ArrowLeftOutlined /> Volver a {surveyLabel ? surveyLabel.name : 'encuestas'}
            </Button>
          </div>
        )}
        {surveyData &&
          surveyData.allow_gradable_survey === 'true' &&
          (surveyData.show_horizontal_bar ? (
            <>
              {/* < GraphicGamification data={this.state.rankingList} eventId={eventId} showListSurvey={showListSurvey}/> */}
              {
                // this.state.survey && this.state.survey.state === "completed" && <Graphics idSurvey={this.props.idSurvey} eventId={eventId} surveyLabel={surveyLabel} showListSurvey={showListSurvey} />
              }
            </>
          ) : (
            <>
              {
                // this.state.survey && this.state.survey.state === "completed" && <Graphics idSurvey={this.props.idSurvey} eventId={eventId} surveyLabel={surveyLabel} showListSurvey={showListSurvey} />
              }
            </>
          ))}

        {this.state.survey && this.state.survey.state === 'completed' && (
          <>
            {surveyData && surveyData.allow_gradable_survey !== 'true' ? (
              <Graphics
                idSurvey={this.props.idSurvey}
                eventId={eventId}
                surveyLabel={surveyLabel}
                showListSurvey={showListSurvey}
                operation={operation}
              />
            ) : (
              <></>
            )}
          </>
        )}
        {feedbackMessage.hasOwnProperty('title') && (
          <Result className='animate__animated animate__rubberBand' {...feedbackMessage} extra={null} />
        )}

        {//Se realiza la validacion si la variable allow_anonymous_answers es verdadera para responder la encuesta
        surveyData && (surveyData.allow_anonymous_answers === 'true' || surveyData.publish === 'true') ? (
          <div style={{ display: feedbackMessage.hasOwnProperty('title') || showMessageOnComplete ? 'none' : 'block' }}>
            {this.state.survey && (
              <div className='animate__animated animate__bounceInDown'>
                {surveyData.allow_gradable_survey === 'true' && !this.state.fiftyfitfyused && (
                  <div onClick={this.useFiftyFifty}>50/50</div>
                )}
                <Survey.Survey
                  model={this.state.survey}
                  onComplete={(surveyModel) => this.sendData(surveyModel, 'completed')}
                  onPartialSend={(surveyModel) => this.sendData(surveyModel, 'partial')}
                  onCompleting={this.setFinalMessage}
                  onTimerPanelInfoText={this.setCounterMessage}
                  onStarted={this.checkCurrentPage}
                  onCurrentPageChanged={this.onCurrentPageChanged}
                />
              </div>
            )}
          </div>
        ) : (
          //Si no es verdadera la variable anterior,
          //entonces validarÃ¡ si el ticket del usuario existe para despues validar la variable allowed_to_vote en verdadero
          //para poder responder la encuesta
          eventUsers.map((eventUser) => {
            return (
              eventUser.ticket &&
              eventUser.ticket.allowed_to_vote === 'true' && (
                <div
                  style={{
                    display: feedbackMessage.hasOwnProperty('title') || showMessageOnComplete ? 'none' : 'block',
                  }}>
                  {this.state.survey && (
                    <Survey.Survey
                      model={this.state.survey}
                      onComplete={this.onSurveyCompleted}
                      onPartialSend={this.sendData}
                      onCompleting={this.setFinalMessage}
                      onTimerPanelInfoText={this.setCounterMessage}
                      onStarted={this.checkCurrentPage}
                      onCurrentPageChanged={this.onCurrentPageChanged}
                    />
                  )}
                </div>
              )
            );
          })
        )}
      </div>
    );
  }
}

export default SurveyComponent;
