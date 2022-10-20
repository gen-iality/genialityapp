import { Component } from 'react';
import { Button, Result, Spin, Row } from 'antd';
import Fullscreen from 'react-full-screen';
import { FullscreenOutlined, LineOutlined } from '@ant-design/icons';
import SurveyForm from '../surveys';
import API from '@helpers/request';
import connect from 'react-redux/es/connect/connect';
import { fetchPermissions } from '../../../redux/permissions/actions';
import { fetchRol } from '../../../redux/rols/actions';
import ConferenceTabs from './conferenceTabs';

import { firestore } from '@helpers/firebase';
class ZoomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_conference: '284693751',
      url_conference: `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`,
      meeting_id: null,
      userEntered: null,
      isFull: false,
      isMedium: false,
      isMinimize: false,
      displayName: '',
      email: null,
      collapsed: false,
      event: props.event,
      activity: props.activity,
      urllogin_bigmarker: null,
      error_bigmarker: null,
      contentDisplayed: null,

      //parametros de la lección almacenados en firestore
      habilitar_ingreso: 'close_metting_room',
      platform: null,
      chat: false,
      surveys: false,
      games: false,
      attendees: false,
      videoConferenceSize: 16,
      activeTab: 'chat',

      //Conference styles
      conferenceStyles: { zIndex: '9', width: '99vw', height: '100%' },

      //Encuesta seleccionada actualmente
      //Se deben pasar los metodos para set y unset del estado al componente SurveyForm
      currentSurvey: {},
    };
  }

  async setUpUserForConference() {
    const { userEntered } = this.props;

    let displayName = 'Anónimo';
    let email = 'anonimo@evius.co';

    if (userEntered) {
      displayName = userEntered.displayName || userEntered.names || displayName;
      if (userEntered.properties && userEntered.properties.casa) {
        displayName = userEntered.properties.casa + ' ' + displayName;
      }
      email = userEntered.email || email;
    }

    let urllogin_bigmarker = null;
    let error_bigmarker = null;
    if (this.state.event && this.state.event.event_platform === 'bigmarker') {
      const data = {
        id: this.props.activity.bigmaker_meeting_id,
        attendee_name: displayName,
        attendee_email: email,
        exit_uri: 'https://evius.co/landing/' + this.state.event._id,
      };

      let callresult = null;
      try {
        callresult = await API.post(`/api/integration/bigmaker/conferences/enter`, data);
        urllogin_bigmarker = callresult.data.enter_uri;
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          error_bigmarker = e.response.data.message;
        } else {
          error_bigmarker = e.message;
        }
      }
    }

    this.setState({
      userEntered,
      displayName,
      email,
      urllogin_bigmarker: urllogin_bigmarker,
      error_bigmarker: error_bigmarker,
    });
  }

  async componentDidMount() {
    try {
      await this.props.dispatch(fetchRol());
      const eventId = this.props.match.params.event;
      await this.props.dispatch(fetchPermissions(eventId));
      // const event = await EventsApi.getOne(eventId);
      // const eventWithExtraFields = this.addNewFieldsToEvent(event);
      // this.setState({ event: eventWithExtraFields, loading: false });
    } catch (e) {
      console.error(e.response);
      // this.setState({ timeout: true, loading: false });
    }

    this.setUpUserForConference();

    firestore
      .collection('events')
      .doc(this.state.event._id)
      .collection('activities')
      .doc(this.state.activity._id)
      .onSnapshot((response) => {
        const videoConference = response.data();

        this.setState({
          meeting_id: videoConference.meeting_id ? videoConference.meeting_id : this.props.meetingId,
          platform: videoConference.platform ? videoConference.platform : null,
          habilitar_ingreso: videoConference.habilitar_ingreso
            ? videoConference.habilitar_ingreso
            : 'closed_metting_room',
          chat: videoConference.tabs && videoConference.tabs.chat ? videoConference.tabs.chat : false,
          surveys: videoConference.tabs && videoConference.tabs.surveys ? videoConference.tabs.surveys : false,
          games: videoConference.tabs && videoConference.tabs.games ? videoConference.tabs.games : false,
          attendees: videoConference.tabs && videoConference.tabs.attendees ? videoConference.tabs.attendees : false,
        });
      });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.games !== this.state.games) {
      if (this.state.games) {
        this.changeContentDisplayed('games');
        this.handleActiveTab('games');
        this.setState({
          conferenceStyles: {
            zIndex: '90000',
            position: 'fixed',
            left: '0',
            bottom: '0',
            width: '170px',
          },
        });
      } else {
        this.handleActiveTab('chat');
        this.setState({ conferenceStyles: { zIndex: '9', width: '99vw', height: '100%' } });
      }
    }

    if (prevState.activeTab !== this.state.activeTab && this.state.activeTab === 'games') {
      this.setState({
        conferenceStyles: {
          zIndex: '90000',
          position: 'fixed',
          left: '0',
          bottom: '0',
          width: '170px',
        },
      });
    }

    if (prevState.activeTab !== this.state.activeTab && this.state.activeTab === 'chat') {
      this.setState({ conferenceStyles: { zIndex: '9', width: '99vw', height: '100%' } });
    }

    if (prevState.activeTab !== this.state.activeTab && this.state.activeTab === 'surveys') {
      this.changeContentDisplayed('surveys');
      this.setState({
        conferenceStyles: {
          zIndex: '90000',
          position: 'fixed',
          left: '0',
          bottom: '0',
          width: '170px',
        },
      });
    }

    if (prevState.activeTab !== this.state.activeTab && this.state.activeTab === 'games') {
      this.changeContentDisplayed('games');
    }

    if (
      prevState.activeTab !== this.state.activeTab &&
      (this.state.activeTab === 'chat' || this.state.activeTab === 'attendees')
    ) {
      this.changeContentDisplayed('conference');
    }

    if (prevProps.meetingId === this.props.meetingId) {
      return;
    }

    this.setUpUserForConference();
  }

  // Función full screen
  goFull = () => {
    this.setState({ isFull: true });
  };

  closeFull = () => {
    this.setState({ isFull: false });
  };

  // Función medium screen
  goMedium = () => {
    this.setState({
      isMedium: !this.state.isMedium,
      isMinimize: false,
    });
  };

  // Función minimize screen
  goMinimize = () => {
    this.setState({
      isMinimize: !this.state.isMinimize,
      isMedium: false,
    });
  };

  changeContentDisplayed = (contentName) => {
    this.setState({
      contentDisplayed: contentName,
    });
  };

  handleActiveTab = (tabKey) => {
    this.setState({ activeTab: tabKey });
  };

  handleConferenceStyles = () => {
    this.setState({ conferenceStyles: { zIndex: '9', width: '99vw', height: '100%' } });
    this.changeContentDisplayed(null);
  };

  mountCurrentSurvey = (survey) => {
    this.setState({ currentSurvey: survey });
  };

  unMountCurrentSurvey = () => {
    this.setState({ currentSurvey: null });
  };

  render() {
    const { toggleConference, event, activity } = this.props;
    const {
      url_conference,
      meeting_id,
      isMedium,
      isFull,
      isMinimize,
      displayName,
      email,
      chat,
      surveys,
      games,
      attendees,
      activeTab,
      conferenceStyles,
      platform,
    } = this.state;
    return (
      <div
        className={`content-zoom ${isMedium === true ? 'mediumScreen' : ''} ${
          isMinimize === true ? 'minimizeScreen' : ''
        }`}>
        <div className='buttons-header'>
          <div>
            <div className='title-header'>
              <span className='icon-live'>&#9673;</span>&nbsp;
              <span>Conferencia en vivo</span>
            </div>
          </div>

          <div>
            {/* botón pantalla completa */}
            <Button className='ant-btn-header' onClick={this.goFull}>
              <FullscreenOutlined />
            </Button>

            {/* botón pantalla minimizada */}
            <Button className='ant-btn-header' onClick={this.goMinimize}>
              <LineOutlined />
            </Button>

            {/* botón cerrar */}
            <Button className='ant-btn-header' onClick={() => toggleConference(false)}>
              <span className='icon-close'>&#10006;</span>
            </Button>
          </div>
        </div>

        <Fullscreen enabled={isFull} onChange={(isFull) => this.setState({ isFull })}>
          {this.state.event && platform === 'zoom' && (
            <iframe
              src={url_conference + meeting_id + `&userName=${displayName}` + `&email=${email}`}
              allow='autoplay; fullscreen; camera *;microphone *'
              allowUserMedia
              allowFullScreen
              className='iframe-zoom nuevo'>
              <p>Your browser does not support iframes.</p>
            </iframe>
          )}
          {/* VIMEO LIVESTREAMING */}
          {this.state.event && platform === 'vimeo' && (
            <Row className='platform-vimeo' style={{ display: 'contents' }}>
              <iframe
                src={`https://player.vimeo.com/video/${meeting_id}`}
                frameBorder='0'
                allow='autoplay; fullscreen; camera *;microphone *'
                allowFullScreen
                allowusermedia
                style={conferenceStyles}></iframe>

              {this.state.contentDisplayed && this.state.contentDisplayed == 'game' && (
                <iframe
                  src={
                    `https://castrolgame.netlify.app` +
                    (this.props.userEntered ? '?uid=' + this.props.userEntered._id : '')
                  }
                  frameBorder='0'
                  allow='autoplay; fullscreen; camera *;microphone *'
                  allowFullScreen
                  allowusermedia
                  style={{ zIndex: '9999', width: '150px', height: '100%' }}></iframe>
              )}

              {this.state.contentDisplayed && this.state.contentDisplayed == 'games' && (
                <iframe
                  src={
                    `https://juegocastrol2.netlify.app/` +
                    ('?uid=' +
                      (this.props.userEntered && this.props.userEntered._id
                        ? this.props.userEntered._id
                        : '5e9caaa1d74d5c2f6a02a3c2') +
                      '&displayName=' +
                      (displayName ? displayName : 'anonimo') +
                      '&email=' +
                      (email ? email : 'evius@evius.co'))
                  }
                  frameBorder='0'
                  allow='autoplay; fullscreen; camera *;microphone *'
                  allowFullScreen
                  allowusermedia
                  style={{ zIndex: '10', width: '99vw', height: '100%' }}></iframe>
              )}

              {this.state.contentDisplayed && this.state.contentDisplayed == 'surveys' && (
                <div style={{ width: '100%' }}>
                  <SurveyForm
                    event={event}
                    currentUser={this.props.userEntered}
                    activity={activity}
                    availableSurveysBar={true}
                    style={{ zIndex: 9999, width: '99vw', height: '100%' }}
                    mountCurrentSurvey={this.mountCurrentSurvey}
                    unMountCurrentSurvey={this.unMountCurrentSurvey}
                  />
                </div>
              )}

              {/* Retiro temporal del chat se ajusta video a pantalla completa */}
              <ConferenceTabs
                meeting_id={meeting_id}
                activity={activity}
                event={event}
                currentUser={this.props.userEntered}
                changeContentDisplayed={this.changeContentDisplayed}
                chat={chat}
                surveys={surveys}
                games={games}
                attendees={attendees}
                activeTab={activeTab}
                handleActiveTab={this.handleActiveTab}
                handleConferenceStyles={this.handleConferenceStyles}
                currentSurvey={this.state.currentSurvey}
              />
            </Row>
          )}

          {this.state.event && platform === 'bigmarker' && (
            <>
              {!this.state.error_bigmarker && !this.state.urllogin_bigmarker && <Spin tip='Loading...'></Spin>}
              {this.state.error_bigmarker && (
                <div>
                  {' '}
                  <Result status='warning' title={this.state.error_bigmarker} />
                </div>
              )}
              {!this.state.error_bigmarker && this.state.urllogin_bigmarker && (
                <iframe
                  id='conference'
                  src={this.state.urllogin_bigmarker} //"https://www.bigmarker.com/conferences/1c3e6af84135/api_attend"
                  frameBorder='0'
                  allow='autoplay; fullscreen; camera *;microphone *'
                  allowFullScreen
                  allowusermedia
                  className='iframe-zoom nuevo'></iframe>
              )}
            </>
          )}
        </Fullscreen>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  permissions: state.permissions,
});

export default connect(mapStateToProps)(ZoomComponent);
