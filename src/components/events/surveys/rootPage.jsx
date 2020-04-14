import React, { Component } from "react";

import { SurveyAnswers } from "./services";

import Graphics from "./graphics";
import SurveyComponent from "./surveyComponent";

import { List, Button, Card, Col } from "antd";

export default class RootPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idSurvey: "",
      hasVote: false,
      eventId: ""
    };
  }

  loadData = prevProps => {
    const { idSurvey, eventId } = this.props;
    if (!prevProps || idSurvey !== prevProps.idSurvey) {
      this.setState({ idSurvey, eventId }, this.seeIfUserHasVote);
    }
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    this.loadData(prevProps);
  }

  seeIfUserHasVote = () => {
    let { idSurvey, hasVote, eventId } = this.state;
    console.log(idSurvey, hasVote, eventId);
    SurveyAnswers.getUserById(eventId, idSurvey);
  };

  render() {
    let { idSurvey, hasVote, eventId } = this.state;
    const { toggleSurvey } = this.props;

    return hasVote ? (
      <Graphics idSurvey={idSurvey} showListSurvey={toggleSurvey} eventId={eventId} />
    ) : (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>
          <SurveyComponent idSurvey={idSurvey} showListSurvey={toggleSurvey} eventId={eventId} />
        </Card>
      </Col>
    );
  }
}
