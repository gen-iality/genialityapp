import { createRef, useCallback, useEffect, useState } from 'react';
import { selectOptions, surveyTimeOptions } from './constants';
import { SurveysApi, AgendaApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { createOrUpdateSurvey, getSurveyConfiguration, deleteSurvey } from './services';
import { withRouter } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { toolbarEditor } from '../../helpers/constants';
import {
	Button,
	Row,
	Col,
	Table,
	Modal,
	Input,
	Switch,
	Select,
	Tag,
	Form,
	Tooltip,
	Typography,
	Card,
	Space,
} from 'antd';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	EditOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined,
	BarChartOutlined,
	PieChartOutlined,
} from '@ant-design/icons';
import FormQuestionEdit from './formEdit';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import Loading from '../profile/loading';
import { DispatchMessageService } from '../../context/MessageService';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { DataAgendum, Question, State } from './types';
import { parseStringBoolean } from '@/Utilities/parseStringBoolean';

const formLayout = {
	labelCol: { span: 24 },
	wrapperCol: { span: 24 },
};

const { Option, OptGroup } = Select;
const { confirm } = Modal;
const { Title } = Typography;

const parseStringNumber = (value: string | number) => {
	if (typeof value === 'string') {
		return Number(value);
	} else {
		return value;
	}
};

