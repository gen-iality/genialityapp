import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import { Pagination, Spin } from "antd";
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

    // Se ejecuta servicio para tener el conteo de las respuestas
    let response = await SurveyAnswers.getAnswersQuestion(idSurvey, questions[currentPage - 1].id, eventId);
    let { options, answer_count } = response;

    // Se condiciona si el grafico ya fue creado
    // En caso de que aun no este creado se crea, de lo contrario se actualizara
    if (!chartCreated) {
      // Se asignan los valores obtenidos de los servicios
      // El nombre de las opciones y el conteo de las opciones
      dataFrame.data.labels = options.choices;
      dataFrame.data.datasets[0].data = Object.values(answer_count);
      dataFrame.data.datasets[0].label = options.title;

      // Se obtiene el canvas del markup y se utiliza para crear el grafico
      const canvas = document.getElementById("chart").getContext("2d");
      const chart = new Chart(canvas, dataFrame);

      this.setState({ dataFrame, chart, chartCreated: true });
    } else {
      // Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
      chart.data.labels = options.choices;
      chart.data.datasets[0].data = Object.values(answer_count);
      dataFrame.data.datasets[0].label = options.title;

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

    return <Spin></Spin>;
  }
}

export default Graphics;
