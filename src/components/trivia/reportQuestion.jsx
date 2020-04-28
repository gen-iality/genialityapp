import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Moment from "moment";

import { getAnswersByQuestion } from "./services";

import EventContent from "../events/shared/content";

import { Table } from "antd";

const columns = [
  {
    title: "Creado",
    dataIndex: "created",
    key: "created",
  },
  {
    title: "Nombre",
    dataIndex: "id_user",
    key: "id_user",
  },
  {
    title: "Respuesta",
    dataIndex: "response",
    key: "response",
  },
];
class ReportQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameQuestion: "",
      listOfUserResponse: [],
    };
  }

  loadData = async () => {
    console.log(this.props);
    const { location, match, event } = this.props;
    // console.log(props, props.match, props.match.params);
    this.setState({ nameQuestion: location.state.titleQuestion });
    let response = await getAnswersByQuestion(location.state.surveyId, match.params.id);
    this.setState({ listOfUserResponse: response });
  };

  componentDidMount() {
    this.loadData();
  }

  goBack = () => this.props.history.goBack();

  render() {
    let { nameQuestion, listOfUserResponse } = this.state;
    return (
      <Fragment>
        <EventContent title={nameQuestion} closeAction={this.goBack}>
          <h1>ReportQuestion</h1>
          <Table dataSource={listOfUserResponse} columns={columns} />;
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(ReportQuestion);
