import React, { Component } from "react";

import { SurveyAnswers } from "./services";

import Graphics from "./graphics";
import SurveyComponent from "./surveyComponent";

import { List, Button, Card, Col, Spin } from "antd";

export default class RootPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idSurvey: "",
      hasVote: false,
      eventId: "",
      isLoading: true,
      userId: ""
    };
  }

  loadData = prevProps => {
    const { idSurvey, eventId, userId } = this.props;
    if (!prevProps || idSurvey !== prevProps.idSurvey) {
      this.setState({ idSurvey, eventId, userId }, this.seeIfUserHasVote);
    }
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    this.loadData(prevProps);
  }

  seeIfUserHasVote = async () => {
    let { idSurvey, hasVote, eventId, userId } = this.state;
    let userHasVoted = await SurveyAnswers.getUserById(eventId, idSurvey, userId);
    this.setState({ hasVote: userHasVoted, isLoading: false });
  };

  render() {
    let { idSurvey, hasVote, eventId, isLoading, userId } = this.state;
    const { toggleSurvey } = this.props;

    if (!isLoading)
      return hasVote ? (
        <Graphics idSurvey={idSurvey} showListSurvey={toggleSurvey} eventId={eventId} />
      ) : (
        <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
          <Card>
            <SurveyComponent idSurvey={idSurvey} showListSurvey={toggleSurvey} eventId={eventId} userId={userId} />
          </Card>
        </Col>
      );

    return <Spin></Spin>;
  }
}
