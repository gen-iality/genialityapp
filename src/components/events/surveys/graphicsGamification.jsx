import 'chartjs-plugin-datalabels';
import { Component } from 'react';
import { Spin, Card } from 'antd';
import Chart from 'chart.js/auto';
import { Users } from './services';
import { graphicsFrame } from './frame';

class Graphics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataGamification: null,
      currentPage: 1,
      graphicsFrame,
      chart: {},
      chartCreated: false,
      totalPesoVoto: 0,
      pointsList: [],
    };
    // this.percentPesoVoto = this.percentPesoVoto.bind(this)
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { data } = this.props;
    this.setState({ dataGamification: data }, this.mountChart);
  };

  //Funcion para calcular el pesovoto del curso, en caso de que exista
  //Aun no se valida si existe peso voto po lo cual no se llama en nunguna funcion importante
  percentPesoVoto = async () => {
    const { eventId } = this.props;

    let totalPesoVoto = 0;
    let pesoVotoCheked = 0;
    let pointsPercent = [];
    let pointsList = [];
    const users = await Users.getUsers(eventId);

    users.forEach(function(a) {
      if (a.checkedin_at) {
        pesoVotoCheked += parseInt(a.properties.pesovoto);
      }
      totalPesoVoto += parseInt(a.properties.pesovoto);
    });

    this.props.data.pointsList.forEach(function(b) {
      pointsPercent.push(((b / totalPesoVoto) * pesoVotoCheked).toFixed(2));
    });

    for (let i = 0; pointsPercent.length > i; i++) {
      const point = parseFloat(pointsPercent[i]);
      pointsList.push(point);
    }

    if (pointsList.length > 0) this.setState({ pointsList });
  };

  mountChart = async () => {
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
      verticalBar.data.datasets[0].label = 'Ranking';
      verticalBar.options = {
        plugins: {
          datalabels: {
            color: '#777',
          },
        },
        scales: {
          y: [
            {
              ticks: {
                fontColor: '#777',
                minor: { display: false },
              },
            },
          ],
          x: [
            {
              ticks: {
                fontColor: '#777',
              },
            },
          ],
        },
        indexAxis: 'x',
      };

      // Se obtiene el canvas del markup y se utiliza para crear el grafico
      const canvas = document.getElementById('chart').getContext('2d');
      const chart = new Chart(canvas, verticalBar);

      this.setState({ verticalBar, chart, chartCreated: true });
    } else {
      // Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
      chart.data.labels = userList;
      chart.data.datasets[0].data = Object.values(pointsList || []);
      verticalBar.data.datasets[0].label = 'Ranking';

      chart.update();

      this.setState({ chart });
    }
  };

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (data !== prevProps.data) {
      this.loadData();
    }
  }

  render() {
    let { dataGamification } = this.state;

    if (dataGamification !== null)
      return (
        <Card style={{ backgroundColor: 'rgba(227, 227, 227,0.3)', marginTop: '2%' }}>
          <canvas style={{ width: '100%' }} id='chart'></canvas>
        </Card>
      );

    return <Spin></Spin>;
  }
}

export default Graphics;
