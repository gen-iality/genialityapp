import React, { Component } from 'react';
import { Button, Result, Spin, Row } from 'antd';
import Fullscreen from 'react-full-screen';
import { FullscreenOutlined, LineOutlined } from '@ant-design/icons';
import SurveyComponent from '../surveys';
import API from '../../../helpers/request';
import ConferenceTabs from './conferenceTabs';

import { firestore } from '../../../helpers/firebase';
export default class ZoomComponent extends Component {
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

      //parametros de la actividad almacenados en firestore
      habilitar_ingreso: 'close_metting_room',
      chat: false,
      surveys: false,
      games: false,
      attendees: false,
      videoConferenceSize: 16,
      activeTab: 'chat',
    };
  }

  async setUpUserForConference() {
    let { meetingId, userEntered } = this.props;

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
      let data = {
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
      meeting_id: meetingId,
      userEntered,
      displayName,
      email,
      urllogin_bigmarker: urllogin_bigmarker,
      error_bigmarker: error_bigmarker,
    });
  }

  async componentDidMount() {
    this.setUpUserForConference();

    firestore
      .collection('events')
      .doc(this.state.event._id)
      .collection('activities')
      .doc(this.state.activity._id)
      .onSnapshot((response) => {
        const videoConference = response.data();

        this.setState({
          habilitar_ingreso: videoConference.habilitar_ingreso
            ? videoConference.habilitar_ingreso
            : 'close_metting_room',
          chat: videoConference.tabs && videoConference.tabs.chat ? videoConference.tabs.chat : true,
          surveys: videoConference.tabs && videoConference.tabs.surveys ? videoConference.tabs.surveys : true,
          games: videoConference.tabs && videoConference.tabs.games ? videoConference.tabs.games : false,
          attendees: videoConference.tabs && videoConference.tabs.attendees ? videoConference.tabs.attendees : false,
          // videoConferenceSize:
          //   (videoConference.tabs && videoConference.tabs.chat) ||
          //   videoConference.tabs.surveys ||
          //   videoConference.tabs.games ||
          //   videoConference.tabs.attendees
          //     ? 16
          //     : 24,
        });
      });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.games !== this.state.games) {
      console.log('el estado del juego cambio');
      if (this.state.games) {
        this.changeContentDisplayed('games');
        this.handleActiveTab('games');
      } else {
        this.changeContentDisplayed('conference');
      }
    }

    if (prevState.activeTab !== this.state.activeTab) {
      console.log('cambio active tab', this.state.activeTab);
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

  render() {
    const { toggleConference, event, activity } = this.props;
    let {
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
    } = this.state;
    const platform = activity.platform || this.state.event.event_platform;
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
              {/* <Col
                className='col-xs'
                xs={24}
                sm={24}
                md={24}
                lg={
                  this.state.event._id !== '5f456bef532c8416b97e9c82' &&
                  this.state.event._id !== '5f8a0fa58a97e06e371538b4'
                    ? 16
                    : 24
                }> */}
              {(!this.state.contentDisplayed || this.state.contentDisplayed == 'conference') && (
                <iframe
                  src={`https://player.vimeo.com/video/${activity.vimeo_id}`}
                  frameBorder='0'
                  allow='autoplay; fullscreen; camera *;microphone *'
                  allowFullScreen
                  allowusermedia
                  style={{ width: '99vw', height: '100%' }}></iframe>
              )}

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
                  style={{ zIndex: 9999, width: '99vw', height: '100%' }}></iframe>
              )}

              {this.state.contentDisplayed && this.state.contentDisplayed == 'games' && (
                <iframe
                  src={
                    `https://juegocastrol2.netlify.app/` +
                    (this.props.userEntered
                      ? '?uid=' + this.props.userEntered._id + '&displayName=' + displayName + '&email' + email
                      : '')
                  }
                  frameBorder='0'
                  allow='autoplay; fullscreen; camera *;microphone *'
                  allowFullScreen
                  allowusermedia
                  style={{ zIndex: 9999, width: '99vw', height: '100%' }}></iframe>
              )}

              {this.state.contentDisplayed && this.state.contentDisplayed == 'surveys' && (
                <SurveyComponent
                  event={event}
                  activity={activity}
                  availableSurveysBar={true}
                  style={{ zIndex: 9999, width: '99vw', height: '100%' }}
                />
              )}

              {/* Retiro temporal del chat se ajusta video a pantalla completa */}
              <ConferenceTabs
                activity={activity}
                event={event}
                currentUser={this.props.userEntered}
                changeContentDisplayed={this.changeContentDisplayed}
                chat={chat}
                surveys={surveys}
                games={games}
                attendees={attendees}
                handleActiveTab={this.handleActiveTab}
              />
            </Row>
          )}

          {/* style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", margin: 0, padding: 0 }}*/}
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
