import React, { Component } from 'react';

import { SurveyAnswers } from './services';

import Graphics from './graphics';
import SurveyComponent from './surveyComponent';

import { Card, Spin } from 'antd';

export default class RootPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idSurvey: '',
      hasVote: false,
      guestVoteInSurvey: false,
      eventId: '',
      isLoading: true,
      currentUser: '',
    };
  }

  loadData = (prevProps) => {
    const { idSurvey, eventId, currentUser, eventUser } = this.props;
    if (!prevProps || idSurvey !== prevProps.idSurvey) {
      this.setState({ idSurvey, eventId, currentUser, eventUser }, this.seeIfUserHasVote);
    }
  };

  componentDidMount() {
    console.log('component', this.props);
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    this.loadData(prevProps);
  }

  seeIfUserHasVote = async () => {
    let { idSurvey, eventId, currentUser } = this.state;
    const { userHasVoted, selectedSurvey } = this.props;

    if (currentUser) {
      let responseCounter = await SurveyAnswers.getUserById(eventId, selectedSurvey, currentUser._id, true);
      this.setState({ hasVote: userHasVoted, isLoading: false, responseCounter });
    } else {
      // Esto solo se ejecuta si no hay algun usuario logeado
      // eslint-disable-next-line no-unused-vars
      const guestUser = new Promise((resolve, reject) => {
        let surveyId = localStorage.getItem(`userHasVoted_${idSurvey}`);
        surveyId ? resolve(true) : resolve(false);
      });
      let guestVoteInSurvey = await guestUser;
      this.setState({ guestVoteInSurvey, isLoading: false });
    }
  };

  getResults = (surveyData) => {
    console.log('los resultados', surveyData);
  };

  render() {
    let {
      idSurvey,
      hasVote,
      eventId,
      isLoading,
      currentUser,
      guestVoteInSurvey,
      responseCounter,
      eventUser,
    } = this.state;
    const { toggleSurvey, openSurvey, surveyLabel } = this.props;
    if (!isLoading)
      return (eventUser && eventUser.rol && eventUser.rol.name === 'Speaker') ||
        openSurvey === 'false' ||
        hasVote ||
        guestVoteInSurvey ? (
        <>
          {/*Preparacion componente para los resultados*/}
          {console.log('graficos desde rootpage')}
          <Card className='survyCard'>
            <h1>fin de la encuesta</h1>
          </Card>
          <Graphics
            idSurvey={idSurvey}
            showListSurvey={toggleSurvey}
            eventId={eventId}
            surveyLabel={surveyLabel}
            operation='participationPercentage' //onlyCount, participationPercentage
            handleResults={this.getResults}
          />
        </>
      ) : (
        <Card className='survyCard'>
          <SurveyComponent
            responseCounter={responseCounter}
            idSurvey={idSurvey}
            showListSurvey={toggleSurvey}
            eventId={eventId}
            currentUser={currentUser}
            singlePage={true}
            surveyLabel={surveyLabel}
            operation='participationPercentage'
          />
        </Card>
      );

    return <Spin></Spin>;
  }
}
