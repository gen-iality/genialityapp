import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Cookie from 'js-cookie';
import { TicketsApi } from '../../../helpers/request';
import { SurveyAnswers } from './services';

import Graphics from './graphics';
import SurveyComponent from './surveyComponent';

import { Card } from 'antd';
import Loading from './loading';

class RootPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasVote: false,
      guestVoteInSurvey: false,
      isLoading: true,
      forceLoadDataState: false,
    };
  }

  forceLoadData = () => {};

  loadData = async (prevProps) => {
    const { idSurvey, eventId } = this.props;
    if (!prevProps || idSurvey !== prevProps.idSurvey) {
      let eventUser = await this.getCurrentEvenUser(eventId);
      this.setState({ eventUser }, this.seeIfUserHasVote);
    }
  };

  componentDidMount(prevProps) {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    this.loadData(prevProps);
    if (prevState.forceLoadDataState !== this.state.forceLoadDataState) {
      this.loadData();
    }
  }

  getCurrentEvenUser = async (eventId) => {
    let evius_token = Cookie.get('evius_token');
    if (!evius_token) return null;
    let response = await TicketsApi.getByEvent(eventId, evius_token);
    return response && response.data.length ? response.data[0] : null;
  };

  seeIfUserHasVote = async () => {
    const { currentSurvey } = this.props;
    const { userHasVoted } = currentSurvey;
    const { currentUser, idSurvey, eventId } = this.props;

    if (!(Object.keys(currentUser).length === 0)) {
      let responseCounter = await SurveyAnswers.getUserById(eventId, currentSurvey, currentUser._id, true);

      //Solucion temporarl mientra se configura la retoma
      // userHasvoted llega undefined despues de contestar la encuesta cuanto esta es unica en la actividad
      this.setState({
        hasVote: userHasVoted !== undefined ? userHasVoted : responseCounter > 0,
        isLoading: false,
        responseCounter,
      });
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

  // eslint-disable-next-line no-unused-vars
  getResults = (surveyData) => {
    // eslint-disable-next-line no-console
    //
  };

  render() {
    let { hasVote, isLoading, guestVoteInSurvey, responseCounter, eventUser } = this.state;
    const { toggleSurvey, surveyLabel, currentUser, eventId, idSurvey, event } = this.props;
    if (!isLoading)
      return (
        <div
          style={{
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundImage:
              'url("https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/convencion_corona%2Fbg-QQSM2.jpg?alt=media&token=a13a7c60-6e42-4eb0-8ddb-01e4582ed8af")',
          }}>
          {(eventUser && eventUser.rol && eventUser.rol.name === 'Speaker') ||
          this.props.currentSurvey.isOpened === 'false' ||
          this.props.currentSurvey.isOpened === false ||
          hasVote ||
          guestVoteInSurvey ? (
            <>
              {/*Preparacion componente para los resultados*/}

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
            <Card className='survyCard' style={{ background: 'rgba(255,255,255,0.7) !important' }}>
              <SurveyComponent
                responseCounter={responseCounter}
                idSurvey={idSurvey}
                showListSurvey={toggleSurvey}
                eventId={eventId}
                event={event}
                currentUser={currentUser}
                singlePage={true}
                surveyLabel={surveyLabel}
                operation='participationPercentage'
              />
            </Card>
          )}
        </div>
      );

    return <Loading />;
  }
}

const mapStateToProps = (state) => ({
  event: state.event.data,
  eventId: state.event.data._id,
  currentSurvey: state.survey.data.currentSurvey,
  idSurvey: state.survey.data.currentSurvey._id,
  currentUser: state.user.data,
});

export default connect(mapStateToProps)(RootPage);
