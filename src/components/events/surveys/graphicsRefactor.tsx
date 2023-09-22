import 'chartjs-plugin-datalabels';
import { COLORS_SETTINGS } from './chartsConfiguration';
import { connect } from 'react-redux';
import { GraphicsData, GraphicsState } from './types';
import { numberToAlphabet } from './utils/numberToAlphabet';
import { Pagination, Card, Row, Col, Typography, Space, Avatar, Statistic } from 'antd';
import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { singularOrPluralString } from '@/Utilities/singularOrPluralString';
import { SurveysApi, UsersApi } from '../../../helpers/request';
import { useEffect, useState } from 'react';
import { UseEventContext } from '@/context/eventContext';
import { UseSurveysContext } from '../../../context/surveysContext';
import * as SurveyActions from '../../../redux/survey/actions';
import ChartRender from './ChartRender';
import SurveyAnswers from './services/surveyAnswersService';
import useWindowSize from '@/hooks/useWindowSize';

const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

function Graphics(props: any) {
	const { eventId, idSurvey, operation } = props;
	const cEvent = UseEventContext();
	const cSurveys : any= UseSurveysContext();
	const isAssambley = cEvent.value.user_properties.some((property: any) => property.type === 'voteWeight');
	const [graphicType, setGraphicType] = useState<'horizontal' | 'vertical' | 'pie'>('vertical');
	const [graphicsData, setGraphicsData] = useState<GraphicsData>({
		dataValues: [],
		labels: [],
		labelsToShow: [],
	});
	const [state, setState] = useState<GraphicsState>({
		dataSurvey: null,
		currentPage: 1,
		graphicsFrame: null,
		currentChart: {
			labels: [],
			dataValues: [],
			typeQuestion:''
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

	const windowSize = useWindowSize();

	useEffect(() => {
		if (window.screen.width < 800) {
			setState((prev) => ({ ...prev, isMobile: true }));
		} else {
			setState((prev) => ({ ...prev, isMobile: false }));
		}
		if (window.screen.width < 1020) {
			setState((prev) => ({ ...prev, isTablet: true }));
		} else {
			setState((prev) => ({ ...prev, isTablet: false }));
		}
	}, [windowSize]);

	const fetchSurveyData = async () => {
		try {
			setState((prev) => ({ ...prev, loading: true }));
			const dataSurvey = await SurveysApi.getOne(eventId, idSurvey);
			const usersRegistered = await UsersApi.getAll(eventId);
			const usersChecked = usersRegistered.data.filter((user: any) => !!user.checked_in);
			setState((prev) => ({
				...prev,
				dataSurvey,
				usersRegistered: usersChecked,
				totalUser: usersChecked.length,
			}));
			getGraphicType(dataSurvey.graphyType);
		} catch (error) {
			console.log(error);
		} finally {
			setState((prev) => ({ ...prev, loading: false }));
		}
	};

	useEffect(() => {

		fetchSurveyData().then(() => {
			mountChart();
		}).catch(()=>{});

	}, [eventId, idSurvey]);

	useEffect(() => {
		mountChart();
	}, [state.currentPage, state.dataSurvey]);

	const setCurrentPage = (page: number, pageSize: number) => {
		setState((prev) => ({ ...prev, currentPage: page }));
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

	interface UpdateDataProps {
		options: Options;
		answer_count: Array<number[]>;
		optionsIndex: number;
	}

	interface Options {
		title: string;
		type: string;
		choices: string[];
		id: string;
		image: null;
		points: string;
	}

	interface List {
		voto: number;
		porcentaje: number;
		answer: string;
		option: string;
		color: string;
	}

	const updateData = ({ options, answer_count, optionsIndex }: UpdateDataProps) => {
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
		let colorB = COLORS_SETTINGS.backgroundColor[0];
		let list: List[] = [];

		//Se iguala options.choices[a] a una cadena string dinamica para agregar la cantidad de votos de la respuesta

		const colorsforGraphics = COLORS_SETTINGS.backgroundColor;

		for (let a = 0; options.choices?.length > a; a++) {
			// @ts-ignore
			colorB = colorsforGraphics[a % colorsforGraphics.length];
			// @ts-ignore
			options.choices[a] = `${options.choices[a]}:` + `${answer_count[a]} Voto(s): ${totalPercentResponse[a]} %`;
			switch (operation) {
				case 'onlyCount':
					generatedlabels[a] = answer_count[a] ? options.choices[a] + ` ${answer_count[a][0]} Voto(s)` : '0 Votos';
					break;
				case 'participationPercentage':
					generatedlabels[a] = answer_count[a] !== undefined	? `${numberToAlphabet(a)}  ${answer_count[a][0]} Voto(s), ${answer_count[a][1]}% \n `
							: '0 Votos';
					break;
			}
			list.push({
				voto: answer_count[a][0],
				porcentaje: answer_count[a][1],
				answer: options.choices[a],
				option: options.choices[a] == 'SI' || options.choices[a] == 'si' ? options.choices[a] : numberToAlphabet(a),
				color: colorB,
			});
			totalVotosUsuarios = totalVotosUsuarios + answer_count[a][0];
		}
		setState((prev) => ({
			...prev,
			dataVotos: list,
		}));

		let respuestadVotos = 0;
		let porcentajeUsuarios = 0;
		let respuestatotal = 0;

		respuestadVotos = state.totalUser - totalVotosUsuarios;
		respuestadVotos = respuestadVotos > 0 ? respuestadVotos : 0;
		porcentajeUsuarios = respuestadVotos > 0 ? (respuestadVotos * 100) / state.totalUser : 0;

		setState((prev) => ({
			...prev,
			resultVotos: {
				sumadVotacion: totalVotosUsuarios,
				usuariosSinRespuesta: respuestadVotos,
				porcentajevotos: porcentajeUsuarios,
			},
		}));

		let formatterTitle = options.title;
		setState((prev) => ({ ...prev, titleQuestion: formatterTitle }));
		setState((prev) => ({
			...prev,
			currentChart: {
				...prev.currentChart,
				dataValues: Object.values(totalPercentResponse || []),
				labels: generatedlabels,
				typeQuestion:options.type
			},
		}));
	};

	const mountChart = async () => {
		if (!state.dataSurvey) return;
		await SurveyAnswers.getAnswersQuestion(
			idSurvey,
			state.dataSurvey.questions[state.currentPage - 1].id,
			eventId,
			updateData,
			operation
		);
		if (isAssambley) {
			await SurveyAnswers.listenAnswersQuestion(
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
			getGraphicType(state.dataSurvey.graphyType);
		}
	}, [state.dataSurvey]);

	if (!state.dataSurvey) return null;
	return (
		<Row gutter={[0, 16]}>
			{/* Graphic */}
			<Col span={24}>
				<Card title={state.titleQuestion} headStyle={{ border: 'none' }}>
					<Row gutter={[0, 0]} justify='center'>
						{isAssambley ? (
							<ChartRender
								dataValues={graphicsData.dataValues}
								isMobile={state.isMobile}
								labels={graphicsData.labelsToShow}
								type={graphicType}
							/>
						) : (
							<ChartRender
								dataValues={state.currentChart.dataValues}
								isMobile={state.isMobile}
								labels={state.currentChart.labels}
								type={graphicType}
								typeQuestion={state.currentChart.typeQuestion}
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
				{state.currentChart.typeQuestion !== 'text' && <Card headStyle={{border:'none'}} bodyStyle={{paddingTop:'0px'}} title={`Conteo de votos`}>
					<Row gutter={[16, 16]}>
						{/* Cards Questions */}
						{isAssambley &&
							graphicsData.labels.map((label, index) => (
								<Col key={`card-question-${index}`} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card bodyStyle={{ padding: '0px' }}>
										<Space align='start'>
											<Avatar size={80} shape='square' style={{ backgroundColor: `${label.color}` }}>
												{label.letter}
											</Avatar>
											<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
												<span style={{ fontWeight: '600' }}>
													{singularOrPluralString(label.quantity, 'Voto', 'Votos')}
												</span>
												<Typography.Paragraph
													style={{ color: '#808080', lineHeight: '1.25' }}
													ellipsis={{ rows: 2, expandable: false, tooltip: label.question }}>
													{label.question}
												</Typography.Paragraph>
											</Space>
										</Space>
										<span style={{ position: 'absolute', top: '5px', right: '10px', fontWeight: '600' }}>
											{label.percentage} %
										</span>
									</Card>
								</Col>
							))}
						{!isAssambley &&
							state.dataVotos.map((votos, index) => (
								<Col key={`card-no-response-${index}`} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									{console.log({ votos })}
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
					</Row>
				</Card>}
			</Col>
			{parseStringBoolean(cSurveys.currentSurvey.showNoVotos) && (
				<Col span={24}>
					<Card headStyle={{border:'none'}} bodyStyle={{paddingTop:'0px'}} title={`Participación`}>
						<Row gutter={[16, 16]}>
							<Col order={1} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
								<Card bodyStyle={{}}>
									<Statistic
										title='Cantidad de inscritos que participaron en esta pregunta'
										value={state.totalUser - state.resultVotos.usuariosSinRespuesta }
										precision={0}
										valueStyle={{ color: '#1890FF' }}
										suffix={singularOrPluralString(
											state.totalUser - state.resultVotos.usuariosSinRespuesta,
											'Participante',
											'Participantes',
											true
										)}
									/>
								</Card>
							</Col>
							<Col order={2} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
								<Card>
									<Statistic
										title='Cantidad de inscritos que no participaron en esta pregunta'
										value={state.resultVotos.usuariosSinRespuesta}
										precision={0}
										valueStyle={{ color: '#1890FF' }}
										suffix={singularOrPluralString(
											state.resultVotos.usuariosSinRespuesta,
											'Participante',
											'Participantes',
											true
										)}
									/>
								</Card>
							</Col>
						</Row>
					</Card>
				</Col>
			)}
		</Row>
	);
}

const mapDispatchToProps = { setCurrentSurvey, setSurveyVisible };

const mapStateToProps = (state: any) => ({
  currentActivity: state.stage.data.currentActivity,
});

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);
