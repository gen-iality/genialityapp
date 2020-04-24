import React, { Component } from "react";

export default class ZoomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_conference: "284693751",
      url_conference: `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`,
      meeting_id: null
    };
  }
  componentDidMount() {
    let { meetingId } = this.props;
    this.setState({ meeting_id: meetingId });
  }

  componentDidUpdate(prevProps) {
    const { meetingId } = this.props;
    if (prevProps.meetingId !== meetingId) {
      this.setState({ meeting_id: meetingId });
    }
  }

  render() {
    const { hideIframe } = this.props;
    let { url_conference, meeting_id } = this.state;
    return (
      <div className="content-zoom">
        <button onClick={() => hideIframe(false)}>-</button>
        <iframe src={url_conference + meeting_id} allow="camera *;microphone *" allowusermedia className="iframe-zoom">
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    );
  }
}
