import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";
import { PageHeader, message, notification, Modal, Result, Button, Spin } from "antd";
import { FrownOutlined, SmileOutlined, MehOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import * as Cookie from "js-cookie";

import graphicsImage from "../../../graficas.png";

import { SurveysApi, AgendaApi, TicketsApi } from "../../../helpers/request";
import { firestore } from "../../../helpers/firebase";
import { SurveyAnswers, UserGamification, SurveyPage } from "./services";
import { validateSurveyCreated } from "../../trivia/services";

import GraphicGamification from "./graphicsGamification";
import * as Survey from "survey-react";
import "survey-react/modern.css";
Survey.StylesManager.applyTheme("modern");

const surveyStyle = {
  overFlowX: "hidden",
  overFlowY: "scroll",
};

const imageGraphics = {
  display: "block",
  margin: "0 auto",
  maxWidth: "100%",
};

class SurveyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyData: {},
      rankingList: [],
      sentSurveyAnswers: false,
      feedbackMessage: {},
      questionsAnswered: 0,
      totalPoints: 0,
      eventUsers: [],
      voteWeight: 0,
      freezeGame: false,
      showMessageOnComplete: false,
      aux: 0,
      currentPage: null,
      surveyRealTime: null,
      timerPausa: null,
      survey: null
    };
  }

  async componentDidMount() {
    var self = this;
    const { eventId, idSurvey } = this.props;

    //console.log("CARGANDO INICIAL");
    let surveyData = await this.loadSurvey(eventId, idSurvey);
    let survey = new Survey.Model(surveyData);
    //console.log("CARGADO surveyData");

    await this.listenAndUpdateStateSurveyRealTime(idSurvey);
    //console.log("CARGADO surveyRealTime");

    /* El render se produce antes que se cargue toda la info para que funcione bien tenemos q
    que renderizar condicionalmente el compontente de la encuesta solo cuando  surveyRealTime y survey esten cargados 
    sino se presentar comportamientos raros.
    */
    self.setState({ surveyData, idSurvey, survey });

    console.log("CARGADO todo");
    // Esto permite obtener datos para la grafica de gamificacion
    UserGamification.getListPoints(eventId, this.getRankingList);

    this.getCurrentEvenUser();
  }

  /**
   * El quiztiene unos timers para controlar el tiempo por pregunta
   * aqui detenemos los timers o el quiz sigue avanzando y dana la lÃƒÂ³gica cambiando
   * la pregunta en la que deberian ir todos
   */
  componentWillUnmount() {
    console.log("***DESMONTANDO componentWillUnmount");
    if (this.state.survey) {
      console.log("***DESMONTANDO componentWillUnmount LIMDIANDO stopTimer");
      this.state.survey.stopTimer();
    }

    if (this.state.timerPausa) {
      console.log("***DESMONTANDO componentWillUnmount LIMDIANDO timerPausa");
      clearInterval(this.state.timerPausa);
    }

  }

  getRankingList = (list) => {
    console.log("ranking", list);
    this.setState({ rankingList: list });
  };

  getCurrentEvenUser = async () => {
    let evius_token = Cookie.get("evius_token");
    let response = await TicketsApi.getByEvent(this.props.eventId, evius_token);

    if (response.data.length > 0) {
      let vote = 0;
      response.data.forEach((item) => {
        if (item.properties.pesovoto) vote += parseFloat(item.properties.pesovoto);
      });

      this.setState({ eventUsers: response.data, voteWeight: vote });
    }
  };


  listenAndUpdateStateSurveyRealTime = async (idSurvey) => {
    var self = this;

    const promiseA = new Promise((resolve, reject) => {
      try {
        firestore
          .collection("surveys")
          .doc(idSurvey)
          .onSnapshot((doc) => {
            let surveyRealTime = doc.data();

            surveyRealTime.currentPage = (surveyRealTime.currentPage) ? surveyRealTime.currentPage : 0;
            self.setState({ surveyRealTime, freezeGame: surveyRealTime.freezeGame, currentPage: surveyRealTime.currentPage });
            resolve(surveyRealTime);
          });
      } catch (e) { reject(e) }
    });

    return promiseA;
  }
  // Funcion para cargar datos de la encuesta seleccionada
  loadSurvey = async (eventId, idSurvey) => {

    let { surveyData } = this.state;

    // Esto permite que el json pueda asignar el id a cada pregunta
    Survey.JsonObject.metaData.addProperty("question", "id");
    Survey.JsonObject.metaData.addProperty("question", "points");

    let dataSurvey = await SurveysApi.getOne(eventId, idSurvey);

    // Se crea una propiedad para paginar las preguntas
    dataSurvey.pages = [];
    // Se igual title al valor de survey
    dataSurvey.title = dataSurvey.survey;
    // Se muestra una barra de progreso en la parte superior
    dataSurvey.showProgressBar = "bottom";
    // Esto permite que se envie los datos al pasar cada pagina con el evento onPartialSend
    dataSurvey.sendResultOnPageNext = true;
    // Esto permite ocultar el boton de devolver en la encuesta
    dataSurvey.showPrevButton = false;
    // Asigna textos al completar encuesta y al ver la encuesta vacia
    dataSurvey.completedHtml = "Gracias por completar la encuesta!";

    if (dataSurvey.allow_gradable_survey == "true" && dataSurvey.initialMessage) {
      // Permite mostrar el contador y asigna el tiempo limite de la encuesta y por pagina
      dataSurvey.showTimerPanel = "top";

      // Temporalmente quemado el tiempo por pregunta. El valor es en segundos
      // dataSurvey.maxTimeToFinish = 10;
      dataSurvey.maxTimeToFinishPage = 60;

      // Permite usar la primera pagina como instroduccion
      dataSurvey.firstPageIsStarted = true;
      dataSurvey.startSurveyText = "Iniciar Cuestionario";
      let textMessage = dataSurvey.initialMessage;
      dataSurvey["questions"].unshift({
        type: "html",
        html: `<div style='width: 90%; margin: 0 auto;'>${textMessage}</div>`,
      });
    }

    if (dataSurvey["questions"] === undefined) return;

    // El {page, ...rest} es temporal
    // Debido a que se puede setear la pagina de la pregunta si la pregunta tiene la propiedad 'page'

    // Aqui se itera cada pregunta y se asigna a una pagina
    dataSurvey["questions"].forEach(({ page, ...rest }, index) => {
      dataSurvey.pages[index] = {
        name: `page${index + 1}`,
        key: `page${index + 1}`,
        questions: [{ ...rest, isRequired: dataSurvey.allow_gradable_survey == "true" ? false : true }],
      };
    });

    // Se excluyen las propiedades
    const exclude = ({ survey, id, questions, ...rest }) => rest;

    surveyData = exclude(dataSurvey);
    return surveyData;
  };

  // Funcion que ejecuta el servicio para registar votos ------------------------------------------------------------------
  executePartialService = (surveyData, question, infoUser) => {
    let { eventUsers, voteWeight } = this.state;

    // Asigna puntos si la encuesta tiene
    let surveyPoints = question.points && parseInt(question.points);
    let rankingPoints = 0;
    console.log(question);

    return new Promise((resolve, reject) => {
      // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
      let optionIndex = [];
      let optionQuantity = 0;
      let correctAnswer = false;

      // Valida si se marco alguna opcion
      if (question) {
        //Hack rÃƒÂ¡pido para permitir preguntas tipo texto (abiertas)
        if (question.inputType == "text") {
        } else {
          // se valida si question value posee un arreglo 'Respuesta de opcion multiple' o un texto 'Respuesta de opcion unica'
          if (typeof question.value == "object") {
            correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

            if (correctAnswer) rankingPoints += surveyPoints;
            question.value.forEach((value) => {
              optionIndex = [...optionIndex, question.choices.findIndex((item) => item.itemValue == value)];
            });
          } else {
            // Funcion que retorna si la opcion escogida es la respuesta correcta
            correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

            if (correctAnswer) rankingPoints += surveyPoints;
            // Busca el index de la opcion escogida
            optionIndex = question.choices.findIndex((item) => item.itemValue == question.value);
          }
          optionQuantity = question.choices.length;
        }

        let infoOptionQuestion =
          surveyData.allow_gradable_survey == "true"
            ? { optionQuantity, optionIndex, correctAnswer }
            : { optionQuantity, optionIndex };

        // Se envia al servicio el id de la encuesta, de la pregunta y los datos
        // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
        if (question.value)
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
                voteValue: surveyData.allow_vote_value_per_user == "true" && eventUsers.length > 0 && voteWeight,
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
                responseData: question.value,
                date: new Date(),
                uid: "guest",
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
      }
    });
  };

  // Funcion que valida si la pregunta se respondio
  validateIfHasResponse = (survey) => {
    return new Promise((resolve, reject) => {
      survey.currentPage.questions.forEach((question) => {
        console.log(question, question.value);
        if (question.value === undefined) {
          resolve({ isUndefined: true });
        } else {
          resolve({ isUndefined: false });
        }
      });
    });
  };

  // Funcion que muestra el feedback dependiendo del estado
  showStateMessage = (state, questionPoints) => {
    const objMessage = {
      title: "",
      subTitle: "",
      status: state,
    };

    switch (state) {
      case "success":
        return {
          ...objMessage,
          title: "Has respondido correctamente",
          subTitle: `Has ganado ${questionPoints} puntos, respondiendo correctamente la pregunta.`,
          icon: <SmileOutlined />,
        };
        break;

      case "error":
        return {
          ...objMessage,
          title: "No has respondido correctamente",
          subTitle: "Debido a que no respondiste correctamente no has ganado puntos.",
          icon: <FrownOutlined />,
        };
        break;

      case "warning":
        return {
          ...objMessage,
          title: "No has escogido ninguna opciÃƒÂ³n",
          subTitle: `No has ganado ningun punto debido a que no marcaste ninguna opciÃƒÂ³n.`,
          icon: <MehOutlined />,
        };

      case "info":
        return {
          ...objMessage,
          title: "Estamos en una pausa",
          subTitle: `El juego se encuentra en pausa. Espera hasta el moderador reanude el juego`,
          icon: <MehOutlined />,
        };
        break;

      default:
        return { type: state };
        break;
    }
  };

  // Funcion para enviar la informacion de las respuestas ------------------------------------------------------------------
  sendData = async (values) => {
    const { showListSurvey, eventId, currentUser, idSurvey } = this.props;
    let { surveyData, questionsAnswered, aux, currentPage } = this.state;

    let isLastPage = values.isLastPage;
    let countDown = isLastPage ? 3 : 0;

    // Esta condicion se hace debido a que al final de la encuesta, la funcion se ejecuta una ultima vez
    if (aux > 0) return;

    if (surveyData.allow_gradable_survey == "true") {

      if (isLastPage) this.setState((prevState) => ({ showMessageOnComplete: isLastPage, aux: prevState.aux + 1 }));

      if (!isLastPage)
        // Evento que se ejecuta al cambiar de pagina
        values.onCurrentPageChanged.add((sender, options) => {
          // Se obtiene el tiempo restante para poder usarlo en el modal
          countDown = values.maxTimeToFinishPage - options.oldCurrentPage.timeSpent;
          // Unicamente se detendra el tiempo si el tiempo restante del contador es mayor a 0
          // if (countDown > 0)
          sender.stopTimer();
        });

      let response = await this.validateIfHasResponse(values);
      if (response.isUndefined) {
        let secondsToGo = !surveyData.initialMessage ? 3 : countDown;

        let result = this.showStateMessage("warning");
        this.setIntervalToWaitBeforeNextQuestion(values, result, secondsToGo);
      }
    }

    let questionName = Object.keys(values.data);

    // Validacion para evitar que se registre respuesta de la misma pregunta
    if (questionsAnswered === questionName.length) return;

    // Se obtiene el numero de preguntas respondidas actualmente
    this.setState({ questionsAnswered: questionName.length });

    // Permite obtener el nombre de la ultima pregunta respondida y usarlo para consultar informacion de la misma
    questionName = questionName[questionName.length - 1];
    let question = values.getQuestionByName(questionName, true);

    this.executePartialService(surveyData, question, currentUser).then(({ responseMessage, rankingPoints }) => {
      let { totalPoints } = this.state;
      if (rankingPoints !== undefined) totalPoints += rankingPoints;

      this.setState({ totalPoints });

      // message.success({ content: responseMessage });

      // Permite asignar un estado para que actualice la lista de las encuestas si el usuario respondio la encuesta
      if (this.props.showListSurvey) this.setState({ sentSurveyAnswers: true });

      // Solo intenta registrar puntos si la encuesta es calificable
      // Actualiza puntos del usuario
      if (surveyData.allow_gradable_survey == "true") {

        // Muestra modal de retroalimentacion
        if (rankingPoints !== undefined) {
          let secondsToGo = !surveyData.initialMessage ? 3 : countDown;

          let typeMessage = rankingPoints > 0 ? "success" : "error";
          let result = this.showStateMessage(typeMessage, rankingPoints);

          this.setIntervalToWaitBeforeNextQuestion(values, result, secondsToGo);

        }
        // Ejecuta serivicio para registrar puntos
        UserGamification.registerPoints(eventId, {
          user_id: currentUser._id,
          user_name: currentUser.names,
          user_email: currentUser.email,
          points: rankingPoints,
        });
      }
    });
  };

  setIntervalToWaitBeforeNextQuestion(survey, result, secondsToGo) {
    console.log("setIntervalToWaitBeforeNextQuestion iniciando");
    secondsToGo = secondsToGo ? secondsToGo : 0;

    let mensaje_espera = `${result.subTitle} Espera el tiempo indicado para seguir con el cuestionario.`;
    let mensaje_congelado = `El juego se encuentra en pausa. Espera hasta que el moderador  reanude el juego`;

    result.subTitle = secondsToGo > 0 ? mensaje_espera : mensaje_congelado;
    this.setState({ feedbackMessage: result });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      result.subTitle = secondsToGo > 0 ? mensaje_espera + " " + secondsToGo : mensaje_congelado;
      this.setState({ feedbackMessage: result });

      if (secondsToGo <= 0 && !this.state.freezeGame) {
        clearInterval(timer);
        this.setState({ feedbackMessage: {}, showMessageOnComplete: false });
        survey.startTimer();
      }
    }, 1000);

    this.setState({ timerPausa: timer });


  }

  // Funcion que se ejecuta antes del evento onComplete y que muestra un texto con los puntos conseguidos
  setFinalMessage = (survey, options) => {
    let { surveyData, totalPoints } = this.state;
    let textOnCompleted = survey.completedHtml;

    survey.currentPage.questions.forEach((question) => {
      let correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;
      if (correctAnswer) totalPoints += parseInt(question.points);
    });

    if (surveyData.allow_gradable_survey == "true") {
      let text = "";
      //totalPoints > 0 ? `Has obtenido ${totalPoints} puntos` : "No has obtenido puntos. Suerte para la prÃƒÂ³xima";
      survey.completedHtml = `${textOnCompleted}<br>${text}`;
    }
  };

  // Funcion que cambia el mensaje por defecto para el contador
  setCounterMessage = (survey, options) => {
    // Aqui se obtiene el tiempo limite de la encuesta
    // let countDown = Moment.utc((survey.maxTimeToFinish - survey.timeSpent) * 1000).format("mm:ss");
    // let timeTotal = Moment.utc(survey.maxTimeToFinish * 1000).format("mm:ss");

    // Aqui se obtiene el tiempo limite por pregunta
    let countDown = Moment.utc((survey.maxTimeToFinishPage - survey.currentPage.timeSpent) * 1000).format("mm:ss");
    let timeTotal = Moment.utc(survey.maxTimeToFinishPage * 1000).format("mm:ss");

    options.text = `Tienes ${timeTotal} para responder la pregunta. Quedan ${countDown}`;
  };

  /* handler cuando la encuesta cambio de pregunta */
  onCurrentPageChanged = (survey, o) => {

    let { surveyData, currentPage } = this.state;
    let { idSurvey } = this.props;
    console.log("onCurrentPageChanged", currentPage, "current", survey.currentPageNo)
    if (surveyData.allow_gradable_survey != "true") return;

    /** Esta parte actualiza la pagina(pregunta) actual, que es la que se va a usar cuando una persona
     * se caiga del sistema y vuelva a conectarse la idea es que se conecte a esta pregunta.
     * va a tener el valor de la pregunta mÃƒÂ¡s adealantda que se haay contestado.
     * 
     *  survey.currentPageNo + 2. toco poner el +2  para que no aplique la logica en la ÃƒÂºltima pÃƒÂ¡gina si esto pasa vuelve e inicia la encuesta 
     *  cuando una persona entre a respodner una pregunta colocamos el currentPage en la siguiente pregunta por si me salgo y entro que no me vuelva a repetir
     *  la pregunta en la que ya estaba.
     */
    if (!currentPage || ((currentPage < survey.currentPageNo) && survey.PageCount >= survey.currentPageNo + 2))
      SurveyPage.setCurrentPage(idSurvey, survey.currentPageNo);


  }

  checkCurrentPage = (survey) => {


    let { currentPage, surveyData } = this.state;
    const { responseCounter } = this.props;

    // Este condicional sirve para retomar la encuesta donde vayan todos los demas usuarios
    if (surveyData.allow_gradable_survey == "true") {

      if (currentPage !== 0) survey.currentPageNo = currentPage;

      if (this.state.freezeGame) {
        survey.stopTimer();
        let result = this.showStateMessage("info");
        this.setIntervalToWaitBeforeNextQuestion(survey, result, 0);
      }
    }

    // Este condicional sirve para retomar la encuesta dependiendo de las respuestas registradas
    // if (responseCounter > 0 && responseCounter < pages.length) return survey.currentPageNo = responseCounter;
  };

  render() {
    let { surveyData, sentSurveyAnswers, feedbackMessage, showMessageOnComplete, eventUsers } = this.state;

    const { showListSurvey, surveyLabel, eventId } = this.props;
    return (
      console.log(surveyData),
      <div style={surveyStyle}>
        {
          showListSurvey && (
            <div style={{ marginTop: 20 }}>
              <Button ghost shape="round" onClick={() => showListSurvey(sentSurveyAnswers)}>
                <ArrowLeftOutlined /> Volver a las {surveyLabel ? surveyLabel.name : "encuestas"}
              </Button>
            </div>
          )
        }
        {surveyData.allow_gradable_survey === "true" && < GraphicGamification data={this.state.rankingList} eventId={eventId} />}

        {feedbackMessage.hasOwnProperty("title") && <Result {...feedbackMessage} extra={null} />}

        {
          //Se realiza la validacion si la variable allow_anonymous_answers es verdadera para responder la encuesta
          surveyData.allow_anonymous_answers === "true" ? (
            <div style={{ display: feedbackMessage.hasOwnProperty("title") || showMessageOnComplete ? "none" : "block" }}>
              {(this.state.survey && <Survey.Survey
                model={this.state.survey}
                onComplete={this.sendData}
                onPartialSend={this.sendData}
                onCompleting={this.setFinalMessage}
                onTimerPanelInfoText={this.setCounterMessage}
                onStarted={this.checkCurrentPage}
                onCurrentPageChanged={this.onCurrentPageChanged}
              />)}
            </div>
          ) : (
              //Si no es verdadera la variable anterior, 
              //entonces validará si el ticket del usuario existe para despues validar la variable allowed_to_vote en verdadero 
              //para poder responder la encuesta
              eventUsers.map((eventUser) => {
                return eventUser.ticket && (
                  eventUser.ticket.allowed_to_vote === "true" && (
                    <div style={{ display: feedbackMessage.hasOwnProperty("title") || showMessageOnComplete ? "none" : "block" }}>
                      {(this.state.survey && <Survey.Survey
                        model={this.state.survey}
                        onComplete={this.sendData}
                        onPartialSend={this.sendData}
                        onCompleting={this.setFinalMessage}
                        onTimerPanelInfoText={this.setCounterMessage}
                        onStarted={this.checkCurrentPage}
                        onCurrentPageChanged={this.onCurrentPageChanged}
                      />)}
                    </div>
                  )
                )
              })
            )
        }

      </div>
    );
  }
}

export default SurveyComponent;
