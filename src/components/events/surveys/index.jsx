import React, { Component, Fragment } from "react";
import { Route, Switch, withRouter, Link } from "react-router-dom";

import { SurveysApi } from "../../../helpers/request";

import SurveyComponent from "./surveyComponent";

import { List, Button, Card, Col } from "antd";

function ListSurveys(props) {
  let { jsonData } = props;

  return (
    <Col 
    xs={24}
    sm={22}
    md={18} 
    lg={18} 
    xl={18}
    style={{ margin: "0 auto" }}
    >
      <Card>
        <List
          dataSource={jsonData}
          renderItem={survey => (
            <List.Item
              key={survey._id}
              actions={[
                <Button onClick={() => props.showSurvey(survey._id)}>
                  Ir a Encuesta
                </Button>
              ]}
            >
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
      surveysData: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  // Funcion para solicitar servicio y cargar datos
  loadData = async () => {
    let { surveysData } = this.state;
    const { event } = this.props;

    surveysData = await SurveysApi.getAll(event._id);
    console.log(surveysData);
    this.setState({ surveysData: surveysData.data });
  };

  // Funcion para cambiar entre los componentes 'ListSurveys y SurveyComponent'
  toggleSurvey = data => {
    this.setState({ idSurvey: data });
  };

  render() {
    let { idSurvey, surveysData } = this.state;
    const { event } = this.props;

    if (idSurvey)
      return (
        <Col 
        xs={24}
        sm={22}
        md={18} 
        lg={18} 
        xl={18}
        style={{ margin: "0 auto" }}
        >
          <Card>
            <SurveyComponent
              idSurvey={idSurvey}
              showListSurvey={this.toggleSurvey}
              eventId={event._id}
            />
          </Card>
        </Col>
      );

    return (
      <ListSurveys jsonData={surveysData} showSurvey={this.toggleSurvey} />
    );
  }
}

export default SurveyForm;
