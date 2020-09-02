import React, { Component } from "react";

import { SurveyAnswers } from "./services";

import Graphics from "./graphics";
import SurveyComponent from "./surveyComponent";

import { Card,  Spin } from "antd";

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
    const { idSurvey, eventId, currentUser, eventUser } = this.props;
    console.log("surveydebug",currentUser, eventUser);
    if (!prevProps || idSurvey !== prevProps.idSurvey) {
      this.setState({ idSurvey, eventId, currentUser, eventUser }, this.seeIfUserHasVote);
    }
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    this.loadData(prevProps);
  }

  seeIfUserHasVote = async () => {
    let { idSurvey,  eventId, currentUser } = this.state;
    const { userHasVoted, selectedSurvey } = this.props;

    if (currentUser) {
      let responseCounter = await SurveyAnswers.getUserById(eventId, selectedSurvey, currentUser._id, true);
      this.setState({ hasVote: userHasVoted, isLoading: false, responseCounter });
    } else {
      // Esto solo se ejecuta si no hay algun usuario logeado
      const guestUser = new Promise((resolve, reject) => {
        let surveyId = localStorage.getItem(`userHasVoted_${idSurvey}`);
        surveyId ? resolve(true) : resolve(false);

      });
      let guestVoteInSurvey = await guestUser;
      this.setState({ guestVoteInSurvey, isLoading: false });
    }


  };

  render() {
    let { idSurvey, hasVote, eventId, isLoading, currentUser, guestVoteInSurvey, responseCounter, eventUser } = this.state;
    const { toggleSurvey, openSurvey, surveyLabel } = this.props;
    console.log("DEBUG error muestra gráfica en firefox:", "idSurvey", "hasVote", hasVote, "guestVoteInSurvey", guestVoteInSurvey, "openSurvey", openSurvey);
    if (!isLoading)
      return ((eventUser && eventUser.rol && eventUser.rol.name === "Speaker") || openSurvey === "false" || hasVote || guestVoteInSurvey) ? (
        <Graphics idSurvey={idSurvey} showListSurvey={toggleSurvey} eventId={eventId} surveyLabel={surveyLabel} />
      ) : (
          <Card className="survyCard">
            <SurveyComponent
              responseCounter={responseCounter}
              idSurvey={idSurvey}
              showListSurvey={toggleSurvey}
              eventId={eventId}
              currentUser={currentUser}
              singlePage={true}
              surveyLabel={surveyLabel}
            />
          </Card>
        );

    return <Spin></Spin>;
  }
}
