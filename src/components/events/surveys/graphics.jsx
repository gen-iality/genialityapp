import 'chartjs-plugin-datalabels';
import React, { Component } from 'react';
import { Pagination, Spin, Card, Button } from 'antd';
import { ArrowLeftOutlined, LeftCircleFilled } from '@ant-design/icons';

import Chart from 'chart.js';

import { SurveyAnswers } from './services';
import { SurveysApi, UsersApi } from '../../../helpers/request';
import { graphicsFrame } from './frame';

class Graphics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSurvey: {},
      currentPage: 1,
      graphicsFrame,
      chart: {},
      chartCreated: false,
      usersRegistered: 0,
      titleQuestion: ''
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
      m1 = m1.join(' ');
      text.push(m1);
    }
    return text;
  };

  loadData = async () => {
    const { idSurvey, eventId } = this.props;
    const response = await SurveysApi.getOne(eventId, idSurvey);
    const usersRegistered = await UsersApi.getAll(this.props.eventId);
    let totalUsersRegistered = 0;

    //Se realiza sumatoria de usuarios checkeados para realizar calculo de porcentaje
    for (let i = 0; usersRegistered.data.length > i; i++) {
      if (usersRegistered.data[i].checkedin_at) {
        totalUsersRegistered = totalUsersRegistered + 1;
      }
    }

    this.setState({ dataSurvey: response, usersRegistered: totalUsersRegistered }, this.mountChart);
  };

  setCurrentPage = (page) => {
    this.setState({ currentPage: page }, this.mountChart);
  };

  updateData = ({ options, answer_count }) => {
    let { graphicsFrame, chartCreated, chart } = this.state;
    let { horizontalBar } = graphicsFrame;
    const { operation } = this.props;

    let totalPercentResponse = {};
    //se realiza iteracion para calcular porcentaje
    for (let i in answer_count) {
      switch (operation) {
        case 'onlyCount':
          totalPercentResponse[i] = answer_count[i][0];
          break;
        case 'participationPercentage':
          totalPercentResponse[i] = answer_count[i][1];
          break;
      }
    }

    let generatedlabels = [];
    //Se iguala options.choices[a] a una cadena string dinamica para agregar la cantidad de votos de la respuesta
    for (let a = 0; options.choices.length > a; a++) {
      // options.choices[a] = `${options.choices[a]}:` + `${answer_count[a]} Voto(s): ${totalPercentResponse[a]} %`
      switch (operation) {
        case 'onlyCount':
          generatedlabels[a] =
            answer_count && answer_count[a] ? options.choices[a] + ` ${answer_count[a][0]} Voto(s)` : '0 Votos';
          break;
        case 'participationPercentage':
          generatedlabels[a] =
            answer_count && answer_count[a]
              ? ` ${answer_count[a][0]} Voto(s), ${answer_count[a][1]}% \n ${options.choices[a]}`
              : '0 Votos';
          break;
      }
    }

    let formatterTitle = options.title;
    this.setState({ titleQuestion: formatterTitle });
    if (options.title && options.title.length > 70) formatterTitle = this.divideString(options.title);

    // Se condiciona si el grafico ya fue creado
    // En caso de que aun no este creado se crea, de lo contrario se actualizara
    if (!chartCreated) {
      // Se asignan los valores obtenidos de los servicios
      // El nombre de las opciones y el conteo de las opciones
      horizontalBar.data.labels = generatedlabels;
      horizontalBar.data.datasets[0].data = Object.values(totalPercentResponse || []);
      horizontalBar.options.title.text = formatterTitle;

      //Si es un examen Marcamos la respuesta correcta en verde
      if (options.correctAnswerIndex) {
        horizontalBar.data.datasets[0].backgroundColor = [];
        horizontalBar.data.datasets[0].backgroundColor[options.correctAnswerIndex] = 'rgba(50, 255, 50, 0.6)';
      }

      /* El siguiente codigo actuamlente no se esta usando pero se deja como referencia
        para implementar el servicio para acceder a los métodos de la API de chart      
      */

      //Formatear etiqueta de datos sobre la barra horizontal

      // const customPlugin = {

      //   beforeInit: function (a, b, c) {
      //     console.log('antes de pintar el grafico')
      //     console.log({ a, b, c })
      //   },
      //   afterDatasetsDraw: function (context, easing) {

      //     console.log('--- start format data label hbar ---')
      //     console.log('hbar', horizontalBar)
      //     //context.clearRect(0, 0, canvas.width, canvas.height);

      //     var ctx = context.chart.ctx;

      //     context.data.datasets.forEach(function (dataset) {
      //       for (var i = 0; i < dataset.data.length; i++) {
      //         if (dataset.data[i] != 0) {
      //           var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
      //           var textY = model.y + (dataset.type == "line" ? -3 : 15);

      //           console.log('soy ctx', ctx)
      //           ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
      //           ctx.textAlign = 'start';
      //           ctx.textBaseline = 'middle';
      //           ctx.fillStyle = dataset.type == "line" ? "black" : "black";
      //           ctx.save();
      //           //ctx.translate(model.x, textY - 15);
      //           //ctx.translate(21, textY - 50);
      //           ctx.translate(21, textY - 15);

      //           ctx.rotate(0);

      //           const formatDataLabel = generatedlabels[i]

      //           console.log({ dataset })
      //           //ctx.clear()
      //           ctx.fillText(formatDataLabel, 0, 0);
      //           ctx.restore();
      //         }
      //       }
      //     });
      //   }
      // }

      //Chart.pluginService.register(customPlugin);

      /* Fin del codigo de referencia para registrar la configuracion
        de lo métodos de la API  de ChartJS
      */

      horizontalBar.options = {
        plugins: {
          datalabels: {
            color: '#333',
            formatter: function(value, context) {
              return context.chart.data.labels[context.dataIndex];
            },
            textAlign: 'left',
            anchor: 'start',
            align: 5
          }
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontSize: 15,
                fontColor: '#777',
                minor: { display: true },
                display: false
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: '#777'
              }
            }
          ]
        }
      };

      // Se obtiene el canvas del markup y se utiliza para crear el grafico
      const canvas = document.getElementById('chart').getContext('2d');
      const chart = new Chart(canvas, horizontalBar);

      this.setState({ horizontalBar, chart, chartCreated: true });
    } else {
      // Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
      chart.data.labels = generatedlabels;
      chart.data.datasets[0].data = Object.values(totalPercentResponse || []);
      chart.options.title.text = formatterTitle;

      //Si es un examen Marcamos la respuesta correcta en verde
      if (options.correctAnswerIndex) {
        horizontalBar.data.datasets[0].backgroundColor = [];
        horizontalBar.data.datasets[0].backgroundColor[options.correctAnswerIndex] = 'rgba(50, 255, 50, 0.6)';
      }
      chart.update();

      this.setState({ chart });
    }
  };

  mountChart = async () => {
    const { idSurvey, eventId, operation } = this.props;
    let { dataSurvey, currentPage } = this.state;
    let { questions } = dataSurvey;

    // Se ejecuta servicio para tener el conteo de las respuestas
    await SurveyAnswers.getAnswersQuestion(
      idSurvey,
      questions[currentPage - 1].id,
      eventId,
      this.updateData,
      operation
    );
  };

  async componentDidMount() {
    this.loadData();
  }

  render() {
    let { dataSurvey, currentPage, titleQuestion } = this.state;
    const { showListSurvey, surveyLabel } = this.props;

    if (dataSurvey.questions)
      return (
        <>
          <Card className='survyCard'>
            <div style={{ marginTop: 5 }}>
              <Button ghost shape='round' onClick={() => showListSurvey()}>
                <ArrowLeftOutlined /> Volver a {surveyLabel ? surveyLabel.name : 'encuestas'}
              </Button>
            </div>
            <Card>
              <strong>{titleQuestion}</strong>
              <canvas style={{ width: '100%' }} id='chart'></canvas>
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
