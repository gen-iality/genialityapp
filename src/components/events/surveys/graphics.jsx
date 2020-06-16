import React, { Component } from "react";

import { Bar } from "react-chartjs-2";
import { Pagination, Spin, Card, PageHeader } from "antd";
import Chart from "chart.js";

import { SurveyAnswers } from "./services";
import { SurveysApi } from "../../../helpers/request";
import { graphicsFrame } from "./frame";

class Graphics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSurvey: {},
      currentPage: 1,
      graphicsFrame,
      chart: {},
      chartCreated: false,
    };
  }

  // Funcion que permite dividir una cadena
  divideString = (string) => {
    let separatedByWhiteSpace = string.split(/\s/);
    let times;
    let text = [];

    if (string.length > 140) {
      times = 3;
    } else {
      times = 2;
    }

    for (let index = times; index > 0; index--) {
      let m1 = separatedByWhiteSpace.splice(0, separatedByWhiteSpace.length / index);
      m1 = m1.join(" ");
      text.push(m1);
    }
    return text;
  };

  loadData = async () => {
    const { idSurvey, eventId } = this.props;
    let { dataSurvey } = this.state;

    dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
    this.setState({ dataSurvey }, this.mountChart);
  };

  setCurrentPage = (page) => {
    this.setState({ currentPage: page }, this.mountChart);
  };

  mountChart = async () => {
    const { idSurvey, eventId } = this.props;
    let { dataSurvey, currentPage, graphicsFrame, chartCreated, chart } = this.state;
    let { horizontalBar } = graphicsFrame;
    let { questions } = dataSurvey;

    // Se ejecuta servicio para tener el conteo de las respuestas
    let response = await SurveyAnswers.getAnswersQuestion(idSurvey, questions[currentPage - 1].id, eventId);
    let { options, answer_count } = response;

    let formatterTitle = options.title;
    if (options.title && options.title.length > 70) formatterTitle = this.divideString(options.title);

    // Se condiciona si el grafico ya fue creado
    // En caso de que aun no este creado se crea, de lo contrario se actualizara
    if (!chartCreated) {
      // Se asignan los valores obtenidos de los servicios
      // El nombre de las opciones y el conteo de las opciones
      horizontalBar.data.labels = options.choices;
      horizontalBar.data.datasets[0].data = Object.values(answer_count || []);
      horizontalBar.options.title.text = formatterTitle;

      // Se obtiene el canvas del markup y se utiliza para crear el grafico
      const canvas = document.getElementById("chart").getContext("2d");
      const chart = new Chart(canvas, horizontalBar);

      this.setState({ horizontalBar, chart, chartCreated: true });
    } else {
      // Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
      chart.data.labels = options.choices;
      chart.data.datasets[0].data = Object.values(answer_count || []);
      chart.options.title.text = formatterTitle;

      chart.update();

      this.setState({ chart });
    }
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    let { dataSurvey, currentPage, horizontalBar, referenceChart } = this.state;
    const { showListSurvey } = this.props;

    if (dataSurvey.questions)
      return (
        <>
          <Card className="survyCard">
            <PageHeader
              className="site-page-header"
              onBack={() => showListSurvey()}
              title=""
              subTitle="Regresar a las encuestas"
            />
            <Card>
              <canvas id="chart"></canvas>
            </Card>
            <br />
            <Pagination
              defaultCurrent={currentPage}
              total={dataSurvey.questions.length * 10}
              onChange={this.setCurrentPage}
            />
          </Card>
        </>
      );

    return <Spin></Spin>;
  }
}

export default Graphics;
