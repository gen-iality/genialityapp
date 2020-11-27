import React, { Component } from 'react';
import { Button, Result, Spin, Row, Col } from 'antd';
import Fullscreen from 'react-full-screen';
import { FullscreenOutlined, LineOutlined } from '@ant-design/icons';
import SurveyComponent from '../surveys';
import API from '../../../helpers/request';

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
      event: props.event,
      activity: props.activity,
      urllogin_bigmarker: null,
      error_bigmarker: null,
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
  }

  async componentDidUpdate(prevProps) {
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

  render() {
    const { toggleConference, event, activity } = this.props;
    let { url_conference, meeting_id, isMedium, isFull, isMinimize, displayName, email } = this.state;
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
            <Row className='platform-vimeo'>
              <Col
                className='col-xs'
                xs={24}
                sm={24}
                md={24}
                lg={
                  this.state.event._id !== '5f456bef532c8416b97e9c82' &&
                  this.state.event._id !== '5f8a0fa58a97e06e371538b4'
                    ? 16
                    : 24
                }>
                <iframe
                  src={`https://player.vimeo.com/video/${activity.vimeo_id}`}
                  frameBorder='0'
                  allow='autoplay; fullscreen; camera *;microphone *'
                  allowFullScreen
                  allowUserMedia
                  style={{ width: '99vw', height: '100%' }}></iframe>
              </Col>

              {/* Retiro temporal del chat se ajusta video a pantalla completa*/}

              {this.state.event._id !== '5f456bef532c8416b97e9c82' &&
                this.state.event._id !== '5f8a0fa58a97e06e371538b4' && (
                  <Col className='col-xs' xs={24} sm={24} md={24} lg={8}>
                    <iframe
                      src={`https://vimeo.com/live-chat/${activity.vimeo_id}`}
                      style={{ width: '99vw', height: '100%', padding: '2px' }}
                      frameBorder='0'></iframe>
                  </Col>
                )}
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
                  allowFullscreen
                  allowusermedia
                  className='iframe-zoom nuevo'></iframe>
              )}
            </>
          )}
          {<SurveyComponent event={event} activity={activity} availableSurveysBar={true} />}
        </Fullscreen>
      </div>
    );
  }
}
