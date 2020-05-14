import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";

import SearchComponent from "../../shared/searchTable";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import { SurveysApi, AgendaApi } from "../../../helpers/request";
import { firestore } from "../../../helpers/firebase";
import { SurveyAnswers } from "./services";
import { validateSurveyCreated } from "../../trivia/services";

import * as Survey from "survey-react";
import "survey-react/survey.css";

class SurveyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyData: {},
    };
  }

  componentDidMount() {
    console.log("AQUI");
    this.loadData();
  }

  // Funcion para cargar datos de la encuesta seleccionada
  loadData = async () => {
    const { idSurvey, eventId } = this.props;
    let { surveyData } = this.state;

    // Esto permite que el json pueda asignar el id a cada pregunta
    Survey.JsonObject.metaData.addProperty("question", "id");

    let dataSurvey = await SurveysApi.getOne(eventId, idSurvey);

    // Se crea una propiedad para paginar las preguntas
    dataSurvey.pages = [];

    // Se igual title al valor de survey
    dataSurvey.title = dataSurvey.survey;

    // El {page, ...rest} es temporal
    // Debido a que se puede setear la pagina de la pregunta
    // Si la pregunta tiene la propiedad 'page'

    // Aqui se itera cada pregunta y se asigna a una pagina
    dataSurvey["questions"].forEach(({ page, ...rest }, index) => {
      dataSurvey.pages[index] = {
        name: `page${index + 1}`,
        questions: [{ ...rest, isRequired: true }],
      };
    });

    // Se excluyen las propiedades
    const exclude = ({ survey, id, questions, ...rest }) => rest;

    surveyData = exclude(dataSurvey);

    this.setState({ surveyData, idSurvey });
  };

  // Funcion para enviar la informacion de las respuestas
  sendDataToServer = (survey) => {
    const { showListSurvey, eventId, currentUser } = this.props;
    let { surveyData } = this.state;

    validateSurveyCreated(surveyData._id).then((existSurvey) => {
      if (!existSurvey) {
        firestore
          .collection("surveys")
          .doc(surveyData._id)
          .set({
            eventId: eventId,
            name: surveyData.title,
            category: "none",
          });
      }
    });

    // Se obtiene las preguntas de la encuesta con la funcion 'getAllQuestions' que provee la libreria
    let questions = survey.getAllQuestions().filter((surveyInfo) => surveyInfo.id);

    const executeService = (SurveyData, questions, infoUser) => {
      let sendAnswers = 0;
      let responseMessage = null;
      let responseError = null;

      return new Promise((resolve, reject) => {
        questions.forEach(async (question) => {
          // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
          let optionIndex = [];

          // se valida si question value posee un arreglo 'Respuesta de opcion multiple' o un texto 'Respuesta de opcion unica'
          if (typeof question.value == "object") {
            question.value.forEach((value) => {
              optionIndex = [...optionIndex, question.choices.findIndex((item) => item.itemValue == value)];
            });
          } else {
            optionIndex = question.choices.findIndex((item) => item.itemValue == question.value);
          }

          let optionQuantity = question.choices.length;

          // Se envia al servicio el id de la encuesta, de la pregunta y los datos
          // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
          if (question.value)
            if (infoUser) {
              await SurveyAnswers.registerWithUID(
                surveyData._id,
                question.id,
                {
                  responseData: question.value,
                  date: new Date(),
                  uid: infoUser._id,
                  email: infoUser.email,
                  names: infoUser.names || infoUser.displayName,
                },
                { optionQuantity, optionIndex }
              )
                .then((result) => {
                  sendAnswers++;
                  responseMessage = result;
                })
                .catch((err) => {
                  sendAnswers++;
                  responseError = err;
                });
            } else {
              // Sirve para controlar si un usuario anonimo ha votado
              localStorage.setItem(`userHasVoted_${surveyData._id}`, true);

              await SurveyAnswers.registerLikeGuest(
                surveyData._id,
                question.id,
                {
                  responseData: question.value,
                  date: new Date(),
                  uid: "guest",
                },
                { optionQuantity, optionIndex }
              )
                .then((result) => {
                  sendAnswers++;
                  responseMessage = result;
                })
                .catch((err) => {
                  sendAnswers++;
                  responseError = err;
                });
            }

          if (responseMessage && sendAnswers == questions.length) {
            await resolve(responseMessage);
          } else if (responseError) {
            await reject(responseError);
          }
        });
      });
    };

    executeService(surveyData, questions, currentUser).then((result) => {
      toast.success(result);
      if (this.props.showListSurvey) {
        showListSurvey(null, "reload");
      }
    });
  };

  render() {
    let { surveyData } = this.state;
    const { showListSurvey } = this.props;

    return (
      <div>
        <a className="has-text-black" onClick={() => showListSurvey()}>
          <h3 className="has-text-black"> Regresar a las encuestas</h3>
        </a>
        <Survey.Survey json={surveyData} onComplete={this.sendDataToServer} />
      </div>
    );
  }
}

export default SurveyComponent;
