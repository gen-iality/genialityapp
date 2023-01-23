import { Component, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import 'chartjs-plugin-datalabels';
import { Pagination, Card, Button, Row, Col, Typography, Space, Avatar } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Loading from './loading';

import Chart, { ChartConfiguration } from 'chart.js/auto';

import SurveyAnswers from './services/surveyAnswersService';
import { SurveysApi, UsersApi } from '../../../helpers/request';
import { graphicsFrame } from './framer';

import * as SurveyActions from '../../../redux/survey/actions';
import { UseSurveysContext } from '../../../context/surveysContext';
import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { GraphicsState } from './types';
import ChartRender from './ChartRender';
import { singularOrPluralString } from '@/Utilities/singularOrPluralString';
import ProgressQuestionIcon from '@2fd/ant-design-icons/lib/ProgressQuestion';
import { ALPHABET, COLORS_SETTINGS } from './chartsConfiguration';
import { numberToAlphabet } from './utils/numberToAlphabet';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

function Graphics(props: any) {
	console.log('props', props);
	const { currentActivity, eventId, idSurvey, operation } = props;
	const cSurveys = UseSurveysContext();
	const [graphicType, setGraphicType] = useState<'horizontal' | 'vertical' | 'pie'>('vertical');
	const [state, setState] = useState<GraphicsState>({
		dataSurvey: null,
		currentPage: 1,
		graphicsFrame,
		currentChart: {
			labels: [],
			dataValues: [],
		},
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

	useEffect(() => {
		console.log('state.resultVotos', state.resultVotos);
	}, [state.resultVotos]);

	const fetchSurveyData = async () => {
		try {
			setState(prev => ({ ...prev, loading: true }));
			const dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
			const usersRegistered = await UsersApi.getAll(eventId);
			const usersChecked = usersRegistered.data.filter((user: any) => !!user.checked_in);
			setState(prev => ({
				...prev,
				dataSurvey,
				usersRegistered: usersChecked,
				totalUser: usersChecked,
			}));
			getGraphicType(dataSurvey.graphyType);
			// mountChart();
		} catch (error) {
			console.log(error);
		} finally {
			setState(prev => ({ ...prev, loading: false }));
		}
	};

	useEffect(() => {
		// if (!state.dataSurvey && !state.usersRegistered) {
		fetchSurveyData().then(() => {
			mountChart();
		});
		// }
	}, [eventId, idSurvey]);

	useEffect(() => {
		mountChart();
	}, [state.currentPage, state.dataSurvey]);

	const setCurrentPage = (page: number, pageSize: number) => {
		// console.log(page, pageSize);
		setState(prev => ({ ...prev, currentPage: page }));
	};

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

	const getGraphicType = (graphyType: string) => {
		if (graphyType === 'pie' || window.screen.width <= 800) {
			setGraphicType('pie');
		} else if (graphyType === 'y') {
			setGraphicType('horizontal');
		} else {
			setGraphicType('vertical');
		}
	};

	const updateData = ({ options, answer_count, optionsIndex }: any) => {
		console.log('Estoy en updateData');
		let totalPercentResponse = {};
		//se realiza iteracion para calcular porcentaje
		for (let i in answer_count) {
			switch (operation) {
				case 'onlyCount':
					// @ts-ignore
					totalPercentResponse[i] = answer_count[i][0];
					break;
				case 'participationPercentage':
					// @ts-ignore
					totalPercentResponse[i] = answer_count[i][1];
					break;
			}
		}
		let generatedlabels: string[] = [];
		let totalVotosUsuarios = 0;
		let porcentaj_answer = 0;
		let colorB = [];
		let list: any[] = [];

		//Se iguala options.choices[a] a una cadena string dinamica para agregar la cantidad de votos de la respuesta
		colorB = COLORS_SETTINGS.backgroundColor;
		const colorsforGraphics = COLORS_SETTINGS.backgroundColor;

		for (let a = 0; options.choices.length > a; a++) {
			// @ts-ignore
			colorB = colorsforGraphics[a % colorsforGraphics.length];
			// @ts-ignore
			options.choices[a] = `${options.choices[a]}:` + `${answer_count[a]} Voto(s): ${totalPercentResponse[a]} %`;
			switch (operation) {
				case 'onlyCount':
					generatedlabels[a] =
						answer_count && answer_count[a] ? options.choices[a] + ` ${answer_count[a][0]} Voto(s)` : '0 Votos';
					break;
				case 'participationPercentage':
					generatedlabels[a] =
						answer_count && answer_count[a]
							? `${numberToAlphabet(a)}  ${answer_count[a][0]} Voto(s), ${answer_count[a][1]}% \n `
							: '0 Votos';
					break;
			}
			porcentaj_answer = answer_count[a][1];

			list.push({
				voto: answer_count[a][0],
				porcentaje: answer_count[a][1],
				answer: options.choices[a],
				option:
					options.choices[a] == 'SI' || options.choices[a] == 'si' ? options.choices[a] : numberToAlphabet(a),
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
		console.log('respuestadVotos', respuestadVotos);
		// @ts-ignore
		porcentajeUsuarios = respuestadVotos > 0 ? parseInt((respuestadVotos * 100) / this.state.totalUser) : 0;

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
		// @ts-ignore
		setState(prev => ({ ...prev, currentChart: { ...prev.currentChart, dataValues: Object.values(totalPercentResponse || []), labels: generatedlabels } }))
		// console.log('state.chart', state.chart);
		// if (state.chart) {
			// state.chart.update();
		// }
	};

	const mountChart = () => {
		console.log('mount -> state.dataSurvey', state.dataSurvey);
		if (!state.dataSurvey) return;
		console.log(`I'm in mountChart`);
		SurveyAnswers.getAnswersQuestion(
			idSurvey,
			state.dataSurvey.questions[currentPage - 1].id,
			eventId,
			updateData,
			operation
		);
	};

	// const dismiss = () => {
	// 	if (state.chart) {
	// 		state.chart.destroy();
	// 	}
	// };
	// // Funcion que permite dividir una cadena
	// const divideString = (string: string) => {
	// 	let separatedByWhiteSpace = string.split(/\s/);
	// 	let times;
	// 	let text = [];

	// 	if (string.length > 140) {
	// 		times = 3;
	// 	} else {
	// 		times = 2;
	// 	}

	// 	for (let index = times; index > 0; index--) {
	// 		const m1 = separatedByWhiteSpace.splice(0, separatedByWhiteSpace.length / index);
	// 		const m2 = m1.join(' ');
	// 		text.push(m2);
	// 	}
	// 	return text;
	// };

	// const loadData = useCallback(async () => {
	// 	const { idSurvey, eventId } = props;
	// 	const response = await SurveysApi.getOne(eventId, idSurvey);
	// 	const usersRegistered = await UsersApi.getAll(eventId);
	// 	let totalUsersRegistered = 0;

	// 	//Se realiza sumatoria de usuarios checkeados para realizar calculo de porcentaje
	// 	for (let i = 0; usersRegistered.data.length > i; i++) {
	// 		if (usersRegistered.data[i].checkedin_at) {
	// 			totalUsersRegistered = totalUsersRegistered + 1;
	// 		}
	// 	}

	// 	setState(prev => ({
	// 		...prev,
	// 		dataSurvey: response,
	// 		usersRegistered: totalUsersRegistered,
	// 		totalUser: totalUsersRegistered,
	// 	}));
	// 	mountChart();
	// }, [props.idSurvey, props.eventId]);

	// const setCurrentPage = (page: any) => {
	// 	setState(prev => ({ ...prev, currentPage: page }));
	// 	mountChart();
	// };

	// const getGraphicsConfiguration = (type: 'x' | 'y' | 'pie') => {
	// 	const { horizontalBar, ChartPie, verticalBar } = graphicsFrame;
	// 	let graphy: ChartConfiguration | null = null;

	// 	if (type === ChartPie.type || window.screen.width <= 800) {
	// 		graphy = ChartPie;
	// 	} else if (type === horizontalBar.indexAxis) {
	// 		graphy = horizontalBar;
	// 	} else {
	// 		graphy = verticalBar;
	// 	}
	// 	return graphy;
	// };

	// const updateData = ({ options, answer_count, optionsIndex }: any) => {
	// 	let { graphicsFrame, chartCreated, chart } = state;
	// 	let { horizontalBar, ChartPie, verticalBar } = graphicsFrame;
	// 	const { operation } = props;

	// 	const graphyType = state.dataSurvey?.graphyType as 'x' | 'y' | 'pie';
	// 	console.log('test:graphyType', graphyType);
	// 	// const graphy = getGraphicsConfiguration(graphyType)

	// 	const graphy: ChartConfiguration =
	// 		graphyType === ChartPie.type || window.screen.width <= 800
	// 			? ChartPie
	// 			: graphyType === horizontalBar.indexAxis
	// 			? horizontalBar
	// 			: verticalBar;
	// 	// if(graphyType === ChartPie)

	// 	let totalPercentResponse = {};
	// 	//se realiza iteracion para calcular porcentaje
	// 	for (let i in answer_count) {
	// 		switch (operation) {
	// 			case 'onlyCount':
	// 				totalPercentResponse[i] = answer_count[i][0];
	// 				break;
	// 			case 'participationPercentage':
	// 				totalPercentResponse[i] = answer_count[i][1];
	// 				break;
	// 		}
	// 	}
	// 	let generatedlabels: string[] = [];
	// 	let totalVotosUsuarios = 0;
	// 	let porcentaj_answer = 0;
	// 	let colorB = [];
	// 	let list: any[] = [];

	// 	/**
	// 	 * Given a number, return the letter of the alphabet that corresponds to that number
	// 	 * @returns The numberToAlphabet function is returning the order of the alphabet that the
	// 	 * number is in.
	// 	 */
	// 	const numberToAlphabet = (number: number) => {
	// 		// @ts-ignore
	// 		const alphabet = graphy.data.datasets[0].alphabet;

	// 		let orderAlphabet = alphabet[number % alphabet.length];
	// 		if (number < 26) return orderAlphabet;

	// 		return orderAlphabet + number;
	// 	};

	// 	//Se iguala options.choices[a] a una cadena string dinamica para agregar la cantidad de votos de la respuesta
	// 	// colorB = graphy.data.datasets[0].backgroundColor;
	// 	const colorsforGraphics = graphy.data.datasets[0].backgroundColor;

	// 	for (let a = 0; options.choices.length > a; a++) {
	// 		// @ts-ignore
	// 		colorB = colorsforGraphics[a % colorsforGraphics.length];
	// 		// options.choices[a] = `${options.choices[a]}:` + `${answer_count[a]} Voto(s): ${totalPercentResponse[a]} %`}
	// 		switch (operation) {
	// 			case 'onlyCount':
	// 				generatedlabels[a] =
	// 					answer_count && answer_count[a] ? options.choices[a] + ` ${answer_count[a][0]} Voto(s)` : '0 Votos';
	// 				break;
	// 			case 'participationPercentage':
	// 				generatedlabels[a] =
	// 					answer_count && answer_count[a]
	// 						? `${numberToAlphabet(a)}  ${answer_count[a][0]} Voto(s), ${answer_count[a][1]}% \n `
	// 						: '0 Votos';
	// 				break;
	// 		}
	// 		porcentaj_answer = answer_count[a][1];

	// 		list.push({
	// 			voto: answer_count[a][0],
	// 			porcentaje: answer_count[a][1],
	// 			answer: options.choices[a],
	// 			option:
	// 				options.choices[a] == 'SI' || options.choices[a] == 'si' ? options.choices[a] : numberToAlphabet(a),
	// 			color: colorB,
	// 		});
	// 		totalVotosUsuarios = totalVotosUsuarios + answer_count[a][0];
	// 	}
	// 	setState(prev => ({
	// 		...prev,
	// 		dataVotos: list,
	// 	}));

	// 	let respuestadVotos = 0;
	// 	let porcentajeUsuarios = 0;
	// 	let respuestatotal = 0;

	// 	respuestadVotos = state.totalUser - totalVotosUsuarios;
	// 	respuestadVotos = respuestadVotos > 0 ? respuestadVotos : 0;
	// 	// @ts-ignore
	// 	porcentajeUsuarios = respuestadVotos > 0 ? parseInt((respuestadVotos * 100) / this.state.totalUser) : 0;
	// 	console.log('test:generatedlabels', generatedlabels);
	// 	setState(prev => ({
	// 		...prev,
	// 		resultVotos: {
	// 			sumadVotacion: totalVotosUsuarios,
	// 			usuariosSinRespuesta: respuestadVotos,
	// 			porcentajevotos: porcentajeUsuarios,
	// 		},
	// 	}));

	// 	let formatterTitle = options.title;
	// 	setState(prev => ({ ...prev, titleQuestion: formatterTitle }));
	// 	if (options.title && options.title.length > 70) formatterTitle = divideString(options.title);

	// 	// Se condiciona si el grafico ya fue creado
	// 	// En caso de que aun no este creado se crea, de lo contrario se actualizara
	// 	if (!chartCreated) {
	// 		// Se asignan los valores obtenidos de los servicios
	// 		// El nombre de las opciones y el conteo de las opciones
	// 		graphy.data.labels = generatedlabels;
	// 		graphy.data.datasets[0].data = Object.values(totalPercentResponse || []);
	// 		setState(prev => ({ ...prev, currentChart: { ...prev, dataValues: Object.values(totalPercentResponse || []) } }));
	// 		// @ts-ignore
	// 		graphy.options.title.text = formatterTitle;

	// 		//Chart.pluginService.register(customPlugin);

	// 		/* Fin del codigo de referencia para registrar la configuracion
	//       de lo métodos de la API  de ChartJS
	//     */

	// 		graphy.options = {
	// 			responsive: state.isMobile ? true : false,
	// 			title: {
	// 				fontSize: 16,
	// 				display: true,
	// 				text: '',
	// 			},
	// 			position: 'left',
	// 			plugins: {
	// 				datalabels: {
	// 					color: '#333',
	// 					formatter: (value: any, context: any) => {
	// 						return context.chart.data.labels[context.dataIndex];
	// 					},
	// 					textAlign: 'left',
	// 					anchor: 'start',
	// 					align: 5,
	// 				},
	// 				legend: {
	// 					display: true,
	// 					labels: {
	// 						font: {
	// 							size: state.isMobile ? 12 : 18,
	// 							family: "'Montserrat', sans-serif", // para probar si afecta la fuente cambiar Montserrat por Papyrus
	// 							// @ts-ignore
	// 							textAlign: 'left',
	// 							boxWidth: '50',
	// 						},
	// 					},
	// 					maxWidth: 250,
	// 					position: state.isMobile ? 'top' : 'left',
	// 				},
	// 			},
	// 			scales: {
	// 				// @ts-ignore
	// 				y: [
	// 					{
	// 						ticks: {
	// 							beginAtZero: true,
	// 							fontSize: 15,
	// 							fontColor: '#777',
	// 							minor: { display: true },
	// 							display: false,
	// 						},
	// 					},
	// 				],
	// 				// @ts-ignore
	// 				x: [
	// 					{
	// 						ticks: {
	// 							beginAtZero: true,
	// 							fontColor: '#777',
	// 						},
	// 					},
	// 				],
	// 			},
	// 			indexAxis: graphyType,
	// 		};

	// 		// Se obtiene el canvas del markup y se utiliza para crear el grafico
	// 		let chart: Chart;
	// 		if (document.getElementById('chart')) {
	// 			const canvasElement = document.getElementById('chart') as HTMLCanvasElement;
	// 			if (canvasElement) {
	// 				const canvas = canvasElement.getContext('2d');
	// 				if (canvas) {
	// 					chart = new Chart(canvas, graphy);
	// 					setState(prev => ({ ...prev, graphy, chart, chartCreated: true }));
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		if (!chart) return;
	// 		// Se asignan los valores obtenidos directamente al "chart" ya creado y se actualiza
	// 		chart.data.labels = generatedlabels;
	// 		setState(prev => ({ ...prev, currentChart: { ...prev.currentChart, labels: generatedlabels } }));
	// 		chart.data.datasets[0].data = Object.values(totalPercentResponse || []);
	// 		console.log('test:Object.values(totalPercentResponse || [])', Object.values(totalPercentResponse || []));
	// 		// @ts-ignore
	// 		chart.options.title.text = formatterTitle;
	// 		console.log('test:formatterTitle', formatterTitle);

	// 		//Si es un examen Marcamos la respuesta correcta en verde
	// 		// if (options.correctAnswerIndex) {
	// 		//   graphy.data.datasets[0].backgroundColor = [];
	// 		//   graphy.data.datasets[0].backgroundColor[options.correctAnswerIndex] = 'rgba(50, 255, 50, 0.6)';
	// 		// }

	// 		chart.update();
	// 		setState(prev => ({ ...prev, chart, currentPage: optionsIndex + 1 }));
	// 	}
	// };

	// const mountChart = async () => {
	// 	const { idSurvey, eventId, operation } = props;
	// 	let { dataSurvey, currentPage } = state;
	// 	if (dataSurvey) {
	// 		let { questions } = dataSurvey;
	// 		// Se ejecuta servicio para tener el conteo de las respuestas
	// 		await SurveyAnswers.getAnswersQuestion(idSurvey, questions[currentPage - 1].id, eventId, updateData, operation);
	// 	}
	// };

	useEffect(() => {
		console.log('state.dataSurvey', state.dataSurvey);
	}, [state.dataSurvey]);

	// useEffect(() => {
	// 	loadData();
	// }, []);

	// useEffect(() => {
	// 	console.log('test:state', state.dataSurvey);
	// }, [state.dataSurvey]);
	// // const componentDidMount = async () => {
	// // };

	// const { dataSurvey, currentPage, titleQuestion, dataVotos } = state;
	// console.log('test:Graphics.this.props', props);
	// console.log('test:Graphics.this.state', state);

	// const { Paragraph } = Typography;
	// const { surveyLabel } = props;

	// // let cSurveys = this.context;
	// if (!dataSurvey) return null;

	// if (!dataSurvey.questions) return <Loading />;

	const { titleQuestion, currentPage, dataSurvey, dataVotos } = state;

	if (!state.dataSurvey) return null;
	return (
		// <>
		// 	<ChartRender
		// 		type='horizontal'
		// 		labels={['A  1 Voto(s), 25%', 'B  3 Voto(s), 75%']}
		// 		dataValues={[25, 75]}
		// 		isMobile={false}
		// 	/>
		// </>
		<>
			<Row gutter={[0, 16]}>
				{/* Graphic */}
				<Col span={24}>
					<Card title={titleQuestion} headStyle={{ border: 'none' }}>
						<Row gutter={[0, 8]} justify='center'>
							<ChartRender
								dataValues={state.currentChart.dataValues}
								isMobile={state.isMobile}
								labels={state.currentChart.labels}
								type={graphicType}
							/>
							<Col span={24}>
								<Pagination
									current={currentPage}
									total={state.dataSurvey.questions.length * 10}
									onChange={setCurrentPage}
								/>
							</Col>
						</Row>
					</Card>
				</Col>
				{/* Cards */}
				<Col span={24}>
					<Card>
						<Row gutter={[16, 16]}>
							{/* Cards Questions */}
							{dataVotos.map(votos => (
								<Col key={votos?.option?.toUpperCase()} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card bodyStyle={{ padding: '0px' }}>
										<Space align='start'>
											<Avatar size={76} shape='square' style={{ backgroundColor: `${votos.color}` }}>
												{votos?.option?.toUpperCase()}
											</Avatar>
											<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
												<span style={{ fontWeight: '600' }}>{singularOrPluralString(votos.voto, 'Voto', 'Votos')}</span>
												<Typography.Paragraph
													style={{ color: '#808080' }}
													ellipsis={true && { rows: 2, expandable: true, symbol: 'more' }}>
													{votos.answer.split(':')[0]}
												</Typography.Paragraph>
											</Space>
										</Space>
										<span style={{ position: 'absolute', top: '5px', right: '10px', fontWeight: '600' }}>
											{votos.porcentaje}%
										</span>
									</Card>
								</Col>
							))}
							{/* Card Users Without Answer */}
							{parseStringBoolean(cSurveys.currentSurvey.showNoVotos) && (
								<Col key={'usuariosSinRespuesta'} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card bodyStyle={{ padding: '0px' }}>
										<Space align='start'>
											<Avatar
												icon={<ProgressQuestionIcon />}
												size={76}
												shape='square'
												style={{ backgroundColor: '#9e9e9e' }}></Avatar>
											<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
												<span style={{ fontWeight: '600' }}>
													{singularOrPluralString(
														state.resultVotos.usuariosSinRespuesta,
														'Participante',
														'Participantes'
													)}
												</span>
												<Typography.Paragraph
													style={{ color: '#808080' }}
													ellipsis={true && { rows: 2, expandable: true, symbol: 'more' }}>
													Sin responder
												</Typography.Paragraph>
											</Space>
										</Space>
										<span style={{ position: 'absolute', top: '5px', right: '10px', fontWeight: '600' }}>
											{state.resultVotos.porcentajevotos}%
										</span>
									</Card>
								</Col>
							)}
						</Row>
					</Card>
				</Col>
			</Row>
		</>
	);
}

const mapDispatchToProps = { setCurrentSurvey, setSurveyVisible };

const mapStateToProps = (state: any) => ({
	currentActivity: state.stage.data.currentActivity,
});

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);
