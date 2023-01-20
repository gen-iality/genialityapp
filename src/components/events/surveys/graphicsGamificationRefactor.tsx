import 'chartjs-plugin-datalabels';
import { Component, useEffect, useState } from 'react';
import { Spin, Card } from 'antd';
import Chart from 'chart.js/auto';
import { Users } from './services';
import { graphicsFrame } from './framer';

export default function Graphics(props: any) {
	const [state, setState] = useState({
		dataGamification: null,
		currentPage: 1,
		graphicsFrame,
		chart: {},
		chartCreated: false,
		totalPesoVoto: 0,
		pointsList: [],
	});

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		const { data } = props;
		setState(prev => ({ ...prev, dataGamification: data }));
		mountChart();
	};

	//Funcion para calcular el pesovoto del evento, en caso de que exista
	//Aun no se valida si existe peso voto po lo cual no se llama en nunguna funcion importante
	const percentPesoVoto = async () => {
		const { eventId } = props;
		console.log('eventId', eventId);

		let totalPesoVoto = 0;
		let pesoVotoCheked = 0;
		let pointsPercent: any[] = [];
		let pointsList: any[] = [];

		const users = await Users.getUsers(eventId);
		console.log('users', users);

		users.forEach((a: any) => {
			if (a.checkedin_at) {
				pesoVotoCheked += parseInt(a.properties.pesovoto);
			}
			totalPesoVoto += parseInt(a.properties.pesovoto);
		});

		props.data.pointsList.forEach((b: any) => {
			pointsPercent.push(((b / totalPesoVoto) * pesoVotoCheked).toFixed(2));
		});

		for (let i = 0; pointsPercent.length > i; i++) {
			const point = parseFloat(pointsPercent[i]);
			pointsList.push(point);
		}

		if (pointsList.length > 0) setState(prev => ({ ...prev, pointsList }));
	};

	const mountChart = async () => {
		const { graphicsFrame, chartCreated, chart, dataGamification } = state;
		// Se ejecuta servicio para tener la informacion del ranking
		const { verticalBar } = graphicsFrame;
		const { userList, pointsList } = dataGamification;

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

			setState(prev => ({ ...prev, verticalBar, chart, chartCreated: true }));
		} else {
			// Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
			chart.data.labels = userList;
			chart.data.datasets[0].data = Object.values(pointsList || []);
			verticalBar.data.datasets[0].label = 'Ranking';

			chart.update();

			setState(prev => ({ ...prev, chart }));
		}
	};

	useEffect(() => {
		loadData();
	}, [props.data]);

	// componentDidUpdate(prevProps) {
	//   const { data } = this.props;
	//   if (data !== prevProps.data) {
	//     this.;
	//   }
	// }

	if (!state.dataGamification) return <Spin />;

	return (
		<Card style={{ backgroundColor: 'rgba(227, 227, 227,0.3)', marginTop: '2%' }}>
			<canvas style={{ width: '100%' }} id='chart'></canvas>
		</Card>
	);
}
