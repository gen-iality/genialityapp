import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";
import { PageHeader, message, notification, Modal } from "antd";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";

import * as Cookie from "js-cookie";

import graphicsImage from "../../../graficas.png";

import { SurveysApi, AgendaApi, TicketsApi } from "../../../helpers/request";
import { firestore } from "../../../helpers/firebase";
import { SurveyAnswers, UserGamification } from "./services";
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
      feedbackModal: false,
      questionsAnswered: 0,
      totalPoints: 0,
      eventUsers: {},
    };
  }

  componentDidMount() {
    const { eventId } = this.props;
    this.loadData();
    // Esto permite obtener datos para la grafica de gamificacion
    UserGamification.getListPoints(eventId, this.getRankingList);

    this.getCurrentEvenUser();
  }

  getRankingList = (list) => {
    this.setState({ rankingList: list });
  };

  getCurrentEvenUser = async () => {
    let evius_token = Cookie.get("evius_token");
    let response = await TicketsApi.getByEvent(this.props.eventId, evius_token);

    this.setState({ eventUsers: response.data });
  };

  // Funcion para cargar datos de la encuesta seleccionada
  loadData = async () => {
    const { idSurvey, eventId, singlePage } = this.props;
    let { surveyData } = this.state;

    // Esto permite que el json pueda asignar el id a cada pregunta
    Survey.JsonObject.metaData.addProperty("question", "id");

    Survey.JsonObject.metaData.addProperty("question", "points");

    let dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
    console.log("surveyDat", dataSurvey);
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
      dataSurvey.maxTimeToFinishPage = 10;

      // Permite usar la primera pagina como instroduccion
      dataSurvey.firstPageIsStarted = true;
      dataSurvey.startSurveyText = "Iniciar Cuestionario";

      let textMessage = dataSurvey.initialMessage;
      dataSurvey["questions"].unshift({
        type: "html",
        html: `<div style='width: 90%; margin: 0 auto;'>${textMessage}</div>`,
      });
    }

    // El {page, ...rest} es temporal
    // Debido a que se puede setear la pagina de la pregunta
    // Si la pregunta tiene la propiedad 'page'

    //if (!singlePage) {
    // Aqui se itera cada pregunta y se asigna a una pagina
    dataSurvey["questions"].forEach(({ page, ...rest }, index) => {
      dataSurvey.pages[index] = {
        name: `page${index + 1}`,
        questions: [{ ...rest, isRequired: dataSurvey.allow_gradable_survey == "true" ? false : true }],
      };
    });

    /*
  } else {
    dataSurvey.pages[0] = dataSurvey.pages[0] = { name: `page0`, questions: [] };
    dataSurvey["questions"].forEach(({ page, ...rest }, index) => {
      dataSurvey.pages[0].questions.push({ ...rest });
    });
  }*/

    // Se excluyen las propiedades
    const exclude = ({ survey, id, questions, ...rest }) => rest;

    surveyData = exclude(dataSurvey);

    console.log("pages", surveyData);

    this.setState({ surveyData, idSurvey });
  };

  // Funcion que ejecuta el servicio para registar votos ------------------------------------------------------------------
  executePartialService = (surveyData, question, infoUser) => {
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
        //Hack rápido para permitir preguntas tipo texto (abiertas)
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
                voteValue: infoUser.pesovoto,
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

  // Funcion para enviar la informacion de las respuestas ------------------------------------------------------------------
  sendData = (values) => {
    const { showListSurvey, eventId, currentUser } = this.props;
    let { surveyData, questionsAnswered } = this.state;

    let isLastPage = values.isLastPage;
    let countDown = isLastPage ? 3 : 0;

    if (!isLastPage)
      // Evento que se ejecuta al cambiar de pagina
      values.onCurrentPageChanged.add((sender, options) => {
        // Se obtiene el tiempo restante para poder usarlo en el modal
        countDown = values.maxTimeToFinishPage - options.oldCurrentPage.timeSpent;
        // Unicamente se detendra el tiempo si el tiempo restante del contador es mayor a 0
        if (countDown > 0) sender.stopTimer();
      });

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

      let onSuccess = {
        title: "Has respondido correctamente",
        content: `Has ganado ${question.points} puntos respondiendo correctamente la pregunta`,
        icon: <SmileOutlined />,
        centered: true,
        okButtonProps: { disabled: true },
      };
      let onFailed = {
        title: "No has respondido correctamente",
        content: "Debido a que no respondiste correctamente no has ganado puntos",
        icon: <FrownOutlined />,
        centered: true,
        okButtonProps: { disabled: true },
      };

      // message.success({ content: responseMessage });

      // Permite asignar un estado para que actualice la lista de las encuestas si el usuario respondio la encuesta
      if (this.props.showListSurvey) this.setState({ sentSurveyAnswers: true });

      // Solo intenta registrar puntos si la encuesta es calificable
      // Actualiza puntos del usuario
      if (surveyData.allow_gradable_survey == "true") {
        // Muestra modal de retroalimentacion
        if (rankingPoints !== undefined) {
          let secondsToGo = surveyData.allow_gradable_survey == "true" && !surveyData.initialMessage ? 3 : countDown;

          // Se evalua si el usuario respondio bien o no la pregunta. Para el mostrar modal respectivo
          const modal =
            rankingPoints > 0
              ? Modal.success({
                  ...onSuccess,
                  content: !isLastPage
                    ? `${onSuccess.content}. Espera el tiempo de ${secondsToGo}, para seguir con el cuestionario.`
                    : onSuccess.content,
                })
              : Modal.error({
                  ...onFailed,
                  content: !isLastPage
                    ? `${onFailed.content}. Espera el tiempo de ${secondsToGo}, para seguir con el cuestionario.`
                    : onFailed.content,
                });
          const timer = setInterval(() => {
            secondsToGo -= 1;
            rankingPoints > 0
              ? modal.update({
                  ...onSuccess,
                  content: !isLastPage
                    ? `${onSuccess.content}. Espera el tiempo de ${secondsToGo}, para seguir con el cuestionario.`
                    : onSuccess.content,
                })
              : modal.update({
                  ...onFailed,
                  content: !isLastPage
                    ? `${onFailed.content}. Espera el tiempo de ${secondsToGo}, para seguir con el cuestionario.`
                    : onFailed.content,
                });
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
            // Se inicia el tiempo de nuevo al cerrarse el modal
            values.startTimer();
          }, secondsToGo * 1000);
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

  // Funcion que se ejecuta antes del evento onComplete y que muestra un texto con los puntos conseguidos
  setFinalMessage = (survey, options) => {
    let { surveyData, totalPoints } = this.state;
    let textOnCompleted = survey.completedHtml;

    survey.currentPage.questions.forEach((question) => {
      let correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;
      if (correctAnswer) totalPoints += parseInt(question.points);
    });

    if (surveyData.allow_gradable_survey == "true") {
      let text =
        totalPoints > 0 ? `Has obtenido ${totalPoints} puntos` : "No has obtenido puntos. Suerte para la próxima";
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

  render() {
    let { surveyData, sentSurveyAnswers } = this.state;
    const { showListSurvey } = this.props;
    return (
      <div style={surveyStyle}>
        {showListSurvey && (
          <PageHeader
            className="site-page-header"
            onBack={() => showListSurvey(sentSurveyAnswers)}
            title=""
            subTitle="Regresar a las encuestas"
          />
        )}
        {this.props.idSurvey !== "5ed591dacbc54a2c1d787ac2" && <GraphicGamification data={this.state.rankingList} />}

        <Survey.Survey
          json={surveyData}
          onComplete={this.sendData}
          onPartialSend={this.sendData}
          onCompleting={this.setFinalMessage}
          onTimerPanelInfoText={this.setCounterMessage}
        />
      </div>
    );
  }
}

export default SurveyComponent;
