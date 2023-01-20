import { Component, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import 'chartjs-plugin-datalabels';
import { Pagination, Card, Button, Row, Col, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Loading from './loading';

import Chart, { ChartConfiguration } from 'chart.js/auto';

import SurveyAnswers from './services/surveyAnswersService';
import { SurveysApi, UsersApi } from '../../../helpers/request';
import { graphicsFrame } from './framer';

import * as SurveyActions from '../../../redux/survey/actions';
import { SurveysContext, UseSurveysContext } from '../../../context/surveysContext';
import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { GraphicsState } from './types';
import { CHART_TYPE, HORIZONTAL_CHAR_CONFIG, PIE_CHART_CONFIG, VERTICAL_CHART_CONFIG } from './chartsConfiguration';
import ChartRender from './ChartRender';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

function Graphics(props: any) {
	console.log('Helloooooo');
	const cSurveys = UseSurveysContext();
	const [state, setState] = useState<GraphicsState>({
		dataSurvey: null,
		currentPage: 1,
		graphicsFrame,
		chart: null,
		chartCreated: false,
		usersRegistered: 0,
		titleQuestion: '',
		isMobile: window.screen.width < 800 ? true : false, // determina el tamaño del dispositivo para saber si es mobile o no
		isTablet: window.screen.width < 1020,
		dataVotos: [],
		totalUser: 0,
		totalVotosUser: 0,
		resultVotos: {
			porcentajevotos: 0,
			sumadVotacion: 0,
			usuariosSinRespuesta: 0,
		},
	});

	const dismiss = () => {
		if (state.chart) {
			state.chart.destroy();
		}
	};
	// Funcion que permite dividir una cadena
	const divideString = (string: string) => {
		let separatedByWhiteSpace = string.split(/\s/);
		let times;
		let text = [];

		if (string.length > 140) {
			times = 3;
		} else {
			times = 2;
		}

		for (let index = times; index > 0; index--) {
			const m1 = separatedByWhiteSpace.splice(0, separatedByWhiteSpace.length / index);
			const m2 = m1.join(' ');
			text.push(m2);
		}
		return text;
	};

	const loadData = useCallback(async () => {
		const { idSurvey, eventId } = props;
		const response = await SurveysApi.getOne(eventId, idSurvey);
		const usersRegistered = await UsersApi.getAll(eventId);
		let totalUsersRegistered = 0;

		//Se realiza sumatoria de usuarios checkeados para realizar calculo de porcentaje
		for (let i = 0; usersRegistered.data.length > i; i++) {
			if (usersRegistered.data[i].checkedin_at) {
				totalUsersRegistered = totalUsersRegistered + 1;
			}
		}

		setState(prev => ({
			...prev,
			dataSurvey: response,
			usersRegistered: totalUsersRegistered,
			totalUser: totalUsersRegistered,
		}));
		mountChart();
	}, [props.idSurvey, props.eventId]);

	const setCurrentPage = (page: any) => {
		setState(prev => ({ ...prev, currentPage: page }));
		mountChart();
	};

	const getGraphicsConfiguration = (type: 'x' | 'y' | 'pie') => {
		const { horizontalBar, ChartPie, verticalBar } = graphicsFrame;
		let graphy: ChartConfiguration | null = null;

		if (type === ChartPie.type || window.screen.width <= 800) {
			graphy = ChartPie;
		} else if (type === horizontalBar.indexAxis) {
			graphy = horizontalBar;
		} else {
			graphy = verticalBar;
		}
		return graphy;
	};

	const updateData = ({ options, answer_count, optionsIndex }: any) => {
		let { graphicsFrame, chartCreated, chart } = state;
		let { horizontalBar, ChartPie, verticalBar } = graphicsFrame;
		const { operation } = props;

		const graphyType = state.dataSurvey?.graphyType as 'x' | 'y' | 'pie';
		console.log('test:graphyType', graphyType);
		// const graphy = getGraphicsConfiguration(graphyType)

		const graphy: ChartConfiguration =
			graphyType === ChartPie.type || window.screen.width <= 800
				? ChartPie
				: graphyType === horizontalBar.indexAxis
				? horizontalBar
				: verticalBar;
		// if(graphyType === ChartPie)

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
		let porcentaj_answer = 0;
		let colorB = [];
		let list: any[] = [];

		/**
		 * Given a number, return the letter of the alphabet that corresponds to that number
		 * @returns The numberToLetterOfAlphabet function is returning the order of the alphabet that the
		 * number is in.
		 */
		const numberToLetterOfAlphabet = (number: number) => {
			// @ts-ignore
			const alphabet = graphy.data.datasets[0].alphabet;

			let orderAlphabet = alphabet[number % alphabet.length];
			if (number < 26) return orderAlphabet;

			return orderAlphabet + number;
		};

		//Se iguala options.choices[a] a una cadena string dinamica para agregar la cantidad de votos de la respuesta
		// colorB = graphy.data.datasets[0].backgroundColor;
		const colorsforGraphics = graphy.data.datasets[0].backgroundColor;

		for (let a = 0; options.choices.length > a; a++) {
			// @ts-ignore
			colorB = colorsforGraphics[a % colorsforGraphics.length];
			// options.choices[a] = `${options.choices[a]}:` + `${answer_count[a]} Voto(s): ${totalPercentResponse[a]} %`}
			switch (operation) {
				case 'onlyCount':
					generatedlabels[a] =
						answer_count && answer_count[a] ? options.choices[a] + ` ${answer_count[a][0]} Voto(s)` : '0 Votos';
					break;
				case 'participationPercentage':
					generatedlabels[a] =
						answer_count && answer_count[a]
							? `${numberToLetterOfAlphabet(a)}  ${answer_count[a][0]} Voto(s), ${answer_count[a][1]}% \n `
							: '0 Votos';
					break;
			}
			porcentaj_answer = answer_count[a][1];

			list.push({
				voto: answer_count[a][0],
				porcentaje: answer_count[a][1],
				answer: options.choices[a],
				option:
					options.choices[a] == 'SI' || options.choices[a] == 'si' ? options.choices[a] : numberToLetterOfAlphabet(a),
				color: colorB,
			});
			totalVotosUsuarios = totalVotosUsuarios + answer_count[a][0];
		}
		setState(prev => ({
			...prev,
			dataVotos: list,
		}));

		let respuestadVotos = 0;
		let porcentajeUsuarios = 0;
		let respuestatotal = 0;

		respuestadVotos = state.totalUser - totalVotosUsuarios;
		respuestadVotos = respuestadVotos > 0 ? respuestadVotos : 0;
		// @ts-ignore
		porcentajeUsuarios = respuestadVotos > 0 ? parseInt((respuestadVotos * 100) / this.state.totalUser) : 0;
		console.log('test:generatedlabels', generatedlabels);
		setState(prev => ({
			...prev,
			resultVotos: {
				sumadVotacion: totalVotosUsuarios,
				usuariosSinRespuesta: respuestadVotos,
				porcentajevotos: porcentajeUsuarios,
			},
		}));

		let formatterTitle = options.title;
		setState(prev => ({ ...prev, titleQuestion: formatterTitle }));
		if (options.title && options.title.length > 70) formatterTitle = divideString(options.title);

		// Se condiciona si el grafico ya fue creado
		// En caso de que aun no este creado se crea, de lo contrario se actualizara
		if (!chartCreated) {
			// Se asignan los valores obtenidos de los servicios
			// El nombre de las opciones y el conteo de las opciones
			graphy.data.labels = generatedlabels;
			graphy.data.datasets[0].data = Object.values(totalPercentResponse || []);
			// @ts-ignore
			graphy.options.title.text = formatterTitle;

			//Chart.pluginService.register(customPlugin);

			/* Fin del codigo de referencia para registrar la configuracion
        de lo métodos de la API  de ChartJS
      */

			graphy.options = {
				responsive: state.isMobile ? true : false,
				title: {
					fontSize: 16,
					display: true,
					text: '',
				},
				position: 'left',
				plugins: {
					datalabels: {
						color: '#333',
						formatter: (value: any, context: any) => {
							return context.chart.data.labels[context.dataIndex];
						},
						textAlign: 'left',
						anchor: 'start',
						align: 5,
					},
					legend: {
						display: true,
						labels: {
							font: {
								size: state.isMobile ? 12 : 18,
								family: "'Montserrat', sans-serif", // para probar si afecta la fuente cambiar Montserrat por Papyrus
								// @ts-ignore
								textAlign: 'left',
								boxWidth: '50',
							},
						},
						maxWidth: 250,
						position: state.isMobile ? 'top' : 'left',
					},
				},
				scales: {
					// @ts-ignore
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
					// @ts-ignore
					x: [
						{
							ticks: {
								beginAtZero: true,
								fontColor: '#777',
							},
						},
					],
				},
				indexAxis: graphyType,
			};

			// Se obtiene el canvas del markup y se utiliza para crear el grafico
			let chart: Chart;
			if (document.getElementById('chart')) {
				const canvasElement = document.getElementById('chart') as HTMLCanvasElement;
				if (canvasElement) {
					const canvas = canvasElement.getContext('2d');
					if (canvas) {
						chart = new Chart(canvas, graphy);
						setState(prev => ({ ...prev, graphy, chart, chartCreated: true }));
					}
				}
			}
		} else {
			if (!chart) return;
			// Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
			chart.data.labels = generatedlabels;
			chart.data.datasets[0].data = Object.values(totalPercentResponse || []);
			console.log('test:Object.values(totalPercentResponse || [])', Object.values(totalPercentResponse || []));
			// @ts-ignore
			chart.options.title.text = formatterTitle;
			console.log('test:formatterTitle', formatterTitle);

			//Si es un examen Marcamos la respuesta correcta en verde
			// if (options.correctAnswerIndex) {
			//   graphy.data.datasets[0].backgroundColor = [];
			//   graphy.data.datasets[0].backgroundColor[options.correctAnswerIndex] = 'rgba(50, 255, 50, 0.6)';
			// }

			chart.update();
			setState(prev => ({ ...prev, chart, currentPage: optionsIndex + 1 }));
		}
	};

	const mountChart = async () => {
		const { idSurvey, eventId, operation } = props;
		let { dataSurvey, currentPage } = state;
		if (dataSurvey) {
			let { questions } = dataSurvey;
			// Se ejecuta servicio para tener el conteo de las respuestas
			await SurveyAnswers.getAnswersQuestion(idSurvey, questions[currentPage - 1].id, eventId, updateData, operation);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		console.log(state.dataSurvey);
	}, [state.dataSurvey]);
	// const componentDidMount = async () => {
	// };

	const { dataSurvey, currentPage, titleQuestion, dataVotos } = state;
	console.log('test:Graphics.this.props', props);
	console.log('test:Graphics.this.state', state);

	const { Paragraph } = Typography;
	const { surveyLabel } = props;

	// let cSurveys = this.context;
	if (!dataSurvey) return null;

	if (!dataSurvey.questions) return <Loading />;


	return (
		// <>
		// 	<ChartRender
		// 		type='horizontal'
		// 		labels={['A  1 Voto(s), 25%', 'B  3 Voto(s), 75%']}
		// 		dataValues={[25, 75]}
		// 		isMobile={false}
		// 	/>
		// 	{/* <PieChartGraphic labels={['A  1 Voto(s), 25%', 'B  3 Voto(s), 75%']} dataValues={[25, 75]} /> */}
		// 	{/* <HorizontalChartGraphic labels={['A  1 Voto(s), 25%', 'B  3 Voto(s), 75%']} dataValues={[25, 75]} />
		// 	<HorizontalChartGraphic labels={['A  1 Voto(s), 25%', 'B  3 Voto(s), 75%']} dataValues={[25, 75]} /> */}
		// </>

		<>
			<Card bodyStyle={{ padding: '0' }} className='survyCard'>
				{/* <strong style={{ fontSize: '18px' }}>{cSurveys.currentSurvey.name}</strong>
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
		        </div> */}
				<strong style={{ fontSize: '16px' }}>{titleQuestion}</strong>
				{/* esta validacion es para que tomo los estilos la torta */}
				{/*
				 */}
				<Card bodyStyle={{ padding: '0px' }}>
					<Row justify='center'>
						<canvas
							id='chart'
							width='600'
							height='400'
							// style={{width:'500px', height:'700px'}}
						></canvas>
					</Row>
				</Card>

				<br />
				<Pagination current={currentPage} total={dataSurvey.questions.length * 10} onChange={setCurrentPage} />
			</Card>
			<br />
			<Row>
				{dataVotos.map((votos: any, key: number) => (
					<Fragment key={key}>
						<br />
						<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={8}>
							<div
								style={{
									width: '320px',
									borderRadius: '6px',
									boxShadow: '0px 4px 4px 0px #00000040',
									marginTop: '12px',
									marginBottom: '12px',
								}}>
								<Row>
									<Col span={votos.option == 2 ? 8 : 5} style={{ width: '100%' }}>
										<div
											style={{
												height: '100%',
												width: '100%',
												backgroundColor: `${votos.color}`,
												borderRadius: '4px 0px 0px 4px',
											}}>
											<span
												style={{
													justifyContent: 'center',
													alignContent: 'center',
													height: '100%',
													color: 'white',
													display: 'grid',
													fontSize: '24px',
												}}>
												{votos?.option?.toUpperCase()}{' '}
											</span>
										</div>
									</Col>
									<Col span={votos.option == 2 ? 16 : 19}>
										<div style={{ marginLeft: '12px', marginRight: '12px', fontWeight: '600', marginTop: '4px' }}>
											<div style={{ fontSize: '14px', fontWeight: '600' }}>
												<span>{votos.voto} Voto(s)</span>
												<span style={{ float: 'right', fontSize: '16px' }}>{votos.porcentaje} % </span>
											</div>
											<div>
												<Paragraph
													style={{ color: 'gray ' }}
													ellipsis={true && { rows: 2, expandable: true, symbol: 'more' }}>
													{votos.answer}
												</Paragraph>
											</div>
										</div>
									</Col>
								</Row>
							</div>{' '}
						</Col>
					</Fragment>
				))}
				<br />
				{parseStringBoolean(cSurveys.currentSurvey.showNoVotos) && (
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={8}>
						<div
							style={{
								height: '76px',
								width: '320px',
								borderRadius: '6px',
								boxShadow: '0px 4px 4px 0px #00000040',
							}}>
							<Row>
								<Col span={8}>
									<div
										style={{
											height: '76px',
											width: '100%',
											backgroundColor: '#9e9e9e',
											borderRadius: '4px 0px 0px 4px',
										}}>
										<span
											style={{
												justifyContent: 'center',
												alignContent: 'center',
												height: '100%',
												color: 'white',
												display: 'grid',
												fontSize: '18px',
												textAlign: 'center',
											}}>
											Sin responder
										</span>
									</div>
								</Col>
								<Col span={16}>
									<div
										style={{
											marginLeft: '12px',
											marginRight: '12px',
											fontWeight: '600',
											display: 'grid',
											alignContent: 'center',
											height: '100%',
										}}>
										<div>
											<span style={{ fontSize: '22px', fontWeight: '500' }}>
												{state.resultVotos.usuariosSinRespuesta} Voto(s)
											</span>
											<span style={{ fontSize: '22px', fontWeight: '500', float: 'right' }}>
												{state.resultVotos.porcentajevotos} %{' '}
											</span>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					</Col>
				)}
			</Row>
		</>
	);
}

const mapDispatchToProps = { setCurrentSurvey, setSurveyVisible };

const mapStateToProps = (state: any) => ({
	currentActivity: state.stage.data.currentActivity,
});

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);
