import React, { Component } from "react";
import { Button } from "antd";
import Fullscreen from "react-full-screen";
import { FullscreenOutlined, SwitcherOutlined, LineOutlined } from "@ant-design/icons";

const closeFullScreen = {
  position: "absolute",
  top: "7px",
  right: "7px",
  bottom: 0
}

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
    };
  }
  componentDidMount() {
    let { meetingId, userEntered } = this.props;
    this.setState({ meeting_id: meetingId, userEntered });
  }

  componentDidUpdate(prevProps) {
    const { meetingId, userEntered } = this.props;
    if (prevProps.meetingId !== meetingId) {
      this.setState({ meeting_id: meetingId, userEntered });
    }
  }


  // Función full screen
  goFull = () => {
    this.setState({ isFull: true });
  }

  closeFull = () => {
    this.setState({ isFull: false });
  }


  // Función medium screen
  goMedium = () => {
    this.setState({
      isMedium: !this.state.isMedium,
      isMinimize: false
    });
  }

  // Función minimize screen
  goMinimize = () => {
    this.setState({
      isMinimize: !this.state.isMinimize,
      isMedium: false
    });
  }


  render() {
    const { hideIframe } = this.props;
    let { url_conference, meeting_id, userEntered, isMedium, isFull, isMinimize } = this.state;
    return (
      <div className={`content-zoom ${isMedium === true ? 'mediumScreen' : ''} ${isMinimize === true ? 'minimizeScreen' : ''}`} >

        <div className="buttons-header">
          <div>

            <div className="title-header">
              <span className="icon-live" >&#9673;</span>&nbsp;
              <span>Conferencia en vivo</span>
            </div>
          </div>

          <div>

            {/* botón pantalla completa */}
            <Button onClick={this.goFull}><FullscreenOutlined /></Button>

            {/* botón pantalla media */}
            <Button onClick={this.goMedium}><SwitcherOutlined /></Button>

            {/* botón pantalla minimizada */}
            <Button onClick={this.goMinimize}><LineOutlined /></Button>

            {/* botón cerrar */}
            <Button onClick={() => hideIframe(false)}><span className="icon-close" >&#10006;</span></Button>
          </div>
        </div>

        <Fullscreen
          enabled={isFull}
          onChange={isFull => this.setState({ isFull })}
        >
          {(isFull === true ?
            <Button
              type="primary"
              danger
              style={closeFullScreen}
              onClick={this.closeFull}
            >
              <span className="icon-close" >&#10006;</span>
            </Button> : null
          )}
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
