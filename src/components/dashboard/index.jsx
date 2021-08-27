import React, { Component } from 'react';
import * as Cookie from 'js-cookie';
import { ApiUrl } from '../../helpers/constants';
import { Tooltip, Button, Card, Col, message, Row, Select, Statistic, Table, Space, Spin, Typography } from 'antd';
import {
  EyeOutlined,
  FieldTimeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  IdcardOutlined,
  MoreOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import {
  totalsMetricasEventsDetails,
  totalsMetricasMail,
  totalsMetricasActivityDetails,
  metricasRegisterByDate,
  queryReportGnal,
  queryReportGnalByMoth,
  setDataGraphic,
  exportDataReport,
  obtenerMetricasByView,
  updateMetricasActivity,
} from './serviceAnalytics';
import 'chartjs-plugin-datalabels';
import { Bar, Line } from 'react-chartjs-2';
import XLSX from 'xlsx';
import ReactToPrint from 'react-to-print';
import Moment from 'moment';
import API from '../../helpers/request';

// const [google, setGoogle] = useState(null)

const { Title } = Typography;
//ESTILOS PAGINA PDF
const pageStyle = `
  
  @page {
    size: 220mm 280mm;
  }

  @media all {
    .pagebreak {
      margin-top: 5rem;
      display: block;
      
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;

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
      desc4: 'Total de usuarios que visitan el evento por día',
      desc5: 'Visitas totales de los usuarios',
      desc6: 'Visitas realizadas al evento',
      desc7: 'Impresiones totales del evento',
      loadingMetrics: true,
      //TRUE:MUESTRA UI
      //FALSE: PARA IMPRIMIR
      printButton: true,
      mailsDetails: [],

      //Permite controlar la carga de las métricas
    };
    this.displayButton = this.displayButton.bind(this);
  }

  displayButton = (self) => {
    return new Promise((resolve, reject) => {
      self.setState({ printButton: false }, () => resolve(true));
    });
  };

  visibleButton = (self) => {
    self.setState({
      printButton: true,
    });
  };

  //Función que permite totalizar los valores por campaña
  totalsMails(list) {
    let totalClicked = 0,
      totalDeliverd = 0,
      totalOpened = 0,
      totalSent = 0,
      totalBounced = 0;
    list?.map((m, index) => {
      totalClicked += m.total_clicked ? m.total_clicked : 0;
      totalDeliverd += m.total_delivered ? m.total_delivered : 0;
      totalOpened += m.total_opened ? m.total_opened : 0;
      totalSent += m.total_sent ? m.total_sent : 0;
      totalBounced += m.total_bounced ? m.total_bounced : 0;
    });
    this.setState({ totalSent, totalClicked, totalDeliverd, totalBounced, totalOpened });
  }

  //Función que permite exportar los reportes formato excel
  exportReport = async (datos, name, type, namesheet) => {
    let data = await exportDataReport(datos, type);
    if (data) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${namesheet}`);
      XLSX.writeFile(wb, `${name}_${this.props.eventId}_${Moment().format('DDMMYY')}.xls`);
    } else {
      message.error('No existen datos que exportar');
    }
  };
  fetchDataMails() {
    return new Promise((resolve, reject) => {
      API.get(`/api/events/${this.props.eventId}/messages`)
        .then(({ data }) => {
          resolve(data.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  columnsMail = [
    {
      title: 'Asunto',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Enviados',
      dataIndex: 'number_of_recipients',
      key: 'recipients',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Entregados',
      dataIndex: 'total_delivered',
      key: 'sent',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Rebotados',
      dataIndex: 'total_bounced',
      key: 'bounced',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Abiertos',
      dataIndex: 'total_opened',
      key: 'opened',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Clicked',
      dataIndex: 'total_clicked',
      key: 'clicked',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
  ];

  componentDidMount() {
    // fin de la peticion a analytics
    const evius_token = Cookie.get('evius_token');
    const { eventId } = this.props;
    if (evius_token) {
      const iframeUrl = `${ApiUrl}/es/event/${eventId}/dashboard?evius_token=${evius_token}`;
      this.setState({ iframeUrl, loading: false });
      totalsMetricasMail(this.props.eventId).then((datametricsMail) => {
        totalsMetricasEventsDetails(this.props.eventId).then((dataMetricsGnal) => {
          totalsMetricasActivityDetails(this.props.eventId).then((dataMetricsActivity) => {
            if (dataMetricsActivity.length > 0) {
            
              this.setState({
                totalmails: datametricsMail,
                metricsActivity: dataMetricsActivity,
                metricsGnal: dataMetricsGnal,
              });
              this.obtenerMetricas(dataMetricsActivity);
              this.totalsMails(datametricsMail);
              this.fetchDataMails().then((resp) => {
                this.setState(
                  {
                    mailsDetails: resp,
                    loadingMetrics :false
                  },
                  () => {
                   
                    this.totalsMails(datametricsMail);
                    this.graficRegistros();
                    this.graficAttendees();
                    this.graficPrintouts();
                  }
                );
              });
            } else {
              this.setState({
                loadingMetrics: false,
                totalmails: datametricsMail,
                metricsGnal: dataMetricsGnal,
              });
              this.totalsMails(datametricsMail);
              this.graficRegistros();
              this.graficAttendees();
              this.graficPrintouts();
            }
          });
        });
      });

      //MOSTRAR GRAFICAS INICIALES
      //this.graficRegistros();
      //this.graficAttendees();
      //this.graficPrintouts();
    }
  }
  //Función que permite obtener las métricas generales del evento
  obtenerMetricas = async (data) => {
    const { eventId } = this.props;
    let metricsgnal = await queryReportGnal(eventId);
    let metricsActivity = await updateMetricasActivity(data, eventId, metricsgnal.metrics);
    let metricsGraphics = await queryReportGnalByMoth(eventId);
    this.setState({
      metricsGraphics: metricsGraphics,
      metricsGnal: {
        ...this.state.metricsGnal,
        total_checkIn: metricsgnal.totalMetrics['ga:sessions'],
        avg_time: (metricsgnal.totalAvg / 60).toFixed(2),
        total_printouts: metricsgnal.totalMetrics['ga:pageviews'],
      },
      metricsGaByActivity: metricsgnal.metrics,
      metricsGaByActivityGnal: metricsgnal.metrics,
      metricsActivity,
      loadingMetrics: false,
    });
    this.graficRegistros();
    this.graficAttendees();
    this.graficPrintouts();
  };
  //GRAFICA REGISTROS POR DIA
  async graficRegistros() {
    let labels = [],
      values = [];
    let metricsRegister = await metricasRegisterByDate(this.props.eventId);
    console.log("metricsRegister",metricsRegister)
    if (metricsRegister) {
      metricsRegister.map((metric) => {
        labels.push(metric.date);
        values.push(Number.parseFloat(metric.quantity).toFixed(2));
      });
    }
    this.setState({
      metricsRegister,
      registrosDia: setDataGraphic(
        labels.slice(-this.state.viewRegister),
        values.slice(-this.state.viewRegister),
        'Número de usuarios registrados (últimos 7 días)'
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
      attendesDay: setDataGraphic(
        labels.slice(-this.state.viewRegister),
        values.slice(-this.state.viewRegister),
        'Número de usuarios que visitan el evento (últimos 7 días)'
      ),
    });
  }

  //GRAFICA ASISTENTES POR DIA
  async graficPrintouts() {
    let labels = [],
      values = [];
    let metricsAttendees = this.state.metricsGraphics;
    if (metricsAttendees) {
      metricsAttendees.map((metric) => {
        labels.push(metric.month);
        values.push(Number.parseFloat(metric.time));
      });
    }
    this.setState({
      printoutsDay: setDataGraphic(
        labels.slice(-this.state.viewRegister),
        values.slice(-this.state.viewRegister),
        'Número de visitas del evento (últimos 7 días)'
      ),
    });
  }

  //Opciones para las gráficas
  options = {
    layout: {
      padding: '0',
    },
    elements: {
      point: {
        pointStyle: 'circle',
        radius: '5',
        hoverRadius: '6',
      },
    },
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
      },
      legend: {
        display: true,
        labels: {
          font: {
            size: '12',
            family: "'Montserrat', sans-serif", // para probar si afecta la fuente cambiar Montserrat por Papyrus
          },
        },
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
        title: 'Número de usuarios',
        dataIndex: 'view',
        key: 'view',
      },
      {
        title: 'Visitas totales',
        dataIndex: 'prints',
        key: 'prints',
      },
      {
        title: 'Tiempo del usuario',
        dataIndex: 'time',
        key: 'time',
      },
    ];
    return !this.state.loadingMetrics ? (
      <>
        <div ref={(el) => (this.componentRef = el)}>
          <Row justify='start'>
            <img
              style={{ height: '200px', width: '1920px', objectFit: 'contain' }}
              src={
                'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/MetricsBanner%2Fcabezote2.jpg?alt=media&token=0f65b3ed-47f3-4c98-a616-db9a6a7b6ae3' ||
                'http://via.placeholder.com/970x250/50D3C9/FFFFFF?text=Banner%20evius'
              }
              alt='evius'
            />

            {this.state.printButton ? (
              ''
            ) : (
              <Title style={{ paddingTop: '20px' }} level={2}>
                {this.props.eventName}
              </Title>
            )}
          </Row>
          <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
            <Col span={this.state.printButton ? 18 : 24}>
              <Tooltip title={this.state.desc1} placement='top' mouseEnterDelay={0.5}>
                <Card>
                  {this.state.printButton && (
                    <Row justify='end'>
                      <Button
                        style={{ color: '#1F6E43' }}
                        shape='round'
                        icon={<FileExcelOutlined />}
                        onClick={() =>
                          this.exportReport(this.state.metricsRegister, 'Register', 'register', 'registerByDay')
                        }>
                        Exportar
                      </Button>
                    </Row>
                  )}
                  {this.state.registrosDia && <Line data={this.state.registrosDia} options={this.options} />}
                </Card>
              </Tooltip>
            </Col>

            <Col span={this.state.printButton ? 6 : 24}>
              <Row gutter={(32, 32)}>
                <Col span={24}>
                  <Tooltip title={this.state.desc2} placement='top' mouseEnterDelay={0.5}>
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

                <Col className={this.state.printButton ? '' : 'pagebreak'} span={24}>
                  <Tooltip title={this.state.desc3} placement='top' mouseEnterDelay={0.5}>
                    <Card hoverable>
                      <Statistic
                        groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                        valueStyle={{ fontSize: '36px' }}
                        title='Duración promedio de un usuario'
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
            <Col className={this.state.printButton ? '' : 'pagebreak'} span={this.state.printButton ? 18 : 24}>
              <Tooltip title={this.state.desc4} placement='top' mouseEnterDelay={0.5}>
                <Card>
                  {this.state.printButton && (
                    <Row justify='end'>
                      <Button
                        style={{ color: '#1F6E43' }}
                        shape='round'
                        icon={<FileExcelOutlined />}
                        onClick={() => this.exportReport(this.state.metricsGraphics, 'Visitas', 'views', 'ViewsByDay')}>
                        Exportar
                      </Button>
                    </Row>
                  )}
                  {this.state.attendesDay && (
                    <Row justify='center'>
                      <Bar data={this.state.attendesDay} options={this.options} />
                    </Row>
                  )}
                </Card>
              </Tooltip>
            </Col>
            <Col span={this.state.printButton ? 6 : 24}>
              <Tooltip title={this.state.desc5} placement='top' mouseEnterDelay={0.5}>
                <Card>
                  <Statistic
                    groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                    valueStyle={{ fontSize: '38px' }}
                    title='Total usuarios que visitan el evento'
                    value={this.state.metricsGnal ? this.state.metricsGnal.total_checkIn : 0}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Tooltip>
            </Col>

            <Col span={this.state.printButton ? 18 : 24}>
              <Tooltip title={this.state.desc6} placement='top' mouseEnterDelay={0.5}>
                <Card>
                  {this.state.printButton && (
                    <Row justify='end'>
                      <Button
                        style={{ color: '#1F6E43', display: this.state.printButton ? 'block' : 'none' }}
                        shape='round'
                        icon={<FileExcelOutlined />}
                        onClick={() =>
                          this.exportReport(this.state.metricsGraphics, 'Número de visitas', 'time', 'visitasByDia')
                        }>
                        Exportar
                      </Button>
                    </Row>
                  )}
                  {this.state.printoutsDay && (
                    <Row justify='center'>
                      <Line data={this.state.printoutsDay} options={this.options} />
                    </Row>
                  )}
                </Card>
              </Tooltip>
            </Col>
            <Col span={this.state.printButton ? 6 : 24}>
              <Tooltip title={this.state.desc7} placement='top' mouseEnterDelay={0.5}>
                <Card>
                  <Statistic
                    groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                    valueStyle={{ fontSize: '38px' }}
                    title='Visitas totales del evento'
                    value={this.state.metricsGnal ? this.state.metricsGnal.total_printouts : 0}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Tooltip>
            </Col>
          </Row>
          <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
            <Col span={24}>
              <Card
                headStyle={{ border: 'none' }}
                title={'Métricas por actividades del evento'}
                extra={<MoreOutlined />}>
                <Table
                  dataSource={this.state.metricsActivity}
                  columns={columns}
                  size='small'
                  pagination={this.state.printButton ? { pageSize: 5 } : false}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
            <Col span={24}>
              <Card headStyle={{ border: 'none' }} title={'Métricas de correos'}>
                {this.state.printButton && (
                  <Row justify='center' style={{ marginBottom: 20 }}>
                    <Card>
                      <Statistic
                        valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                        title={<h3 style={{ textAlign: 'center' }}>CAMPAÑAS</h3>}
                        value={this.state.totalmails ?this.state.totalmails.length:0}
                      />
                    </Card>
                  </Row>
                )}
                {this.state.printButton && (
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
                      <Card>
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
                )}
                {this.state.printButton && (
                  <Row>
                    <Button
                      shape='round'
                      icon={<NotificationOutlined />}
                      onClick={() => this.props.history.push(`/event/${this.props.eventId}/messages`)}>
                      Ver correos
                    </Button>
                  </Row>
                )}
                {!this.state.printButton && (
                  <Table
                    pagination={false}
                    loading={this.state.loadingMetrics}
                    columns={this.columnsMail}
                    dataSource={this.state.mailsDetails}
                  />
                )}
              </Card>
            </Col>
          </Row>
          <Row justify='start'>
          <img
            style={{ height: '200px', width: '1920px', objectFit: 'contain' }}
            src={
              'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/MetricsBanner%2Fcabezote-sin-texto.jpg?alt=media&token=67e3e7cb-9c5f-489b-9eb0-e3526e204e34' ||
              'http://via.placeholder.com/970x250/50D3C9/FFFFFF?text=Banner%20evius'
            }
            alt='evius'
          />
        </Row>
        </div>

        <ReactToPrint
          pageStyle={pageStyle}
          onBeforeGetContent={() => this.displayButton(this)}
          onAfterPrint={() => this.visibleButton(this)}
          documentTitle={'Métricas del evento ' + this.props.eventName }
          trigger={() => {
            return (
              <Row justify='end' style={{ paddingTop: '10px' }}>
                <Button
                  danger
                  style={{ color: '#F70D09' }}
                  shape='round'
                  icon={<FilePdfOutlined />}
                  disabled={this.state.metricsGaByActivity.length == 0}>
                  Exportar métricas
                </Button>
              </Row>
            );
          }}
          content={() => this.componentRef}
        />
        
      </>
    ) : (
      <Row justify='center' align='middle'>
        <Spin />
      </Row>
    );
  }
}

export default withRouter(DashboardEvent);
