import React, { Component } from "react";

export default class ZoomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_conference: "284693751",
      url_conference: `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`
    };
  }
  componentDidUpdate(prevProps) {}

  render() {
    const { hideConference } = this.props;
    let { url_conference, id_conference } = this.state;
    return (
      <div>
        <h1>Iframe zoom</h1>
        <button onClick={hideConference}>
          <iframe src={url_conference}>
            <p>Your browser does not support iframes.</p>
          </iframe>
        </button>
      </div>
    );
  }
}
