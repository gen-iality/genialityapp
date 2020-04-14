import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import { Pagination } from "antd";

import { SurveyAnswers } from "./services";
import { SurveysApi } from "../../../helpers/request";
import { dataFrame } from "./frame";

class Graphics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSurvey: {},
      currentPage: 1,
      dataFrame
    };
    this.chartReference = React.createRef();
  }

  loadData = async () => {
    const { idSurvey, eventId } = this.props;
    let { dataSurvey } = this.state;

    dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
    this.setState({ dataSurvey }, () => this.mountChart);
  };

  mountChart = async page => {
    const { idSurvey, eventId } = this.props;
    let { dataSurvey, currentPage, dataFrame } = this.state;

    let { questions } = dataSurvey;

    let response = await SurveyAnswers.getAnswersQuestion(idSurvey, questions[currentPage].id, eventId);
    let { options, answer_count } = response;

    dataFrame.labels = options.choices;
    dataFrame.datasets.data = Object.values(answer_count);

    this.setState({ dataFrame });
  };

  componentDidMount() {
    this.loadData();
    console.log(this.chartReference); // returns a Chart.js instance reference
  }

  render() {
    let { dataSurvey, currentPage, dataFrame, referenceChart } = this.state;
    console.log(this.state);
    if (dataSurvey.questions)
      return (
        <div>
          <Bar data={dataFrame} ref={this.chartReference} />
          <Pagination
            defaultCurrent={currentPage}
            total={dataSurvey.questions.length * 10}
            onChange={this.mountChart}
          />
        </div>
      );

    return <h1>Esto hay que cambiarlo luego</h1>;
  }
}

export default Graphics;
