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
      dataGamification: null,
      currentPage: 1,
      graphicsFrame,
      chart: {},
      chartCreated: false,
    };
  }

  loadData = async () => {
    const { eventId, data } = this.props;
    this.setState({ dataGamification: data }, this.mountChart);
  };

  mountChart = async () => {
    const { eventId } = this.props;
    let { graphicsFrame, chartCreated, chart, dataGamification } = this.state;
    // Se ejecuta servicio para tener la informacion del ranking
    let { verticalBar } = graphicsFrame;
    let { userList, pointsList } = dataGamification;

    // Se condiciona si el grafico ya fue creado
    // En caso de que aun no este creado se crea, de lo contrario se actualizara
    if (!chartCreated) {
      // Se asignan los valores obtenidos de los servicios
      // El nombre de las opciones y el conteo de las opciones
      verticalBar.data.labels = userList;
      verticalBar.data.datasets[0].data = Object.values(pointsList || []);
      verticalBar.data.datasets[0].label = "Ranking";

      // Se obtiene el canvas del markup y se utiliza para crear el grafico
      const canvas = document.getElementById("chart").getContext("2d");
      const chart = new Chart(canvas, verticalBar);

      this.setState({ verticalBar, chart, chartCreated: true });
    } else {
      // Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
      chart.data.labels = userList;
      chart.data.datasets[0].data = Object.values(pointsList || []);
      verticalBar.data.datasets[0].label = "Ranking";

      chart.update();

      this.setState({ chart });
    }
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (data !== prevProps.data) {
      this.loadData();
    }
  }

  render() {
    let { dataGamification, currentPage, verticalBar, referenceChart } = this.state;
    const { showListSurvey } = this.props;

    if (dataGamification !== null)
      return (
        <Card style={{ backgroundColor: "rgba(227, 227, 227,0.3)" }}>
          <canvas id="chart"></canvas>
        </Card>
      );

    return <Spin></Spin>;
  }
}

export default Graphics;
