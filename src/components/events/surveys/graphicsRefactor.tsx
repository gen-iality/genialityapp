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
import { GraphicsData, GraphicsState } from './types';
import ChartRender from './ChartRender';
import { singularOrPluralString } from '@/Utilities/singularOrPluralString';
import ProgressQuestionIcon from '@2fd/ant-design-icons/lib/ProgressQuestion';
import { ALPHABET, COLORS_SETTINGS } from './chartsConfiguration';
import { numberToAlphabet } from './utils/numberToAlphabet';
import { divideString } from './utils/divideString';
import { UseEventContext } from '@/context/eventContext';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

function Graphics(props: any) {
	console.log('props', props);
	const { currentActivity, eventId, idSurvey, operation } = props;
	const cEvent = UseEventContext();
	const cSurveys = UseSurveysContext();
	const isAssambley = cEvent.value.user_properties.some((property: any) => property.type === 'voteWeight');
	const [graphicType, setGraphicType] = useState<'horizontal' | 'vertical' | 'pie'>('vertical');
	const [graphicsData, setGraphicsData] = useState<GraphicsData>({
		dataValues: [],
		labels: [],
	});
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
		console.log('isAssambley', isAssambley);
	}, [isAssambley]);

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
				option: options.choices[a] == 'SI' || options.choices[a] == 'si' ? options.choices[a] : numberToAlphabet(a),
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
		setState(prev => ({
			...prev,
			currentChart: {
				...prev.currentChart,
				dataValues: Object.values(totalPercentResponse || []),
				labels: generatedlabels,
			},
		}));
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
			state.dataSurvey.questions[state.currentPage - 1].id,
			eventId,
			updateData,
			operation
		);
		if (isAssambley) {
			SurveyAnswers.listenAnswersQuestion(
				idSurvey,
				state.dataSurvey.questions[state.currentPage - 1].id,
				eventId,
				setGraphicsData,
				operation
			);
		}
	};

	useEffect(() => {
		if (state.dataSurvey) {
			getGraphicType(state.dataSurvey.graphyType)
		}
	}, [state.dataSurvey]);

	if (!state.dataSurvey) return null;
	return (
		<Row gutter={[0, 16]}>
			{/* Graphic */}
			<Col span={24}>
				<Card title={state.titleQuestion} headStyle={{ border: 'none' }}>
					<Row gutter={[0, 8]} justify='center'>
						{isAssambley ? (
							<ChartRender
								dataValues={graphicsData.dataValues}
								isMobile={state.isMobile}
								labels={graphicsData.labels}
								type={graphicType}
							/>
						) : (
							<ChartRender
								dataValues={state.currentChart.dataValues}
								isMobile={state.isMobile}
								labels={state.currentChart.labels}
								type={graphicType}
							/>
						)}
						<Col span={24}>
							<Pagination
								current={state.currentPage}
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
						{state.dataVotos.map(votos => (
							<Col key={votos?.option?.toUpperCase()} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
								<Card bodyStyle={{ padding: '0px' }}>
									<Space align='start'>
										<Avatar size={80} shape='square' style={{ backgroundColor: `${votos.color}` }}>
											{votos?.option?.toUpperCase()}
										</Avatar>
										<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
											<span style={{ fontWeight: '600' }}>{singularOrPluralString(votos.voto, 'Voto', 'Votos')}</span>
											<Typography.Paragraph
												style={{ color: '#808080', lineHeight: '1.25' }}
												ellipsis={{ rows: 2, expandable: false, tooltip: votos.answer.split(':')[0] }}>
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
											size={80}
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
												style={{ color: '#808080', lineHeight: '1.25' }}
												ellipsis={true && { rows: 2, expandable: false, symbol: 'more' }}>
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
	);
}

const mapDispatchToProps = { setCurrentSurvey, setSurveyVisible };

const mapStateToProps = (state: any) => ({
	currentActivity: state.stage.data.currentActivity,
});

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);
