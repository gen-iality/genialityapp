import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";

import SearchComponent from "../../shared/searchTable";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import { SurveysApi, AgendaApi } from "../../../helpers/request";
import { firestore } from "../../../helpers/firebase";
import { SurveyAnswers } from "./services";

import * as Survey from "survey-react";
import "survey-react/survey.css";

class SurveyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyData: {},
      uid: null
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
        questions: [{ ...rest, isRequired: true }]
      };
    });

    // Se excluyen las propiedades
    const exclude = ({ survey, id, questions, ...rest }) => rest;

    surveyData = exclude(dataSurvey);

    this.setState({ surveyData, idSurvey });
  };

  // Funcion para enviar la informacion de las respuestas
  sendDataToServer = survey => {
    const { showListSurvey, eventId, userId } = this.props;
    let { surveyData, uid } = this.state;

    firestore
      .collection("surveys")
      .doc(surveyData._id)
      .set({
        eventId: eventId,
        name: surveyData.title,
        category: "none"
      });

    // Se obtiene las preguntas de la encuesta con la funcion 'getAllQuestions' que provee la libreria
    let questions = survey.getAllQuestions().filter(surveyInfo => surveyInfo.id);

    const executeService = (SurveyData, questions, uid) => {
      let sendAnswers = 0;
      let responseMessage = null;
      let responseError = null;

      return new Promise((resolve, reject) => {
        questions.forEach(async question => {
          // Se obtiene el index de la opcion escogida, y la cantidad de opciones de la pregunta
          let optionIndex = question.choices.findIndex(item => item.itemValue == question.value);
          let optionQuantity = question.choices.length;

          // Se envia al servicio el id de la encuesta, de la pregunta y los datos
          // El ultimo parametro es para ejecutar el servicio de conteo de respuestas
          if (question.value)
            if (uid) {
              await SurveyAnswers.registerWithUID(
                surveyData._id,
                question.id,
                {
                  responseData: question.value,
                  date: new Date(),
                  uid
                },
                { optionQuantity, optionIndex }
              )
                .then(result => {
                  sendAnswers++;
                  responseMessage = !responseMessage && result;
                })
                .catch(err => (responseError = err));
            } else {
              await SurveyAnswers.registerLikeGuest(
                surveyData._id,
                question.id,
                {
                  responseData: question.value,
                  date: new Date(),
                  uid: "guest"
                },
                { optionQuantity, optionIndex }
              )
                .then(result => {
                  sendAnswers++;
                  responseMessage = !responseMessage && result;
                })
                .catch(err => (responseError = err));
            }
          if (responseMessage && sendAnswers == questions.length) {
            await resolve(responseMessage);
          } else if (responseError) {
            await reject(responseError);
          }
        });
      });
    };

    executeService(surveyData, questions, userId).then(result => {
      toast.success(result);
    });

    showListSurvey();
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
