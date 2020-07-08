import React, { Component } from "react";
import { Button, Card } from "antd";
import Fullscreen from "react-full-screen";
import { FullscreenOutlined, SwitcherOutlined, LineOutlined } from "@ant-design/icons";
import SurveyComponent from "../surveys";

const closeFullScreen = {
  position: "absolute",
  top: "7px",
  right: "7px",
  bottom: 0,
};

const surveyButtons = {
  text: {
    color: "#42A8FC",
  }
};

export default class ZoomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_conference: "284693751",
      url_conference: `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`,
      meeting_id: null,
      userEntered: null,
      isFull: false,
      isMedium: false,
      isMinimize: false,
      displayName: "",
      email: null,
      event: props.event,
      activity: props.activity,
    };
  }
  async componentDidMount() {


    let { meetingId, userEntered } = this.props;

    let displayName = "Anónimo";
    let email = "anonimo@evius.co";
    if (userEntered) {
      displayName = userEntered.displayName || userEntered.names || displayName;
      email = userEntered.email || email
    }

    this.setState({
      meeting_id: meetingId,
      userEntered,
      displayName, email
    });

  }


  componentDidUpdate(prevProps) {

    const { meetingId, userEntered } = this.props;

    if (prevProps.meetingId !== meetingId) {
      let displayName = "Anónimo";
      let email = "anonimo@evius.co";
      if (userEntered) {
        displayName = userEntered.displayName || userEntered.names || displayName;
        email = userEntered.email || email
      }

      this.setState({ meeting_id: meetingId, userEntered, displayName, email });
    }
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
    let { url_conference, meeting_id, userEntered, isMedium, isFull, isMinimize, displayName, email } = this.state;
    return (
      <div
        className={`content-zoom ${isMedium === true ? "mediumScreen" : ""} ${
          isMinimize === true ? "minimizeScreen" : ""
          }`}>

        <div className="buttons-header">
          <div>
            <div className="title-header">
              <span className="icon-live">&#9673;</span>&nbsp;
              <span>Conferencia en vivo</span>
            </div>
          </div>

          <div>
            {/* botón pantalla completa */}
            <Button className="ant-btn-header" onClick={this.goFull}>
              <FullscreenOutlined />
            </Button>

            {/* botón pantalla minimizada */}
            <Button className="ant-btn-header" onClick={this.goMinimize}>
              <LineOutlined />
            </Button>

            {/* botón cerrar */}
            <Button className="ant-btn-header" onClick={() => toggleConference(false)}>
              <span className="icon-close">&#10006;</span>
            </Button>
          </div>
        </div>

        <Fullscreen enabled={isFull} onChange={(isFull) => this.setState({ isFull })}>
          {
            <SurveyComponent event={event} activity={activity} availableSurveysBar={true} />
          }



          {/* ZOOOM IFRAME */}
          {<iframe
            src={url_conference + meeting_id + `&userName=${displayName}` + `&email=${email}`}
            allow="autoplay; fullscreen; camera *;microphone *;usermedia"
            allowusermedia
            allowFullScreen
            className="iframe-zoom nuevo">
            <p>Your browser does not support iframes.</p>
          </iframe>
          }

          {/** VIMEO LIVESTREAMING only chat not interactive */}
          {/* <div style={{ "padding": "39.3% 0 0 0", "width": "100%", "position": "relative" }}>
            <iframe
              src="https://vimeo.com/event/156201/embed/ea3234a09b"
              frameborder="0"
              allow="autoplay; fullscreen; camera *;microphone *;usermedia"
              allowFullScreen
              allowusermedia
              style={{ "position": "absolute", "top": 0, "left": 0, "width": "70%", "height": "100%" }}
            ></iframe>

            <iframe
              src="https://vimeo.com/event/156201/chat/ea3234a09b"
              style={{ "position": "absolute", "top": 0, "right": 0, "width": "30%", "height": "100%" }}
              frameborder=""
            ></iframe>
          </div> */}
        </Fullscreen>
      </div>
    );
  }
}
