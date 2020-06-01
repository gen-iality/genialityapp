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
      currentUser: "",
    };
  }

  loadData = (prevProps) => {
    const { idSurvey, eventId, currentUser } = this.props;
    if (!prevProps || idSurvey !== prevProps.idSurvey) {
      this.setState({ idSurvey, eventId, currentUser }, this.seeIfUserHasVote);
    }
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    this.loadData(prevProps);
  }

  seeIfUserHasVote = async () => {
    let { idSurvey, hasVote, eventId, currentUser } = this.state;

    if (currentUser) {
      let userHasVoted = await SurveyAnswers.getUserById(eventId, idSurvey, currentUser._id);
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
    let { idSurvey, hasVote, eventId, isLoading, currentUser, guestVoteInSurvey } = this.state;
    const { toggleSurvey, openSurvey } = this.props;

    if (!isLoading)
      return openSurvey == "false" || hasVote || guestVoteInSurvey ? (
        <Graphics idSurvey={idSurvey} showListSurvey={toggleSurvey} eventId={eventId} />
      ) : (
          <Card>
            <SurveyComponent
              idSurvey={idSurvey}
              showListSurvey={toggleSurvey}
              eventId={eventId}
              currentUser={currentUser}
              singlePage={true}
            />
          </Card>
        );

    return <Spin></Spin>;
  }
}
