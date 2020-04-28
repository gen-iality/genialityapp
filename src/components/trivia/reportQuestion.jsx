import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

import EventContent from "../events/shared/content";

class ReportQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameQuestion: "",
    };
  }

  loadData = () => {
    const { location, match } = this.props;
    // console.log(props, props.match, props.match.params);
    this.setState({ nameQuestion: location.state.titleQuestion });
  };

  componentDidMount() {
    this.loadData();
  }

  goBack = () => this.props.history.goBack();

  render() {
    let { nameQuestion } = this.state;
    return (
      <Fragment>
        <EventContent title={nameQuestion} closeAction={this.goBack}>
          <h1>ReportQuestion</h1>
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(ReportQuestion);
