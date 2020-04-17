import React, { Component, Fragment } from "react";
import { Route, Switch, withRouter, Link } from "react-router-dom";
import * as Cookie from "js-cookie";

import { SurveyAnswers } from "./services";
import API, { SurveysApi } from "../../../helpers/request";

import SurveyComponent from "./surveyComponent";
import Graphics from "./graphics";
import RootPage from "./rootPage";

import { List, Button, Card, Col } from "antd";

function ListSurveys(props) {
  let { jsonData } = props;

  return (
    <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
      <Card>
        <List
          dataSource={jsonData}
          renderItem={survey => (
            <List.Item
              key={survey._id}
              actions={[
                <Button onClick={() => props.showSurvey(survey._id)} loading={survey.userHasVoted == undefined}>
                  {!survey.userHasVoted ? "Ir a Encuesta" : " Ver Resultados"}
                </Button>
              ]}>
              {survey.survey}
            </List.Item>
          )}
        />
      </Card>
    </Col>
  );
}

class SurveyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idSurvey: null,
      surveysData: [],
      hasVote: false,
      uid: null
    };
  }

  componentDidMount() {
    this.loadData();
    this.getCurrentUser();
  }

  // Funcion para solicitar servicio y cargar datos
  loadData = async () => {
    let { surveysData } = this.state;
    const { event } = this.props;

    surveysData = await SurveysApi.getAll(event._id);
    let publishedSurveys = surveysData.data.filter(survey => survey.publish == "true");

    this.setState({ surveysData: publishedSurveys });
  };

  // Funcion que valida si el usuario ha votado en cada una de las encuestas
  seeIfUserHasVote = async () => {
    let { uid, surveysData } = this.state;
    const { event } = this.props;

    const votesUserInSurvey = new Promise((resolve, reject) => {
      let surveys = [];
      // Se itera surveysData y se ejecuta el servicio que valida las respuestas
      surveysData.forEach(async (survey, index, arr) => {
        let userHasVoted = await SurveyAnswers.getUserById(event._id, survey._id, uid);
        surveys.push({ ...arr[index], userHasVoted });

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
      this.setState({ user: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario
          this.setState({ uid: data._id }, this.seeIfUserHasVote);
        }
      } catch (error) {
        const { status } = error.response;
        console.log("STATUS", status, status === 401);
      }
    }
  };

  // Funcion para cambiar entre los componentes 'ListSurveys y SurveyComponent'
  toggleSurvey = data => {
    this.setState({ idSurvey: data });
  };

  render() {
    let { idSurvey, surveysData, hasVote, uid } = this.state;
    const { event } = this.props;

    if (idSurvey)
      return <RootPage idSurvey={idSurvey} toggleSurvey={this.toggleSurvey} eventId={event._id} userId={uid} />;

    return <ListSurveys jsonData={surveysData} showSurvey={this.toggleSurvey} />;
  }
}

export default SurveyForm;
