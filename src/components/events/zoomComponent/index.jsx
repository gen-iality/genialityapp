import React, { Component } from "react";
import { Button } from "antd";
import Fullscreen from "react-full-screen";
import { CloseSquareOutlined, FullscreenOutlined, SwitcherOutlined } from "@ant-design/icons";
export default class ZoomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_conference: "284693751",
      url_conference: `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`,
      meeting_id: null,
      userEntered: null,
      isFull: false,
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


  // Funcion full screen
  goFull = () => {
    this.setState({ isFull: true });
  }


  render() {
    const { hideIframe } = this.props;
    let { url_conference, meeting_id, userEntered } = this.state;
    return (
      <div className="content-zoom">

        {/* boton pantalla completa */}
        <Button onClick={this.goFull}><FullscreenOutlined /></Button>

        {/* boton pantalla media */}
        <Button onClick={this.goMedium}><SwitcherOutlined /></Button>

        {/* boton cerrar */}
        <Button onClick={() => hideIframe(false)}><CloseSquareOutlined /></Button>

        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({ isFull })}
        >
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
