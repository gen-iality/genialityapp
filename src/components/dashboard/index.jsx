import React, { Component } from 'react';
import * as Cookie from 'js-cookie';
import { ApiUrl } from '../../helpers/constants';
import { Tooltip, Button, Card, Col, message, Row, Select, Statistic, Table, Space, Spin } from 'antd';
import { EyeOutlined, FieldTimeOutlined, IdcardOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import {totalsMetricasEventsDetails, totalsMetricasMail, totalsMetricasActivityDetails, metricasRegisterByDate} from '../networking/services';
import 'chartjs-plugin-datalabels';
import { queryReportGnal, queryReportGnalByMoth } from '../networking/analytics';

import { Bar, Line } from 'react-chartjs-2';
import XLSX from 'xlsx';
import ReactToPrint from 'react-to-print';

import Moment from 'moment';

//CONSTANTES COLORES DE GRAFICAS
const backgroud = 'rgba(80, 211, 201, 0.7)';
const lineBackground = 'rgba(80, 211, 201, 1)';

const { Option } = Select;

class DashboardEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      iframeUrl: '',
      totalmails: [],
      listMail: [],
      totalClicked: 0,
      totalDeliverd: 0,
      totalOpened: 0,
      totalSent: 0,
      totalBounced: 0,
      metricsGnal: null,
      metricsActivity: [],
      registrosDia: null,
      attendesDay: null,
      printoutsDay: 0,
      viewRegister: '7',
      metricsGaByActivity: [],
      metricsGaByActivityGnal: [],
      metricsGraphics: [],
      metricsRegister: [],
      //Descripciones de Tooltip
      desc1: 'Cantidad de usuarios registrados por día',
      desc2: 'Total de usuarios registrados en el evento',
      desc3: 'Duración promedio de un usuario en el evento',
      desc4: 'Total de visitas por día',
      desc5: 'Visitas totales de los usuarios',
      desc6: 'Tiempo promedio de permanencia de los usuarios en el evento',
      desc7: 'Impresiones totales del evento',
      loadingMetrics:true //Permite controlar la carga de las métricas
    };
 
  }


  //Función que permite totalizar los valores por campaña
  totalsMails(list) {
    let totalClicked = 0,
      totalDeliverd = 0,
      totalOpened = 0,
      totalSent = 0,
      totalBounced = 0;
    list.map((m, index) => {
      totalClicked += m.total_clicked ? m.total_clicked : 0;
      totalDeliverd += m.total_delivered ? m.total_delivered : 0;
      totalOpened += m.total_opened ? m.total_opened : 0;
      totalSent += m.total_sent ? m.total_sent : 0;
      totalBounced += m.total_bounced ? m.total_bounced : 0;
    });
    this.setState({
      totalSent,
      totalClicked,
      totalDeliverd,
      totalBounced,
      totalOpened,
    });
  }

  //Función que permite exportar los reportes formato excel
  exportReport = (datos, name, type, namesheet) => {
    let { metricsRegister, metricsGraphics } = this.state;
    console.log(metricsGraphics);
    let data = [];
    if (datos.length > 0) {
      if (type == 'register') {
        data = datos.map((item) => {
          return { fecha: item.date, cantidadregistros: item.quantity };
        });
      }
      if (type == 'views') {
        data = datos.map((item) => {
          return { fecha: Moment(item.month).format('YYYY-MM-DD'), 'cantidad de visitas': item.view };
        });
      }

      if (type == 'time') {
        data = datos.map((item) => {
          return {
            fecha: Moment(item.month).format('YYYY-MM-DD'),
            'tiempoPromedio(min)': parseFloat(item.time).toFixed(2),
          };
        });
      }

      for (let i = 0; data.length > i; i++) {
        if (Array.isArray(data[i].response)) {
          data[i].response = data[i].response.toString();
        }
      }
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${namesheet}`);
      XLSX.writeFile(wb, `${name}_${this.props.eventId}_${Moment().format('DDMMYY')}.xls`);
    } else {
      message.error('No existen datos que exportar');
    }
  };

  //Función que permite obtener metricas por vistas de actividad
  obtenerMetricasByView = (view) => {
    let metrics = this.state.metricsGaByActivity.filter((m) => m.view == view)[0];
    return metrics;
  };

  //Función que permite obtener las métricas por cada actividad
  updateMetricasActivity = (data) => {
    if (data.length > 0) {     
      let metricsActivity = [];
      data.map((activity) => {
        let metricsView = this.obtenerMetricasByView('/landing/' + this.props.eventId + '/activity/' + activity.name);
        let metricaActivity = {
          name: activity.name,
          view: metricsView ? metricsView.metrics[0] : 0,
          prints: 0,
          time: metricsView ? (metricsView.metrics[4] / 60).toFixed(2) + ' min' : '0 min',
        };
        
        metricsActivity.push(metricaActivity);
      });
      this.setState({ metricsActivity });
    }
  };
  componentDidMount() {
    // fin de la peticion a analytics
    const evius_token = Cookie.get('evius_token');
    const { eventId } = this.props;

    if (evius_token) {
      const iframeUrl = `${ApiUrl}/es/event/${eventId}/dashboard?evius_token=${evius_token}`;
      this.setState({ iframeUrl, loading: false });
      totalsMetricasMail(this.props.eventId).then((data) => {
        this.setState({ totalmails: data });
        this.totalsMails(data);
        totalsMetricasEventsDetails(this.props.eventId).then((data) => {
          this.setState({ metricsGnal: data });
        });
        totalsMetricasActivityDetails(this.props.eventId).then((data) => {
          this.setState({ metricsActivity: data });
          this.obtenerMetricas(data);
        });
      });

      //MOSTRAR GRAFICAS INICIALES
      //this.graficRegistros();
      //this.graficAttendees();
      //this.graficPrintouts();     
     
    
    }
  }
  //Función que permite obtener las métricas generales del evento
  obtenerMetricas = (data) => {
    const { eventId } = this.props;  
    queryReportGnal(eventId).then((resp) => { 
      console.log(resp)      
      const dataEvents = resp.rows;
      const totalMetrics = resp.totalsForAllResults;      
      let metrics = [];
      dataEvents.map((data, i) => {
        let objeto = {
          view: dataEvents[i][0],
          metrics: Array.from(dataEvents[i].slice(1,dataEvents[i].length)),
        };       
        metrics.push(objeto);
      });
      let totalAvg=parseFloat(totalMetrics["ga:avgTimeOnPage"]);
      this.setState({
        metricsGnal: {
          ...this.state.metricsGnal,
          total_checkIn: totalMetrics["ga:sessions"],
          avg_time: (totalAvg/60).toFixed(2),
        },
        metricsGaByActivity: metrics,
        metricsGaByActivityGnal: metrics,
      });
      this.updateMetricasActivity(data);
      queryReportGnalByMoth(eventId).then((respuesta) => {  
        console.log(respuesta)     
       let datos = respuesta.rows;
        console.log(datos);
        let totalMetrics = [];
        datos.map((dat) => {
          let metric = {
            month: dat[0],
            view: dat[1],
            time: (dat[2]/60).toFixed(2),
          };
          totalMetrics.push(metric);
        });        
        this.setState({
          metricsGraphics: totalMetrics,
          loadingMetrics:false
        });
        this.graficRegistros();
        this.graficAttendees();
        this.graficPrintouts();
      });
    });
  };

  //GRAFICA REGISTROS POR DIA
  async graficRegistros() {
    let labels = [],
      values = [];
    let metricsRegister = await metricasRegisterByDate(this.props.eventId);
    if (metricsRegister) {
      metricsRegister.map((metric) => {
        labels.push(metric.date);
        values.push(Number.parseFloat(metric.quantity).toFixed(2));
      });
    }
    this.setState({
      metricsRegister,
      registrosDia: this.setDataGraphic(
        labels.slice(-this.state.viewRegister),
        values.slice(-this.state.viewRegister),
        'Registros'
      ),
    });
  }

  //GRAFICA ASISTENTES POR DIA
  async graficAttendees() {
    let labels = [],
      values = [];
    let metricsAttendees = this.state.metricsGraphics;
    if (metricsAttendees) {
      metricsAttendees.map((metric) => {
        labels.push(metric.month);
        values.push(Number.parseFloat(metric.view).toFixed(0));
      });
    }
    this.setState({
      attendesDay: this.setDataGraphic(
        labels.slice(-this.state.viewRegister),
        values.slice(-this.state.viewRegister),
        'Vistas totales del evento'
      ),
    });
  }

  //GRAFICA ASISTENTES POR DIA
  async graficPrintouts() {
    let labels = [],
      values = [];
    let metricsAttendees = this.state.metricsGraphics;
    console.log('GRAFICA ACA');
    console.log(metricsAttendees);
    if (metricsAttendees) {
      metricsAttendees.map((metric) => {
        labels.push(metric.month);
        values.push(Number.parseFloat(metric.time).toFixed(2));
      });
    }
    this.setState({
      printoutsDay: this.setDataGraphic(
        labels.slice(-this.state.viewRegister),
        values.slice(-this.state.viewRegister),
        'Tiempo promedio de permanencia'
      ),
    });
  }

  //FUNCION QUE PERMITE CREAR OBJETO PARA ASIGNAR A LA GRAFICA
  setDataGraphic(labels, values, name) {
    let data = {
      labels: labels,
      datasets: [
        {
          label: name,
          data: values,
          fill: false,
          backgroundColor: backgroud,
          borderColor: lineBackground,
        },
      ],
    };
    return data;
  }

  //Opciones para las gráficas
  options = {
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
      },
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
          },
        },
      ],
    },
  };

  render() {
    const columnsEmail = [
      {
        title: 'Campaña',
        dataIndex: 'subject',
        key: 'subject',
      },
      {
        title: 'Nombre completo',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Correo Electronico',
        dataIndex: 'email',
        key: 'email',
      },
    ];

    const columns = [
      {
        title: 'Actividad',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Vistas unicas',
        dataIndex: 'view',
        key: 'view',
      },
      {
        title: 'Impresiones',
        dataIndex: 'prints',
        key: 'prints',
      },
      {
        title: 'Tiempo del usuario',
        dataIndex: 'time',
        key: 'time',
      },
    ];
    return (
      !this.state.loadingMetrics?<>
        <div ref={(el) => (this.componentRef = el)}>         
          <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
            <Col span={18}>
              <Row justify='end'>
                <Button
                  onClick={() =>
                    this.exportReport(this.state.metricsRegister, 'Register', 'register', 'registerByDay')
                  }>
                  Exportar
                </Button>
              </Row>
              <Tooltip title={this.state.desc1} placement='top'>
                <Card>{this.state.registrosDia && <Line data={this.state.registrosDia} options={this.options} />}</Card>
              </Tooltip>
            </Col>
            <Col span={6}>
              <Row gutter={(32, 32)}>
                <Col span={24}>
                  <Tooltip title={this.state.desc2} placement='top'>
                    <Card hoverable>
                      <Statistic
                        groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                        valueStyle={{ fontSize: '38px' }}
                        title='Usuarios registrados'
                        value={this.state.metricsGnal ? this.state.metricsGnal.total_users : 0}
                        prefix={<IdcardOutlined />}
                      />
                    </Card>
                  </Tooltip>
                </Col>
                <Col span={24}>
                  <Tooltip title={this.state.desc3} placement='top'>
                    <Card hoverable>
                      <Statistic
                        groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                        valueStyle={{ fontSize: '36px' }}
                        title='Duracion promedio de un usuario'
                        value={this.state.metricsGnal ? this.state.metricsGnal.avg_time : 0}
                        prefix={<FieldTimeOutlined />}
                        suffix='min'
                      />
                    </Card>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
            <Col span={12}>
              <Row justify='center'>
                <Col span={24}>
                  <Row justify='end'>
                    <Button
                      onClick={() => this.exportReport(this.state.metricsGraphics, 'Visitas', 'views', 'ViewsByDay')}>
                      Exportar
                    </Button>
                  </Row>
                  <Tooltip title={this.state.desc4} placement='top'>
                    <Card>
                      {this.state.attendesDay && <Bar data={this.state.attendesDay} options={this.options} />}
                    </Card>
                  </Tooltip>
                </Col>
                <Col span={12}>
                  <Tooltip title={this.state.desc5} placement='top'>
                    <Card>
                      <Statistic
                        groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                        valueStyle={{ fontSize: '38px' }}
                        title='Visitas unicas totales del evento'
                        value={this.state.metricsGnal ? this.state.metricsGnal.total_checkIn : 0}
                        prefix={<UserOutlined />}
                      />
                    </Card>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row justify='end'>
                <Button
                  onClick={() =>
                    this.exportReport(this.state.metricsGraphics, 'TiempoPromedio', 'time', 'avgTimeByDay')
                  }>
                  Exportar
                </Button>
              </Row>
              <Row justify='center'>
                <Col span={24}>
                  <Tooltip title={this.state.desc6} placement='top'>
                    <Card>
                      {this.state.printoutsDay && <Line data={this.state.printoutsDay} options={this.options} />}
                    </Card>
                  </Tooltip>
                </Col>
                <Col span={12}>
                  <Tooltip title={this.state.desc7} placement='top'>
                    <Card>
                      <Statistic
                        groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                        valueStyle={{ fontSize: '38px' }}
                        title='Impresiones totales del evento'
                        value={this.state.metricsGnal ? this.state.metricsGnal.total_printouts : 0}
                        prefix={<EyeOutlined />}
                      />
                    </Card>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
            <Col span={24}>
              <Card
                headStyle={{ border: 'none' }}
                title={'Metricas por actividades del evento'}
                extra={<MoreOutlined />}>
                <Table
                  dataSource={this.state.metricsActivity}
                  columns={columns}
                  size='small'
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
            <Col span={24}>
              <Card headStyle={{ border: 'none' }} title={'Métricas de correos'}>
                <Row justify='center' style={{ marginBottom: 20 }}>
                  <Card>
                    <Statistic
                      valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                      title={<h3 style={{ textAlign: 'center' }}>CAMPAÑAS</h3>}
                      value={this.state.totalmails.length}
                    />
                  </Card>
                </Row>
                <Row justify='space-around' align='middle' gutter={[8, 8]}>
                  <Col span={4}>
                    <Card>
                      <Statistic
                        valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                        title={<h3 style={{ textAlign: 'center' }}>ENTREGADOS</h3>}
                        value={this.state.totalDeliverd}
                      />
                    </Card>
                  </Col>

                  <Col span={4}>
                    <Card>
                      <Statistic
                        valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                        title={<h3 style={{ textAlign: 'center' }}>REBOTADOS</h3>}
                        value={this.state.totalBounced}
                      />
                    </Card>
                  </Col>

                  <Col span={8}>
                    <Card>
                      <Statistic
                        valueStyle={{ fontSize: '48px', textAlign: 'center' }}
                        title={<h2 style={{ textAlign: 'center' }}>ENVIADOS</h2>}
                        value={this.state.totalSent}
                      />
                    </Card>
                  </Col>

                  <Col span={4}>
                    <Card hoverable bordered={false}>
                      <Statistic
                        valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                        title={<h3 style={{ textAlign: 'center' }}>ABIERTOS</h3>}
                        value={this.state.totalOpened}
                      />
                    </Card>
                  </Col>

                  <Col span={4}>
                    <Card>
                      <Statistic
                        valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                        title={<h3 style={{ textAlign: 'center' }}>CLICS</h3>}
                        value={this.state.totalClicked}
                      />
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Button onClick={() => this.props.history.push(`/event/${this.props.eventId}/messages`)}>
                    Ver detalle
                  </Button>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        <ReactToPrint
          trigger={() => {
            return (
              <Row justify='end'>
                <Button disabled={this.state.metricsGaByActivity.length == 0}>Exportar métricas</Button>
              </Row>
            );
          }}
          content={() => this.componentRef}
        />
      </>:<Row justify="center" align="middle" >
        <Spin />
      </Row>
    );
  }
}

export default withRouter(DashboardEvent);
