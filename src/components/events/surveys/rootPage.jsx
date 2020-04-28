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
      guestVoteInSurvey: false,
      eventId: "",
      isLoading: true,
      userId: "",
    };
  }

  loadData = (prevProps) => {
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

    if (userId) {
      let userHasVoted = await SurveyAnswers.getUserById(eventId, idSurvey, userId);
      this.setState({ hasVote: userHasVoted, isLoading: false });
    }

    // Esto solo se ejecuta si no hay algun usuario logeado
    const guestUser = new Promise((resolve, reject) => {
      let surveyId = localStorage.getItem(`userHasVoted_${idSurvey}`);
      surveyId ? resolve(true) : resolve(false);
    });

    let guestVoteInSurvey = await guestUser;
    this.setState({ guestVoteInSurvey, isLoading: false });
  };

  render() {
    let { idSurvey, hasVote, eventId, isLoading, userId, guestVoteInSurvey } = this.state;
    const { toggleSurvey, openSurvey } = this.props;

    if (!isLoading)
      return openSurvey == "false" || hasVote || guestVoteInSurvey ? (
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
