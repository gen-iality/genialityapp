import React, { Component } from "react";
import Moment from "moment";
import { toast } from "react-toastify";
import * as Cookie from "js-cookie";

import SearchComponent from "../../shared/searchTable";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import API, { SurveysApi, AgendaApi } from "../../../helpers/request";
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
    this.loadData();
  }

  // Funcion para consultar la informacion del actual usuario
  getCurrentUser = async () => {
    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ user: false });
    } else {
      try {
        const resp = await API.get(
          `/auth/currentUser?evius_token=${Cookie.get("evius_token")}`
        );
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario
          this.setState({ uid: data._id });
        }
      } catch (error) {
        const { status } = error.response;
        console.log("STATUS", status, status === 401);
      }
    }
  };

  // Funcion para cargar datos de la encuesta seleccionada
  loadData = async () => {
    const { idSurvey, eventId } = this.props;
    let { surveyData } = this.state;

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
        questions: [rest]
      };
    });

    // Esto tambien es temporal
    const exclude = ({ survey, id, questions, ...rest }) => rest;

    surveyData = exclude(dataSurvey);

    this.setState({ surveyData, idSurvey });
  };

  // Funcion para enviar la informacion de las respuestas
  sendDataToServer = survey => {
    const { showListSurvey, eventId } = this.props;
    let { surveyData, uid } = this.state;

    firestore
      .collection("surveys")
      .doc(surveyData._id)
      .set({
        eventId: eventId,
        name: surveyData.title,
        category: "none"
      });

    let questions = survey
      .getAllQuestions()
      .filter(surveyInfo => surveyInfo.id);

    const executeService = (SurveyData, questions, uid) => {
      let sendAnswers = 0;
      let responseMessage = null;
      let responseError = null;

      return new Promise((resolve, reject) => {
        questions.forEach(async question => {
          if (question.value)
            if (uid) {
              await SurveyAnswers.registerWithUID(surveyData._id, question.id, {
                responseData: question.value,
                date: new Date(),
                uid
              })
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
                }
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

    executeService(surveyData, questions, uid).then(result => {
      toast.success(result);
    });

    showListSurvey();
  };

  render() {
    let { surveyData } = this.state;
    const { showListSurvey } = this.props;

    return (
      <div>
        <a className="has-text-white" onClick={() => showListSurvey()}>
          <h3 className="has-text-white"> Regresar a las encuestas</h3>
        </a>
        <Survey.Survey json={surveyData} onComplete={this.sendDataToServer} />
      </div>
    );
  }
}

export default SurveyComponent;
