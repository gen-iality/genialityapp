import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import { Pagination } from "antd";
import Chart from "chart.js";

import { SurveyAnswers } from "./services";
import { SurveysApi } from "../../../helpers/request";
import { dataFrame } from "./frame";

class Graphics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSurvey: {},
      currentPage: 1,
      dataFrame,
      chart: {},
      chartCreated: false
    };
  }

  loadData = async () => {
    const { idSurvey, eventId } = this.props;
    let { dataSurvey } = this.state;

    dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
    this.setState({ dataSurvey }, this.mountChart);
  };

  setCurrentPage = page => {
    this.setState({ currentPage: page }, this.mountChart);
  };

  mountChart = async () => {
    const { idSurvey, eventId } = this.props;
    let { dataSurvey, currentPage, dataFrame, chartCreated, chart } = this.state;
    let { questions } = dataSurvey;

    let response = await SurveyAnswers.getAnswersQuestion(idSurvey, questions[currentPage - 1].id, eventId);
    let { options, answer_count } = response;

    if (!chartCreated) {
      dataFrame.data.labels = options.choices;
      dataFrame.data.datasets[0].data = Object.values(answer_count);

      const canvas = document.getElementById("chart").getContext("2d");
      const chart = new Chart(canvas, dataFrame);

      this.setState({ dataFrame, chart, chartCreated: true });
    } else {
      chart.data.labels = options.choices;
      chart.data.datasets[0].data = Object.values(answer_count);
      chart.update();
      this.setState({ chart });
    }
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    let { dataSurvey, currentPage, dataFrame, referenceChart } = this.state;

    if (dataSurvey.questions)
      return (
        <div>
          <canvas id="chart"></canvas>
          <Pagination
            defaultCurrent={currentPage}
            total={dataSurvey.questions.length * 10}
            onChange={this.setCurrentPage}
          />
        </div>
      );

    return <h1>Esto hay que cambiarlo luego</h1>;
  }
}

export default Graphics;
