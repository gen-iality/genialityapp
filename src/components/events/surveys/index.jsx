import React, { Component, Fragment } from "react";
import { Route, Switch, withRouter, Link } from "react-router-dom";
import * as Cookie from "js-cookie";

import { SurveyAnswers } from "./services";
import API, { SurveysApi } from "../../../helpers/request";

import SurveyList from "./surveyList";
import SurveyComponent from "./surveyComponent";
import Graphics from "./graphics";
import RootPage from "./rootPage";

class SurveyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idSurvey: null,
      surveysData: [],
      hasVote: false,
      currentUser: null,
      openSurvey: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    this.loadData(prevProps);
  }

  // Funcion para solicitar servicio y cargar datos
  loadData = async (prevProps) => {
    let { surveysData } = this.state;
    const { event, activitySurveyList } = this.props;
    if (!prevProps || event !== prevProps.event || activitySurveyList !== prevProps.activitySurveyList) {
      // Condicion que valida si se esta recibiendo una lista de encuestas dentro de una actividad
      if (activitySurveyList) {
        this.setState({ surveysData: activitySurveyList }, this.getCurrentUser);
      } else {
        surveysData = await SurveysApi.getAll(event._id);
        let publishedSurveys = surveysData.data.filter((survey) => survey.publish == "true");

        this.setState({ surveysData: publishedSurveys }, this.getCurrentUser);
      }
    }
  };

  // Funcion que valida si el usuario ha votado en cada una de las encuestas
  seeIfUserHasVote = async () => {
    let { currentUser, surveysData } = this.state;
    const { event } = this.props;

    const votesUserInSurvey = new Promise((resolve, reject) => {
      let surveys = [];

      // Se itera surveysData y se ejecuta el servicio que valida las respuestas
      surveysData.forEach(async (survey, index, arr) => {
        if (currentUser) {
          let userHasVoted = await SurveyAnswers.getUserById(event._id, survey._id, currentUser._id);
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

        if (surveys.length == arr.length) resolve(surveys);
      });
    });

    let stateSurveys = await votesUserInSurvey;

    this.setState({ surveysData: stateSurveys });
  };

  // Funcion para consultar la informacion del actual usuario
  getCurrentUser = async () => {
    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ user: false }, this.seeIfUserHasVote);
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario
          this.setState({ currentUser: data }, this.seeIfUserHasVote);
        }
      } catch (error) {
        const { status } = error.response;
        console.log("STATUS", status, status === 401);
      }
    }
  };

  // Funcion para cambiar entre los componentes 'ListSurveys y SurveyComponent'
  toggleSurvey = (data, reload) => {
    if (data) {
      let { _id, open } = data;
      this.setState({ idSurvey: _id, openSurvey: open });
    } else {
      this.setState({ idSurvey: null });
    }
    if (reload) this.loadData();
  };

  render() {
    let { idSurvey, surveysData, hasVote, currentUser, openSurvey } = this.state;
    const { event } = this.props;

    if (idSurvey)
      return (
        <RootPage
          idSurvey={idSurvey}
          toggleSurvey={this.toggleSurvey}
          eventId={event._id}
          currentUser={currentUser}
          openSurvey={openSurvey}
        />
      );

    return <SurveyList jsonData={surveysData} showSurvey={this.toggleSurvey} />;
  }
}

export default SurveyForm;
