import React, { Component } from "react";

export default class ZoomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_conference: "284693751",
      url_conference: `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`,
      meeting_id: null,
      userEntered: null,
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

  render() {
    const { hideIframe } = this.props;
    let { url_conference, meeting_id, userEntered } = this.state;
    return (
      <div className="content-zoom">
        <button onClick={() => hideIframe(false)}>-</button>
        <iframe
          src={url_conference + meeting_id + `&userName=${userEntered}`}
          allow="camera *;microphone *"
          allowusermedia
          className="iframe-zoom nuevo">
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    );
  }
}
