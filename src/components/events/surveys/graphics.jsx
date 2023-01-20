import { Component } from 'react';
import { connect } from 'react-redux';
import 'chartjs-plugin-datalabels';
import { Pagination, Card, Button, Row, Col, Typography, Avatar, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Loading from './loading';

import Chart from 'chart.js/auto';

import SurveyAnswers from './services/surveyAnswersService';
import { SurveysApi, UsersApi } from '../../../helpers/request';
import { graphicsFrame } from './frame';

import * as SurveyActions from '../../../redux/survey/actions';
import { SurveysContext } from '../../../context/surveysContext';
import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import ProgressQuestionIcon from "@2fd/ant-design-icons/lib/ProgressQuestion";
import { singularOrPluralString } from '@/Utilities/singularOrPluralString';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

class Graphics extends Component {
	static contextType = SurveysContext;
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
			isTablet: window.screen.width < 1020,
			dataVotos: [],
			totalUser: 0,
			totalVotosUser: 0,
			resultVotos: {},
		};
	}
	dismiss() {
		this.chart.destroy();
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

		this.setState(
			{ dataSurvey: response, usersRegistered: totalUsersRegistered, totalUser: totalUsersRegistered },
			this.mountChart
		);
	};

	setCurrentPage = (page) => {
		this.setState({ currentPage: page }, this.mountChart);
	};

	updateData = ({ options, answer_count, optionsIndex }) => {
		let { graphicsFrame, chartCreated, chart } = this.state;
		let { horizontalBar, ChartPie, verticalBar } = graphicsFrame;
		const { operation } = this.props;

		let graphyType = this.state.dataSurvey.graphyType;
		let graphy =
			graphyType === ChartPie.type || window.screen.width <= 800
				? ChartPie
				: graphyType === horizontalBar.indexAxis
				? horizontalBar
				: verticalBar;

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
		let list = [];

		/**
		 * Given a number, return the letter of the alphabet that corresponds to that number
		 * @returns The numberToLetterOfAlphabet function is returning the order of the alphabet that the
		 * number is in.
		 */
		const numberToLetterOfAlphabet = (number) => {
			const alphabet = graphy.data.datasets[0].alphabet;

			let orderAlphabet = alphabet[number % alphabet.length];
			if (number < 26) return orderAlphabet;

			return orderAlphabet + number;
		};

		//Se iguala options.choices[a] a una cadena string dinamica para agregar la cantidad de votos de la respuesta
		// colorB = graphy.data.datasets[0].backgroundColor;
		const colorsforGraphics = graphy.data.datasets[0].backgroundColor;

		for (let a = 0; options.choices.length > a; a++) {
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
		this.setState({
			dataVotos: list,
		});

		let respuestadVotos = 0;
		let porcentajeUsuarios = 0;
		let respuestatotal = 0;

		respuestadVotos = this.state.totalUser - totalVotosUsuarios;
		respuestadVotos = respuestadVotos > 0 ? respuestadVotos : 0;
		porcentajeUsuarios = respuestadVotos > 0 ? parseInt((respuestadVotos * 100) / this.state.totalUser) : 0;

		this.setState({
			resultVotos: {
				sumadVotacion: totalVotosUsuarios,
				usuariosSinRespuesta: respuestadVotos,
				porcentajevotos: porcentajeUsuarios,
			},
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

			//Chart.pluginService.register(customPlugin);

			/* Fin del codigo de referencia para registrar la configuracion
        de lo métodos de la API  de ChartJS
      */

			graphy.options = {
				responsive: this.state.isMobile ? true : false,
				title: {
					fontSize: 16,
					display: true,
					text: '',
				},
				position: 'left',
				plugins: {
					datalabels: {
						color: '#333',
						formatter: function(value, context) {
							return context.chart.data.labels[context.dataIndex];
						},
						textAlign: 'left',
						anchor: 'start',
						align: 5,
						// font: {
						//   size: this.state.isMobile ? 12 : 22, // otorga el tamaño de la fuente en los resultados de la encuesta segun el dispositivo
						// },
					},
					legend: {
						display: true,
						labels: {
							font: {
								size: this.state.isMobile ? '12' : '18',
								family: "'Montserrat', sans-serif", // para probar si afecta la fuente cambiar Montserrat por Papyrus
								textAlign: 'left',
								boxWidth: '50',
							},
						},
						maxWidth: '250',
						position: this.state.isMobile ? 'top' : 'left',
					},
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
				indexAxis: graphyType,
			};

			// Se obtiene el canvas del markup y se utiliza para crear el grafico
			let chart;
			if (document.getElementById('chart')) {
				const canvas = document.getElementById('chart').getContext('2d');
				chart = new Chart(canvas, graphy);
				this.setState({ graphy, chart, chartCreated: true });
			}
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
			this.setState({ chart, currentPage: optionsIndex + 1 });
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
		const { Paragraph } = Typography;
		const { surveyLabel } = this.props;
		let cSurveys = this.context;
		if (dataSurvey.questions)
			return (
				<Row gutter={[0, 16]}>
					<Col span={24}>
						<Card title={titleQuestion} headStyle={{ border: 'none' }}>
							<Row gutter={[0, 8]} justify='center'>
								<canvas id='chart' style={{ width: '100%', height: '400px' }}></canvas>
								<Col span={24}>
									<Pagination
										current={currentPage}
										total={dataSurvey.questions.length * 10}
										onChange={this.setCurrentPage}
									/>
								</Col>
							</Row>
						</Card>
					</Col>
					<Col span={24}>
						<Card>
							<Row gutter={[16, 16]}>
								{dataVotos.map((votos) => (
									<Col key={votos?.option?.toUpperCase()} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
										<Card bodyStyle={{ padding: '0px' }}>
											<Space align='start'>
												<Avatar size={76} shape='square' style={{ backgroundColor: `${votos.color}` }}>
													{votos?.option?.toUpperCase()}
												</Avatar>
												<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
													<span style={{ fontWeight: '600' }}>
                            {singularOrPluralString(votos.voto,'Voto','Votos')}
                            </span>
													<Paragraph
														style={{ color: '#808080' }}
														ellipsis={true && { rows: 2, expandable: true, symbol: 'more' }}>
														{votos.answer}
													</Paragraph>
												</Space>
											</Space>
											<span style={{ position: 'absolute', top: '5px', right: '10px', fontWeight: '600' }}>
												{votos.porcentaje}%
											</span>
										</Card>
									</Col>
								))}
								{parseStringBoolean(cSurveys.currentSurvey.showNoVotos) && (
									<Col key={'usuariosSinRespuesta'} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
										<Card bodyStyle={{ padding: '0px' }}>
											<Space align='start'>
												<Avatar icon={<ProgressQuestionIcon />} size={76} shape='square' style={{ backgroundColor: '#9e9e9e' }}>
												</Avatar>
												<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
													<span style={{ fontWeight: '600' }}>
                            {singularOrPluralString(this.state.resultVotos.usuariosSinRespuesta,'Participante','Participantes')}
													</span>
													<Paragraph
														style={{ color: '#808080' }}
														ellipsis={true && { rows: 2, expandable: true, symbol: 'more' }}>
														Sin responder
													</Paragraph>
												</Space>
											</Space>
											<span style={{ position: 'absolute', top: '5px', right: '10px', fontWeight: '600' }}>
												{this.state.resultVotos.porcentajevotos}%
											</span>
										</Card>
									</Col>
								)}
							</Row>
						</Card>
					</Col>
				</Row>
			);
		return <Loading />;
	}
}
const mapDispatchToProps = { setCurrentSurvey, setSurveyVisible };
const mapStateToProps = (state) => ({
	currentActivity: state.stage.data.currentActivity,
});
export default connect(mapStateToProps, mapDispatchToProps)(Graphics);