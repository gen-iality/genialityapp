import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";
import { PageHeader, message } from "antd";
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

    // El {page, ...rest} es temporal
    // Debido a que se puede setear la pagina de la pregunta
    // Si la pregunta tiene la propiedad 'page'

    //if (!singlePage) {
    // Aqui se itera cada pregunta y se asigna a una pagina
    dataSurvey["questions"].forEach(({ page, ...rest }, index) => {
      dataSurvey.pages[index] = {
        name: `page${index + 1}`,
        questions: [{ ...rest, isRequired: true }],
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
    let rankingPoints = 0;
    // console.log(question);

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

          if (correctAnswer) rankingPoints += 5;
          question.value.forEach((value) => {
            optionIndex = [...optionIndex, question.choices.findIndex((item) => item.itemValue == value)];
          });
        } else {
          // Funcion que retorna si la opcion escogida es la respuesta correcta
          correctAnswer = question.correctAnswer !== undefined ? question.isAnswerCorrect() : undefined;

          if (correctAnswer) rankingPoints += 5;
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

    let questionName = Object.keys(values.data);
    questionName = questionName[questionName.length - 1];

    let question = values.getQuestionByName(questionName, true);
    this.executePartialService(surveyData, question, currentUser).then(({ responseMessage, rankingPoints }) => {
      message.success({ content: responseMessage });

      // Redirecciona a la lista de las encuestas
      if (this.props.showListSurvey) this.setState({ sentSurveyAnswers: true });

      // Solo intenta registrar puntos si la encuesta es calificable
      // Actualiza puntos del usuario
      if (surveyData.allow_gradable_survey == "true")
        UserGamification.registerPoints(eventId, {
          user_id: currentUser._id,
          user_name: currentUser.names,
          user_email: currentUser.email,
          points: rankingPoints,
        });
    });
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

        <Survey.Survey json={surveyData} onComplete={this.sendData} onPartialSend={this.sendData} />
      </div>
    );
  }
}

export default SurveyComponent;
