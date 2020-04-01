import React, { Component } from "react";
import Moment from "moment";
import SearchComponent from "../../shared/searchTable";
import API, { AgendaApi } from "../../../helpers/request";

import SurveyComponent from "./surveyComponent";

class SurveyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return <SurveyComponent />;
  }
}

export default SurveyForm;
