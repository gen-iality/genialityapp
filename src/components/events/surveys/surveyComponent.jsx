import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";
import { PageHeader, message, notification, Modal } from "antd";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";

import graphicsImage from "../../../graficas.png";

import { SurveysApi, AgendaApi } from "../../../helpers/request";
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
    };
  }

  componentDidMount() {
    const { eventId } = this.props;
    this.loadData();
    UserGamification.getListPoints(eventId, this.getRankingList);
  }

  getRankingList = (list) => {
    this.setState({ rankingList: list });
  };

  // Funcion para cargar datos de la encuesta seleccionada
  loadData = async () => {
    const { idSurvey, eventId, singlePage } = this.props;
    let { surveyData } = this.state;

    // Esto permite que el json pueda asignar el id a cada pregunta
    Survey.JsonObject.metaData.addProperty("question", "id");

    let dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
    console.log("surveyDat", dataSurvey);
    // Se crea una propiedad para paginar las preguntas
    dataSurvey.pages = [];

    // Se igual title al valor de survey
    dataSurvey.title = dataSurvey.survey;

    // Esto permite que se envie los datos al pasar cada pagina con el evento onPartialSend
    dataSurvey.sendResultOnPageNext = true;

    // Esto permite ocultar el boton de devolver en la encuesta
    dataSurvey.showPrevButton = false;

    // Asigna textos al completar encuesta y al ver la encuesta vacia
    dataSurvey.completedHtml = "Gracias por completar la encuesta!";

    if (dataSurvey.allow_gradable_survey == "true" && dataSurvey.initialMessage) {
      dataSurvey.firstPageIsStarted = true;
      dataSurvey.startSurveyText = "Iniciar Cuestionario";

      let textMessage = dataSurvey.initialMessage.replace(/\n/g, "<br />");
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
        questions: [{ ...rest, isRequired: rest.html ? false : true }],
      };
    });

    /*} else {
      dataSurvey.pages[0] = dataSurvey.pages[0] = { name: `page0`, questions: [] };
      dataSurvey["questions"].forEach(({ page, ...rest }, index) => {
        dataSurvey.pages[0].questions.push({ ...rest });
      });
    }*/

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
    let surveyPoints = surveyData.points && parseInt(surveyData.points);
    let rankingPoints = 0;
    console.log(question);

    return new Promise((resolve, reject) => {
      // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
      let optionIndex = [];
      let optionQuantity = 0;
      let correctAnswer = false;

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
    });
  };

  // Funcion para enviar la informacion de las respuestas ------------------------------------------------------------------
  sendData = (values) => {
    const { showListSurvey, eventId, currentUser } = this.props;
    let { surveyData } = this.state;

    let onSuccess = {
      title: "Has respondido correctamente",
      content: `Has ganado ${surveyData.points} puntos respondiendo correctamente la pregunta`,
      icon: <SmileOutlined />,
      centered: true,
    };
    let onFailed = {
      title: "No has respondido correctamente",
      content: "Debido a que no respondiste correctamente no has ganado puntos",
      icon: <FrownOutlined />,
      centered: true,
    };

    let questionName = Object.keys(values.data);
    questionName = questionName[questionName.length - 1];

    let question = values.getQuestionByName(questionName, true);
    this.executePartialService(surveyData, question, currentUser).then(({ responseMessage, rankingPoints }) => {
      // message.success({ content: responseMessage });

      // Permite asignar un estado para que actualice la lista de las encuestas si el usuario respondio la encuesta
      if (this.props.showListSurvey) this.setState({ sentSurveyAnswers: true });

      // Solo intenta registrar puntos si la encuesta es calificable
      // Actualiza puntos del usuario
      if (surveyData.allow_gradable_survey == "true") {
        // Muestra modal de retroalimentacion
        if (rankingPoints !== undefined) {
          let secondsToGo = 3;
          const modal = rankingPoints > 0 ? Modal.success(onSuccess) : Modal.error(onFailed);
          const timer = setInterval(() => {
            secondsToGo -= 1;
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
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
  setFinalMessage = (survey) => {
    let { surveyData } = this.state;
    if (surveyData.allow_gradable_survey == "true") {
      let points = survey.getCorrectedAnswerCount() * surveyData.points;
      let text = points > 0 ? `Has obtenido ${points} puntos` : "No has obtenido puntos. Suerte para la próxima";
      survey.completedHtml += `<br>${text}`;
    }
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
        {this.props.eventId == "5ed6a74b7e2bc067381ad164" && <GraphicGamification data={this.state.rankingList} />}

        <Survey.Survey
          json={surveyData}
          onComplete={this.sendData}
          onPartialSend={this.sendData}
          onCompleting={this.setFinalMessage}
        />
      </div>
    );
  }
}

export default SurveyComponent;
