import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'chartjs-plugin-datalabels';
import { Pagination, Spin, Card, Button, Row, Col, Typography } from 'antd';
import { ArrowLeftOutlined, LeftCircleFilled } from '@ant-design/icons';
import Loading from './loading';

import Chart from 'chart.js/auto';

import { SurveyAnswers } from './services/services';
import { SurveysApi, UsersApi } from '../../../helpers/request';
import { graphicsFrame } from './frame';

import * as SurveyActions from '../../../redux/survey/actions';
import { data } from 'jquery';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

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
      titleQuestion: '',
      isMobile: window.screen.width < 800 ? true : false, // determina el tamaño del dispositivo para saber si es mobile o no
      dataVotos:[],
      totalUser: 0 ,
      totalVotosUser: 0,
      resultVotos:{}
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
    this.state.totalUser = totalUsersRegistered

    this.setState({ dataSurvey: response, usersRegistered: totalUsersRegistered }, this.mountChart);
  };

  setCurrentPage = (page) => {
    this.setState({ currentPage: page }, this.mountChart);
  };

  updateData = ({ options, answer_count }) => {
    let { graphicsFrame, chartCreated, chart } = this.state;
    let { horizontalBar, ChartPie, verticalBar } = graphicsFrame;
    const { operation } = this.props;

    let graphyType = this.state.dataSurvey.graphyType 
    let graphy = graphyType === ChartPie.type || window.screen.width <= 800 ? ChartPie : graphyType === horizontalBar.indexAxis ?  horizontalBar : verticalBar

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
    let totalVotosUsuarios = 0;
    let porcentaj_answer=0;
    let colorB=[];
    let list = []

    const alphabet = ['A','B','C','D','E'];

    //Se iguala options.choices[a] a una cadena string dinamica para agregar la cantidad de votos de la respuesta
    for (let a = 0; options.choices.length > a; a++) {
      colorB = graphy.data.datasets[0].backgroundColor[a]
      // options.choices[a] = `${options.choices[a]}:` + `${answer_count[a]} Voto(s): ${totalPercentResponse[a]} %`}
      switch (operation) {
        case 'onlyCount':
          generatedlabels[a] =
            answer_count && answer_count[a] ? options.choices[a] + ` ${answer_count[a][0]} Voto(s)` : '0 Votos';
          break;
        case 'participationPercentage':
          generatedlabels[a] =
            answer_count && answer_count[a]
              ? ` ${(options.choices[a].length == 2 ) ? options.choices[a]: alphabet[a]}  ${answer_count[a][0]} Voto(s), ${answer_count[a][1]}% \n `
              : '0 Votos'
          break;
      }
      porcentaj_answer = answer_count[a][1] 

      list.push({
        voto: answer_count[a][0],
        porcentaje: answer_count[a][1],
        answer:options.choices[a],
        option:(options.choices[a].length == 2 ) ? options.choices[a]: alphabet[a],
        color:colorB
        // option:options.choices[a].length == 1 ? options.choices[a] : 
        // options.choices[a].length == 2 ? options.choices[a] : 'text',
      });
      totalVotosUsuarios = totalVotosUsuarios + answer_count[a][0];
    }

    this.setState({
      dataVotos:list
    })

    let respuestadVotos = 0
    let porcentajeUsuarios = 0
    let respuestatotal = 0;

    respuestadVotos = this.state.totalUser - totalVotosUsuarios;
    porcentajeUsuarios= parseInt((respuestadVotos * 100) / this.state.totalUser)

    this.setState({
      resultVotos:{
        sumadVotacion: totalVotosUsuarios,
        usuariosSinRespuesta: respuestadVotos,
        porcentajevotos: porcentajeUsuarios
      }
    });

    let formatterTitle = options.title;
    this.setState({ titleQuestion: formatterTitle });
    if (options.title && options.title.length > 70) formatterTitle = this.divideString(options.title);

    // Se condiciona si el grafico ya fue creado
    // En caso de que aun no este creado se crea, de lo contrario se actualizara
    if (!chartCreated) {
      // Se asignan los valores obtenidos de los servicios
      // El nombre de las opciones y el conteo de las opciones
      graphy.data.labels = generatedlabels;
      graphy.data.datasets[0].data = Object.values(totalPercentResponse || []);
      graphy.options.title.text = formatterTitle;

      //Si es un examen Marcamos la respuesta correcta en verde
      // if (options.correctAnswerIndex) {
      //   graphy.data.datasets[0].backgroundColor = [];
      //   graphy.data.datasets[0].backgroundColor[options.correctAnswerIndex] = 'rgba(50, 255, 50, 0.6)';
      // }

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
      //     console.log('hbar', graphy)
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

        graphy.options = {
        responsive: true,
        title: {
          fontSize: 16,
          display: true,
          text: '',
        },
        plugins: {
          datalabels: {
            color: '#333',
            formatter: function(value, context) {
              return context.chart.data.labels[context.dataIndex];
            },
            textAlign: 'left',
            anchor: 'start',
            align: 5,
            font: {
              size: this.state.isMobile ? 12 : 22, // otorga el tamaño de la fuente en los resultados de la encuesta segun el dispositivo
            },
          },
        },
        legend: {
          display: false,
        },
        scales: {
          y: [
            {
              ticks: {
                beginAtZero: true,
                fontSize: 15,
                fontColor: '#777',
                minor: { display: true },
                display: false,
              },
            },
          ],
          x: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: '#777',
              },
            },
          ],
        },
        indexAxis: graphyType
      };

      // Se obtiene el canvas del markup y se utiliza para crear el grafico
      const canvas = document.getElementById('chart').getContext('2d');
      const chart = new Chart(canvas, graphy);

      this.setState({ graphy, chart, chartCreated: true });
    } else {
      // Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
      chart.data.labels = generatedlabels;
      chart.data.datasets[0].data = Object.values(totalPercentResponse || []);
      chart.options.title.text = formatterTitle;

      //Si es un examen Marcamos la respuesta correcta en verde
      // if (options.correctAnswerIndex) {
      //   graphy.data.datasets[0].backgroundColor = [];
      //   graphy.data.datasets[0].backgroundColor[options.correctAnswerIndex] = 'rgba(50, 255, 50, 0.6)';
      // }
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
    let { dataSurvey, currentPage, titleQuestion, dataVotos } = this.state;
    const { Paragraph, Text } = Typography;
    const { surveyLabel } = this.props;

    if (dataSurvey.questions)
      return (
        <>
          <Card bodyStyle={{padding:'0'}} className='survyCard'>
            <strong style={{ fontSize:'18px' }}>{this.props.currentSurvey.name}</strong>
            <div style={{ marginTop: 5 }}>
              {this.props.currentActivity === null && (
                <Button
                  type='ghost primary'
                  shape='round'
                  onClick={() => {
                    this.props.setCurrentSurvey(null);
                    this.props.setSurveyVisible(false);
                  }}>
                  <ArrowLeftOutlined /> Volver a {surveyLabel ? surveyLabel.name : 'encuestas'}
                </Button>
              )}
            </div>
            <strong style={{ fontSize:'16px' }}>{titleQuestion}</strong>
            <Card bodyStyle={{paddingLeft:'200px', paddingRight:'200px', paddingTop:'0px', paddingBottom:'0px'}} >
              <canvas  id='chart'></canvas>
            </Card>

            <br />
            <Pagination
              defaultCurrent={currentPage}
              total={dataSurvey.questions.length * 10}
              onChange={this.setCurrentPage}
            />
          </Card>
          <br /> 
          <Row>
           { dataVotos.map((votos, key)=>( 
             <>
              <br />
              <Col key={key} xs={24} sm={24} md={12} lg={12} xl={8} xxl={8} >
              <div style={{width:'320px', borderRadius:'6px', boxShadow:'0px 4px 4px 0px #00000040', marginTop:'12px', marginBottom:'12px'}}>
              <Row>
                <Col span={votos.option == 2 ? 8 : 5} style={{width:'100%'}}>
                  <div  style={{height:'100%', width:'100%', backgroundColor:`${votos.color}`, borderRadius:'4px 0px 0px 4px'}}>
                    <span style={{justifyContent:'center', alignContent:'center', height:'100%', color:'white', display:'grid', fontSize:'24px'}}>{votos.option.toUpperCase()} </span>
                  </div>
                </Col>
                <Col span={votos.option == 2 ? 16 : 19}>
                  <div style={{marginLeft:'12px', marginRight:'12px', fontWeight:'600', marginTop:'4px'}}>
                    <div  style={{fontSize:'14px', fontWeight:'600'}}>
                         <span>{votos.voto} Voto(s)</span>
                         <span style={{float:'right', fontSize:'16px'}}>{votos.porcentaje} % </span>      
                    </div>
                     <div>
                    <Paragraph style={{color:'gray '}} ellipsis={true && { rows: 2, expandable: true, symbol: 'more' }}>
                      {votos.answer}
                    </Paragraph> 
                    </div>
                  </div>
                </Col>
              </Row>
            </div> </Col> 
            </>
           ))
          }
            <br />
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <div style={{height:'76px', width:'320px', borderRadius:'6px', boxShadow:'0px 4px 4px 0px #00000040'}}>  
              <Row>
                <Col span={8}>
                  <div  style={{height:'76px', width:'100%', backgroundColor:'#9e9e9e', borderRadius:'4px 0px 0px 4px'}}>
                    <span style={{justifyContent:'center', alignContent:'center', height:'100%', color:'white', display:'grid', fontSize:'18px', textAlign:'center'}}>Sin responder</span>
                  </div>
                </Col>
                <Col span={16}>
                  <div style={{marginLeft:'12px', marginRight:'12px', fontWeight:'600', display:'grid',alignContent:'center', height:'100%',}}>
                    <div>
                      <span style={{fontSize:'24px', fontWeight:'500'}}>{this.state.resultVotos.usuariosSinRespuesta} Voto(s)</span>
                      <span style={{fontSize:'24px', fontWeight:'500', float:'right'}}>{this.state.resultVotos.porcentajevotos} % </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div> 
             </Col> 
          </Row> 
        </>
      );

    return <Loading />;
  }
}

const mapDispatchToProps = { setCurrentSurvey, setSurveyVisible };

const mapStateToProps = (state) => ({
  currentSurvey: state.survey.data.currentSurvey,
  currentActivity: state.stage.data.currentActivity,
});

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);