function TriviaEdit(props: any) {
	const [state, setState] = useState<State>({
		_id: '',
		idSurvey: '',
		isLoading: true,
		loading: false,
		redirect: false,
		survey: '',
		activity_id: '',
		dataAgenda: [],
		quantityQuestions: 0,
		listQuestions: [],
		points: 1,
		question: [],
		visibleModal: false,
		confirmLoading: false,
		key: Date.now(),
		currentQuestion: null, // Variable que se usa para obtener datos de una pregunta y editarla en el modal

		// configuracion de la encuestas
		allow_anonymous_answers: false,
		allow_gradable_survey: false,
		hasMinimumScore: false, // Si la encuesta calificable requiere un puntaje minimo de aprobación
		isGlobal: false, // determina si la encuesta esta disponible desde cualquier actividad
		showNoVotos: false,

		// estado de la encuesta
		freezeGame: false,
		openSurvey: false,
		publish: false,

		time_limit: 0,
		show_horizontal_bar: true,
		allow_vote_value_per_user: false,
		ranking: false,
		displayGraphsInSurveys: false,

		// mensajes para encuestas calificables
		initialMessage: null,
		win_Message: null,
		neutral_Message: null,
		lose_Message: null,
		graphyType: 'y',

		// Puntaje mínimo de aprobación
		minimumScore: 0,
	});
	const formEditRef = createRef<HTMLFormElement | null>();

	//Funcion para poder cambiar el value del input o select
	const changeInput = (e: any) => {
		const { name } = e.target;
		const { value } = e.target;
		setState((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = useCallback(async () => {
		if (props.location.state.new) {
			setState((prev) => ({
				...prev,
				isLoading: false,
			}));
		}
		//Se consultan las api para traer en primera los datos de la encuesta para actualizar y en segunda los datos la agenda
		if (props.location.state.edit) {
			const surveyId = props.location.state.edit;

			//Se obtiene el estado y la confiugracion de la encuesta de Firebase
			const firebaseSurvey = await getSurveyConfiguration(surveyId);

			//Consulta  a Mongo del información del evento
			const Update = await SurveysApi.getOne(props.event._id, props.location.state.edit);

			//Se obtiene el listado de actividades del evento para listarlas en la lista desplegable para relacionar la encuesta con una actividad
			const dataAgenda = await AgendaApi.byEvent(props.event._id);

			//Se envian al estado para poderlos utilizar en el markup
			setState((prev) => ({
				...prev,
				isLoading: false,
				idSurvey: Update._id,
				_id: Update._id,

				// Survey Config
				allow_anonymous_answers: firebaseSurvey.allow_anonymous_answers || prev.allow_anonymous_answers,
				allow_gradable_survey:
					parseStringBoolean(firebaseSurvey.allow_gradable_survey) || parseStringBoolean(prev.allow_gradable_survey),
				hasMinimumScore: firebaseSurvey.hasMinimumScore || prev.hasMinimumScore,
				isGlobal: firebaseSurvey.isGlobal || prev.isGlobal,
				showNoVotos: firebaseSurvey.showNoVotos || prev.showNoVotos,

				// Survey State
				freezeGame: firebaseSurvey.freezeGame || prev.freezeGame,
				openSurvey: firebaseSurvey.isOpened || prev.openSurvey,
				publish: firebaseSurvey.isPublished || prev.publish,

				survey: Update.survey,
				show_horizontal_bar: Update.show_horizontal_bar || true,
				graphyType: Update.graphyType ? Update.graphyType : 'y',
				allow_vote_value_per_user: Update.allow_vote_value_per_user || false,
				activity_id: Update.activity_id,
				dataAgenda: dataAgenda.data,
				points: Update.points ? Update.points : 1,
				initialMessage: Update.initialMessage ? Update.initialMessage.replace(/<br \/>/g, '\n') : null,
				time_limit: Update.time_limit ? parseInt(Update.time_limit) : 0,
				win_Message: Update.win_Message ? Update.win_Message : '',
				neutral_Message: Update.neutral_Message ? Update.neutral_Message : '',
				lose_Message: Update.lose_Message ? Update.lose_Message : '',
				ranking: Update.rankingVisible ? Update.rankingVisible : false,
				displayGraphsInSurveys: Update.displayGraphsInSurveys ? Update.displayGraphsInSurveys : false,

				minimumScore: Update.minimumScore ? Update.minimumScore : 0,
			}));

			getQuestions();
		} else {
			const dataAgenda = await AgendaApi.byEvent(props.event._id);
			/* console.log(dataAgenda, 'dataAgenda'); */
			setState((prev) => ({
				...prev,
				dataAgenda: dataAgenda.data as DataAgendum[],
			}));
		}
	}, []);

	const getQuestions = async () => {
		const Update = await SurveysApi.getOne(props.event._id, props.location.state.edit);

		const question: Question[] = [];
		for (const prop in Update.questions) {
			selectOptions.forEach((option) => {
				if (Update.questions[prop].type === option.value) Update.questions[prop].type = option.text;
			});

			question.push(Update.questions[prop]);
		}
		setState((prev) => ({ ...prev, question }));
	};

	useEffect(() => {
		console.log('state', state);
	}, [state]);

	useEffect(() => {
		console.log('state.isGlobal', state.isGlobal);
	}, [state.isGlobal]);

	useEffect(() => {
		console.log('state.activity_id', state.activity_id);
	}, [state.activity_id]);

	//Funcion para guardar los datos a actualizar
	const submit = async () => {
		if (state.survey) {
			DispatchMessageService({
				type: 'loading',
				key: 'loading',
				msj: 'Por favor espere mientras se guarda la información...',
				action: 'show',
			});
			//Se recogen los datos a actualizar
			const data = {
				survey: state.survey,
				show_horizontal_bar: parseStringBoolean(state.show_horizontal_bar),
				graphyType: state.graphyType,
				allow_vote_value_per_user: 'false',
				event_id: props.event._id,
				activity_id: state.activity_id,
				points: state.points ? Number(state.points) : 1,
				initialMessage: state.initialMessage,
				time_limit: Number(state.time_limit),
				win_Message: state.win_Message,
				neutral_Message: state.neutral_Message,
				lose_Message: state.lose_Message,

				// Survey Config
				allow_anonymous_answers: 'false',
				allow_gradable_survey: 'false',
				hasMinimumScore: false,
				isGlobal: true,
				showNoVotos: false,

				//Survey state
				freezeGame: parseStringBoolean(state.freezeGame),
				open: 'false',
				publish: 'false',

				minimumScore: 0,
			};
			try {
				// Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
				const save = await SurveysApi.createOne(props.event._id, data);
				const idSurvey = save._id;

				// Esto permite almacenar los estados en firebase
				await createOrUpdateSurvey(
					idSurvey,
					{
						// Survey Config
						allow_anonymous_answers: data.allow_anonymous_answers,
						allow_gradable_survey: data.allow_gradable_survey,
						hasMinimumScore: data.hasMinimumScore,
						isGlobal: data.isGlobal,
						showNoVotos: data.showNoVotos,
						time_limit: Number(state.time_limit),

						//survey state
						freezeGame: data.freezeGame,
						isOpened: data.open,
						isPublished: data.publish,

						minimumScore: data.minimumScore,
					},
					{ eventId: props.event._id, name: save.survey, category: 'none' }
				);

				setState((prev) => ({ ...prev, idSurvey }));
				DispatchMessageService({
					key: 'loading',
					action: 'destroy',
				});
				DispatchMessageService({
					type: 'success',
					msj: 'La encuesta se guardo correctamente!',
					action: 'show',
				});
			} catch (e) {
				DispatchMessageService({
					key: 'loading',
					action: 'destroy',
				});
				DispatchMessageService({
					type: 'error',
					msj: handleRequestError(e).message,
					action: 'show',
				});
			}
		} else {
			DispatchMessageService({
				type: 'error',
				msj: 'El nombre es requerido',
				action: 'show',
			});
		}
	};

	const submitWithQuestions = async (e: any) => {
		//Se recogen los datos a actualizar

		if (!!parseStringBoolean(state.publish) && state.question.length === 0)
			return DispatchMessageService({
				type: 'error',
				/* key: 'updating', */
				msj: 'Esta encuesta no cuenta con respuestas posibles',
				action: 'show',
			});

		let isValid = true;
		let isValidInitial = true;
		let initialMessage = state.initialMessage;
		if (!!parseStringBoolean(state.allow_gradable_survey)) {
			if (state.question) {
				if (state.question.length > 0) {
					for (let preg of state.question) {
						// @ts-ignore
						if (!preg.correctAnswer) {
							isValid = false;
							break;
						}
					}
				}
			}
		}
		if (
			parseStringBoolean(state.allow_gradable_survey) &&
			(state.initialMessage === '' || state.initialMessage === null)
		) {
			isValidInitial = false;
		}

		if (isValid && isValidInitial) {
			DispatchMessageService({
				type: 'loading',
				key: 'updating',
				msj: 'Actualizando información',
				action: 'show',
			});

			const data = {
				graphyType: state.graphyType,
				survey: state.survey,
				show_horizontal_bar: parseStringBoolean(state.show_horizontal_bar),
				allow_vote_value_per_user: state.allow_vote_value_per_user,
				activity_id: state.activity_id,
				points: state.points ? parseStringNumber(state.points) : 1,
				initialMessage: initialMessage,
				time_limit: parseStringNumber(state.time_limit),
				win_Message: state.win_Message,
				neutral_Message: state.neutral_Message,
				lose_Message: state.lose_Message,

				// Survey Config
				allow_anonymous_answers: state.allow_anonymous_answers,
				allow_gradable_survey: state.allow_gradable_survey,
				hasMinimumScore: state.hasMinimumScore,
				isGlobal: state.isGlobal,
				rankingVisible: state.ranking,
				displayGraphsInSurveys: state.displayGraphsInSurveys,
				showNoVotos: state.showNoVotos,

				//Survey State
				freezeGame: parseStringBoolean(state.freezeGame),
				open: state.openSurvey,
				publish: parseStringBoolean(state.publish),

				minimumScore: parseStringNumber(state.minimumScore),
			};

			// Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
			SurveysApi.editOne(data, state.idSurvey, props.event._id)
				.then(async () => {
					// Esto permite almacenar los estados en firebase
					let setDataInFire = await createOrUpdateSurvey(
						state.idSurvey,
						{
							name: data.survey,
							//Survey config
							allow_anonymous_answers: data.allow_anonymous_answers,
							allow_gradable_survey: data.allow_gradable_survey,
							hasMinimumScore: data.hasMinimumScore,
							isGlobal: data.isGlobal,
							showNoVotos: data.showNoVotos,
							time_limit: parseStringNumber(state.time_limit),

							// Survey State
							freezeGame: data.freezeGame,
							isOpened: data.open,
							isPublished: data.publish,
							rankingVisible: data.rankingVisible,
							displayGraphsInSurveys: data.displayGraphsInSurveys,

							minimumScore: data.minimumScore,
							activity_id: data.activity_id,
						},
						{ eventId: props.event._id, name: data.survey, category: 'none' }
					);
					goBack();
					DispatchMessageService({
						key: 'updating',
						action: 'destroy',
					});
					DispatchMessageService({
						type: 'success',
						key: 'updating',
						msj: setDataInFire.message,
						action: 'show',
					});
				})
				.catch((err) => {
					DispatchMessageService({
						type: 'error',
						msj: 'Ha ocurrido un inconveniente',
						action: 'show',
					});
					/* console.error('Hubo un error', err); */
				});
		} else {
			if (!isValid) {
				DispatchMessageService({
					key: 'updating',
					action: 'destroy',
				});
				DispatchMessageService({
					type: 'error',
					msj: 'Esta encuesta es calificable, hay preguntas sin respuesta correcta asignada',
					action: 'show',
				});
			}
			if (!isValidInitial) {
				DispatchMessageService({
					key: 'updating',
					action: 'destroy',
				});
				DispatchMessageService({
					type: 'error',
					msj: 'Esta encuesta es calificable, debe asignar un mensaje inicial',
					action: 'show',
				});
			}
		}
	};

	// Funcion para generar un id a cada pregunta 'esto es temporal'
	const generateUUID = () => {
		let d = new Date().getTime();
		let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});

		return uuid;
	};

	// Funcion para agregar el formulario de las preguntas
	const addNewQuestion = () => {
		let uid = generateUUID();
		// @ts-ignore
		setState((prev) => ({ ...prev, visibleModal: true, currentQuestion: { id: uid } }));
	};

	// -------------------- Funciones para los servicios -----------------------------------

	// Borrar pregunta
	const deleteOneQuestion = async (questionId: string) => {
		// let self = this;
		DispatchMessageService({
			type: 'loading',
			key: 'loading',
			msj: 'Por favor espere mientras se borra la información...',
			action: 'show',
		});
		let { question, _id } = state;
		const { event } = props;

		let questionIndex = question.findIndex((question: any) => question.id === questionId);
		confirm({
			title: `¿Está seguro de eliminar la pregunta?`,
			icon: <ExclamationCircleOutlined />,
			content: 'Una vez eliminada, no la podrá recuperar',
			okText: 'Borrar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				const onHandlerRemove = async () => {
					try {
						SurveysApi.deleteQuestion(event._id, _id, questionIndex).then((response) => {
							// Se actualiza el estado local, borrando la pregunta de la tabla
							let newListQuestion = question.filter((infoQuestion: any) => infoQuestion.id !== questionId);

							setState((prev) => ({ ...prev, question: newListQuestion }));
							DispatchMessageService({
								key: 'loading',
								action: 'destroy',
							});
							DispatchMessageService({
								type: 'success',
								msj: response,
								action: 'show',
							});
						});
					} catch (e) {
						DispatchMessageService({
							key: 'loading',
							action: 'destroy',
						});
						DispatchMessageService({
							type: 'error',
							msj: handleRequestError(e).message,
							action: 'show',
						});
					}
				};
				onHandlerRemove();
			},
		});
	};

	// Editar pregunta
	const editQuestion = (questionId: string) => {
		const { question } = state;
		const questionIndex = question.findIndex((question) => question.id === questionId);
		const currentQuestion = question.find((infoQuestion) => infoQuestion.id === questionId);
		if (currentQuestion) {
			setState((prev) => ({
				...prev,
				visibleModal: true,
				currentQuestion: {
					...currentQuestion,
					questionIndex,
				},
			}));
		}
		// currentQuestion = questionIndex;
	};

	const sendForm = () => {
		setState((prev) => ({ ...prev, confirmLoading: true }));
		if (formEditRef.current) {
			formEditRef.current.submit();
		}
	};

	interface Info {
		questionIndex: number;
		data: Question;
	}

	const closeModal = (info: Info, modalState: string) => {
		const { question } = state;

		// Condicional que actualiza el estado local
		// Con esto se ve reflejado el cambio en la tabla
		if (Object.entries(info).length === 2) {
			let { questionIndex, data } = info;
			let updateQuestion = question;
			setState((prev) => ({ ...prev, question: [] }));

			// Se iteran las opciones y se asigna el texto para el tipo de pregunta
			selectOptions.forEach((option) => {
				if (data.type === option.value) data.type = option.text;
			});

			switch (modalState) {
				case 'created':
					updateQuestion.push(data);
					setState((prev) => ({ ...prev, question: updateQuestion }));
					break;

				case 'updated':
					updateQuestion.splice(questionIndex, 1, data);
					setState((prev) => ({ ...prev, question: updateQuestion }));
					break;

				default:
					break;
			}
		}
		setState((prev) => ({ ...prev, visibleModal: false, currentQuestion: null, confirmLoading: false }));
	};

	const toggleConfirmLoading = () => {
		setState((prev) => ({ ...prev, confirmLoading: false }));
	};
	// ---------------------------------------------------------------------------------------

	const goBack = () => props.history.goBack();

	const onChange = (e: any) => {
		// Este es para el editor de texto enriquecido. El mensaje para la pagina principal de la encuesta
		if (typeof e === 'string') return setState((prev) => ({ ...prev, initialMessage: e }));

		// Este es para el input de los puntos de la encuesta
		const { value } = e.target;
		const reg = /^-?\d*(\.\d*)?$/;
		if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
			setState((prev) => ({ ...prev, points: value }));
		}
	};

	// Funcion para guardar en el estado el mensaje cuando se gana la encuesta
	const onChangeWin = (content: string) => {
		if (typeof content === 'string') return setState(prev => ({ ...prev, win_Message: content }));
	};

	// Funcion para guardar en el estado el mensaje neutral de la encuesta
	const onChangeNeutral = (content: string) => {
		if (typeof content === 'string') return setState(prev => ({ ...prev, neutral_Message: content }));
	};

	// Funcion para guardar en el estado el mensaje cuando se pierde la encuesta
	const onChangeLose = (content: string) => {
		if (typeof content === 'string') return setState(prev => ({ ...prev, lose_Message: content }));
	};

	// Funcion usada para determinar el tiempo limite en segundos de la emcuesta
	const setTime_limit = (e: any) => {
		var reg = new RegExp('^\\d+$');
		const { value } = e.target;
		if (reg.test(value)) {
			setState((prev) => ({ ...prev, time_limit: value }));
		}
		//
	};

	const toggleSwitch = (variable: string, checked: any) => {
		const { allow_gradable_survey, allow_vote_value_per_user, ranking, displayGraphsInSurveys } = state;
		switch (variable) {
			case 'allow_gradable_survey':
				if (checked && parseStringBoolean(allow_vote_value_per_user))
					return setState((prev) => ({ ...prev, allow_gradable_survey: true, allow_vote_value_per_user: false }));
				setState((prev) => ({ ...prev, allow_gradable_survey: checked ? true : false }));
				break;
			case 'allow_vote_value_per_user':
				if (checked && parseStringBoolean(allow_gradable_survey)) {
					return setState((prev) => ({ ...prev, allow_vote_value_per_user: true, allow_gradable_survey: false }));
				} else {
					return setState((prev) => ({ ...prev, allow_vote_value_per_user: checked }))
				}
				break;
			case 'ranking':
				setState((prev) => ({ ...prev, ranking: checked }));
				break;
			case 'displayGraphsInSurveys':
				setState((prev) => ({ ...prev, displayGraphsInSurveys: checked }));
				break;
			default:
				break;
		}
	};

	const remove = () => {
		// let self = this;
		DispatchMessageService({
			type: 'loading',
			key: 'loading',
			msj: 'Por favor espere mientras se borra la información...',
			action: 'show',
		});
		confirm({
			title: `¿Está seguro de eliminar la información?`,
			icon: <ExclamationCircleOutlined />,
			content: 'Una vez eliminado, no lo podrá recuperar',
			okText: 'Borrar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				const onHandlerRemove = async () => {
					try {
						await SurveysApi.deleteOne(state.idSurvey, props.event._id);
						await deleteSurvey(state.idSurvey);
						DispatchMessageService({
							key: 'loading',
							action: 'destroy',
						});
						DispatchMessageService({
							type: 'success',
							msj: 'Se eliminó la información correctamente!',
							action: 'show',
						});
						goBack();
					} catch (e) {
						DispatchMessageService({
							key: 'loading',
							action: 'destroy',
						});
						DispatchMessageService({
							type: 'error',
							msj: handleRequestError(e).message,
							action: 'show',
						});
					}
				};
				onHandlerRemove();
			},
		});
	};

	const {
		survey,
		publish,
		openSurvey,
		activity_id,
		dataAgenda,
		question,
		visibleModal,
		confirmLoading,
		currentQuestion,
		allow_anonymous_answers,
		allow_gradable_survey,
		show_horizontal_bar,
		allow_vote_value_per_user,
		freezeGame,
		time_limit,
		hasMinimumScore,
		minimumScore,
		isGlobal,
		ranking,
		showNoVotos,
		displayGraphsInSurveys,
		isLoading,
	} = state;

	const columns = [
		{
			title: 'Pregunta',
			key: 'title',
			render: (e: any) => {
				return (
					<>
						<div style={{ marginBottom: '10px' }}>
							{e.correctAnswer ? (
								<Tag icon={<CheckCircleOutlined />} color='success'>
									Respuesta asignada
								</Tag>
							) : (
								<Tag icon={<CloseCircleOutlined />} color='error'>
									Sin respuesta asignada
								</Tag>
							)}
						</div>
						<div>{e.title}</div>
					</>
				);
			},
		},
		{
			title: 'Tipo de Pregunta',
			dataIndex: 'type',
			key: 'type',
		},
		{
			title: '# de posibles respuestas',
			key: 'choices',
			align: 'center',
			render: (e: any) => {
				return <div>{e.choices?.length}</div>;
			},
		},
		{
			title: 'Opciones',
			key: 'action',
			render: (text: any, record: any) => {
				const { eventIsActive } = useHelper();
				const cEventIsActive = eventIsActive;
				return (
					<Row gutter={[8, 8]}>
						<Col>
							<Tooltip placement='topLeft' title='Editar'>
								<Button
									icon={<EditOutlined />}
									type='primary'
									size='small'
									onClick={() => editQuestion(record.id)}
									disabled={cEventIsActive === false && window.location.toString().includes('eventadmin')}
								/>
							</Tooltip>
						</Col>
						<Col>
							<Tooltip placement='topLeft' title='Eliminar'>
								<Button
									key={`removeAction${record.index}`}
									id={`removeAction${record.index}`}
									onClick={() => deleteOneQuestion(record.id)}
									icon={<DeleteOutlined />}
									danger
									size='small'
									disabled={cEventIsActive === false && window.location.toString().includes('eventadmin')}
								/>
							</Tooltip>
						</Col>
					</Row>
				);
			},
		},
	];

	return (
		<Form onFinish={state.idSurvey ? submitWithQuestions : submit} {...formLayout}>
			<Header
				title={'Encuesta'}
				back
				save
				form
				remove={remove}
				edit={state.idSurvey}
				extra={
					<Space direction='horizontal' style={{ marginRight: '50px' }}>
						{state.idSurvey && (
							<>
								<Col>
									<Form.Item label={'Publicar'} labelCol={{ span: 14 }} name={'publish'}>
										<Switch
											checked={parseStringBoolean(publish)}
											checkedChildren='Sí'
											unCheckedChildren='No'
											onChange={(checked) => setState((prev) => ({ ...prev, publish: checked }))}
										/>
									</Form.Item>
								</Col>
								<Col>
									<Form.Item label={'Abrir'} labelCol={{ span: 14 }} name={'openSurvey'}>
										<Switch
											checked={parseStringBoolean(openSurvey)}
											checkedChildren='Sí'
											unCheckedChildren='No'
											onChange={(checked) => setState((prev) => ({ ...prev, openSurvey: checked }))}
										/>
									</Form.Item>
								</Col>
							</>
						)}
					</Space>
				}
			/>
			<Row justify='center' wrap gutter={8}>
				<Col span={16}>
					{isLoading ? (
						<Loading />
					) : (
						<>
							<Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
								<Form.Item
									label={
										<label style={{ marginTop: '2%' }}>
											Nombre <label style={{ color: 'red' }}>*</label>
										</label>
									}
									rules={[{ required: true, message: 'El nombre es requerido' }]}>
									<Input value={survey} placeholder={'Nombre de la encuesta'} name={'survey'} onChange={changeInput} />
								</Form.Item>
								{state.idSurvey && (
									<>
										<Form.Item label={'Tiempo límite en segundos por pregunta'} name={'time_limit'}>
											<Select
												defaultValue={time_limit}
												value={time_limit}
												onChange={(time) => {
													setState((prev) => ({ ...prev, time_limit: time }));
												}}>
												{surveyTimeOptions.map((values, key) => (
													<Option key={key} value={values.value}>
														{values.text}
													</Option>
												))}
											</Select>
										</Form.Item>
										<Row justify='space-between' wrap gutter={[8, 8]}>
											<Col>
												<Form.Item label={'Mostrar gráficas en las encuestas'} name={'displayGraphsInSurveys'}>
													<Switch
														checked={parseStringBoolean(displayGraphsInSurveys)}
														onChange={(checked) => toggleSwitch('displayGraphsInSurveys', checked)}
													/>
												</Form.Item>
											</Col>
										</Row>
										{parseStringBoolean(displayGraphsInSurveys) && (
											<>
												<Form.Item label={'Elegir tipo de gráfica'} name={'graphyType'}>
													<Select
														defaultValue={state.graphyType}
														onChange={(graphy) => setState((prev) => ({ ...prev, graphyType: graphy }))}>
														<OptGroup label={'Barras'}>
															<Option value='y'>
																<Space>
																	<BarChartOutlined rotate={90} /> Horizontal
																</Space>
															</Option>
															<Option value='x'>
																<Space>
																	<BarChartOutlined /> Vertical
																</Space>
															</Option>
														</OptGroup>
														<OptGroup label={'Circular'}>
															<Option value='pie'>
																<Space>
																<PieChartOutlined /> Torta
																</Space>
															</Option>
														</OptGroup>
													</Select>
												</Form.Item>
												<Form.Item
													label={'Mostrar porcentaje de participantes sin votar en las gráficas'}
													name={'showNoVotos'}>
													<Switch
														checked={parseStringBoolean(showNoVotos)}
														onChange={(checked) => setState((prev) => ({ ...prev, showNoVotos: checked }))}
													/>
												</Form.Item>
											</>
										)}
										<Form.Item label={'Relacionar esta encuesta a una actividad'} name={'activity_id'}>
											<Select
												defaultValue={(activity_id === '' || activity_id === null) ? 'globalMode' : activity_id }
												value={activity_id}
												onChange={(relation) => {
													if (relation === 'globalMode') {
														setState((prev) => ({ ...prev, activity_id: relation, isGlobal: true }));
													} else {
														setState((prev) => ({ ...prev, activity_id: relation, isGlobal: false }));
													}
												}}>
												<Option value='globalMode'>{'Global'}</Option>
												<OptGroup label='Actividades'>
													{dataAgenda.map((activity, key) => (
														<Option key={key} value={activity._id}>
															{activity.name}
														</Option>
													))}
												</OptGroup>
											</Select>
										</Form.Item>
										<Form.Item label={'Permitir valor del voto por usuario'} name={'allow_vote_value_per_user'}>
											<Switch
												checked={parseStringBoolean(allow_vote_value_per_user)}
												onChange={(checked) => toggleSwitch('allow_vote_value_per_user', checked)}
											/>
										</Form.Item>
										<Form.Item label={'Encuesta calificable'} name={'allow_gradable_survey'}>
											<Switch
												checked={parseStringBoolean(allow_gradable_survey)}
												onChange={(checked) => {
													toggleSwitch('allow_gradable_survey', checked);
													if (parseStringBoolean(ranking)) {
														toggleSwitch('ranking', checked);
													}
												}}
											/>
										</Form.Item>
										{parseStringBoolean(allow_gradable_survey) && (
											<>
												<Form.Item label={'Habilitar ranking'} name={'ranking'}>
													<Switch
														checked={parseStringBoolean(ranking)}
														onChange={(checked) => toggleSwitch('ranking', checked)}
													/>
												</Form.Item>
												<Form.Item label={'Requiere puntaje mínimo para aprobar'} name={'hasMinimumScore'}>
													<Switch
														checked={parseStringBoolean(hasMinimumScore)}
														onChange={(checked) => setState((prev) => ({ ...prev, hasMinimumScore: checked }))}
													/>
												</Form.Item>
												{parseStringBoolean(hasMinimumScore) && (
													<Form.Item label={'Puntaje mínimo para aprobar'}>
														<Input name={'minimumScore'} value={minimumScore} onChange={changeInput} />
													</Form.Item>
												)}
												<>
													<Form.Item
														label={
															<label style={{ marginTop: '2%' }}>
																{'Mensaje pantalla inicial de la encuesta'} <label style={{ color: 'red' }}>*</label>
															</label>
														}>
														{/* @ts-ignore */}
														<ReactQuill
															id={'initialMessage'}
															value={state.initialMessage || ''}
															modules={toolbarEditor}
															onChange={onChange}
														/>
													</Form.Item>
													<Form.Item label={'Mensaje pantalla final de la encuesta'}>
														{/* @ts-ignore */}
														<ReactQuill
															id={'neutral_Message'}
															value={state.neutral_Message || ''}
															modules={toolbarEditor}
															onChange={onChangeNeutral}
														/>
													</Form.Item>
													<Form.Item label={'Mensaje al ganar'}>
														{/* @ts-ignore */}
														<ReactQuill
															id={'win_Message'}
															value={state.win_Message || ''}
															modules={toolbarEditor}
															onChange={onChangeWin}
														/>
													</Form.Item>
													<Form.Item label={'Mensaje al perder'}>
														{/* @ts-ignore */}
														<ReactQuill
															id={'lose_Message'}
															value={state.lose_Message || ''}
															modules={toolbarEditor}
															onChange={onChangeLose}
														/>
													</Form.Item>
												</>
											</>
										)}
									</>
								)}
							</Card>
							{state.idSurvey && (
								<>
									<Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
										<Header title={'Preguntas'} addFn={addNewQuestion} />
										{/* @ts-ignore */}
										<Table dataSource={question} columns={columns} />
									</Card>
									{state.idSurvey && !!currentQuestion && Object.entries(currentQuestion).length !== 0 && (
										<Modal
											width={700}
											bodyStyle={{
												textAlign: 'center',
											}}
											visible={visibleModal}
											maskClosable={false}
											onOk={sendForm}
											destroyOnClose={true}
											// onCancel={closeModal}
											onCancel={() => setState((prev) => ({ ...prev, visibleModal: false }))}
											footer={[
												<Button key='back' onClick={() => setState((prev) => ({ ...prev, visibleModal: false }))}>
													Cancelar
												</Button>,
												<Button
													key='submit'
													type='primary'
													disabled={confirmLoading}
													loading={confirmLoading}
													onClick={sendForm}>
													Guardar
												</Button>,
											]}>
											<>
												<Title
													style={{
														marginTop: '20px',
														marginBottom: '20px',
													}}
													level={4}
													type='secondary'>
													Gestionar Pregunta
												</Title>
												<FormQuestionEdit
													ref={formEditRef}
													valuesQuestion={currentQuestion}
													eventId={props.event._id}
													surveyId={state.idSurvey}
													closeModal={closeModal}
													toggleConfirmLoading={toggleConfirmLoading}
													gradableSurvey={allow_gradable_survey}
													unmountForm={() => setState((prev) => ({ ...prev, currentQuestion: null }))}
												/>
											</>
										</Modal>
									)}
								</>
							)}
						</>
					)}
				</Col>
			</Row>
			<BackTop />
		</Form>
	);
}

export default withRouter(TriviaEdit);
