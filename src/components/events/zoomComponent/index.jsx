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
  position: "absolute",
  top: "37px",
  left: "7px",
  bottom: 0,
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
      activitySurveyList: [],
      surveyVisible: false
    };
  }
  componentDidMount() {
    let { meetingId, userEntered, activitySurveyList } = this.props;
    this.setState({ meeting_id: meetingId, userEntered, activitySurveyList });
  }

  componentDidUpdate(prevProps) {
    const { meetingId, userEntered, activitySurveyList } = this.props;
    if (prevProps.meetingId !== meetingId || prevProps.activitySurveyList !== activitySurveyList) {
      this.setState({ meeting_id: meetingId, userEntered, activitySurveyList });
    }
  }

  openSurvey = (currentSurvey) => {
    console.log("Esta es la encuesta actual:", currentSurvey);
  };

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

  surveyVisible = () => {
    this.setState({
      surveyVisible: !this.state.surveyVisible
    });
  };

  render() {
    const { hideIframe, event } = this.props;
    let { url_conference, meeting_id, userEntered, isMedium, isFull, isMinimize, activitySurveyList, surveyVisible } = this.state;
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
            <Button onClick={this.goFull}>
              <FullscreenOutlined />
            </Button>

            {/* botón pantalla media */}
            <Button onClick={this.goMedium}>
              <SwitcherOutlined />
            </Button>

            {/* botón pantalla minimizada */}
            <Button onClick={this.goMinimize}>
              <LineOutlined />
            </Button>

            {/* botón cerrar */}
            <Button onClick={() => hideIframe(false)}>
              <span className="icon-close">&#10006;</span>
            </Button>
          </div>
        </div>

        <Fullscreen enabled={isFull} onChange={(isFull) => this.setState({ isFull })}>
          {activitySurveyList && (
            <div>
              <div style={surveyButtons}>
                {/* {activitySurveyList.map((survey, index) => ( 
                 // <Button key={index} onClick={() => this.openSurvey(survey)}>
                  //   {survey.survey}
                  // </Button> */}
                <Button onClick={this.surveyVisible}>
                  {!surveyVisible ?
                    <span>Ver <b style={surveyButtons.text}>&nbsp;{activitySurveyList.length}&nbsp;</b> encuestas disponibles.</span>
                    :
                    "Ocultar"}
                </Button>
                {/* ))} */}
                {surveyVisible && (
                  <Card>
                    <SurveyComponent event={event} activitySurveyList={activitySurveyList.data} />
                  </Card>
                )}
              </div>
            </div>
          )}

          {isFull === true ? (
            <Button type="primary" danger style={closeFullScreen} onClick={this.closeFull}>
              <span className="icon-close">&#10006;</span>
            </Button>
          ) : null}
          <iframe
            src={url_conference + meeting_id + `&userName=${userEntered}`}
            allow="camera *;microphone *"
            allowusermedia
            className="iframe-zoom nuevo">
            <p>Your browser does not support iframes.</p>
          </iframe>
        </Fullscreen>
      </div>
    );
  }
}
