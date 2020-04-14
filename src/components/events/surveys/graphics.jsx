import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import { Pagination } from "antd";

import { SurveyAnswers } from "./services";
import { SurveysApi } from "../../../helpers/request";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

class Graphics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSurvey: {},
      currentPage: 1
    };
  }

  loadData = async () => {
    const { idSurvey, eventId } = this.props;
    let { dataSurvey } = this.state;

    dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
    this.setState({ dataSurvey }, () => this.mountChart);
  };

  mountChart = async page => {
    const { idSurvey } = this.props;
    let { dataSurvey, currentPage } = this.state;

    let { questions } = dataSurvey;

    let respuesta = await SurveyAnswers.getAnswersQuestion(idSurvey, questions[currentPage].id);

    console.log(respuesta);
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    let { dataSurvey, currentPage } = this.state;
    console.log(this.state);
    if (dataSurvey.questions)
      return (
        <div>
          <Bar data={data} />
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
