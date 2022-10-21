import { Component, Fragment, createRef } from 'react';
import { selectOptions, surveyTimeOptions } from './constants';
import { SurveysApi, AgendaApi } from '@helpers/request';
import { handleRequestError } from '@helpers/utils';
import { createOrUpdateSurvey, getSurveyConfiguration, deleteSurvey } from './services';
import { withRouter } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { toolbarEditor } from '@helpers/constants';
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
  Spin,
  InputNumber,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import FormQuestionEdit from './formEdit';
import Header from '@antdComponents/Header';
import BackTop from '@antdComponents/BackTop';
import Loading from '../profile/loading';
import { DispatchMessageService } from '@context/MessageService';
import { useHelper } from '@context/helperContext/hooks/useHelper';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option } = Select;
const { confirm } = Modal;
const { Title } = Typography;

class TriviaEdit extends Component {
  constructor(props) {
    super(props);
    this.formEditRef = createRef();
    this.state = {
      isUserUnconsciousReloading: false,
      title: props.title || 'Evaluación',
      idSurvey: this.props.savedSurveyId,
      isLoading: true,
      loading: false,
      redirect: false,
      survey: '',
      activity_id: props.activityId || '',
      dataAgenda: [],
      quantityQuestions: 0,
      listQuestions: [],
      points: 1,
      question: [],
      visibleModal: false,
      confirmLoading: false,
      key: Date.now(),
      currentQuestion: {}, // Variable que se usa para obtener datos de una pregunta y editarla en el modal

      // configuracion de la encuestas
      allow_anonymous_answers: false,
      allow_gradable_survey: false,
      random_survey: false,
      random_survey_count: 0,
      hasMinimumScore: 'false', // Si la encuesta calificable requiere un puntaje minimo de aprobación
      isGlobal: 'false', // determina si la encuesta esta disponible desde cualquier lección
      showNoVotos: 'false',

      // estado de la encuesta
      freezeGame: false,
      openSurvey: 'false',
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
    };
    this.submit = this.submit.bind(this);
    this.submitWithQuestions = this.submitWithQuestions.bind(this);
    this.remove = this.remove.bind(this);
  }

  //Funcion para poder cambiar el value del input o select
  changeInput = (e) => {
    console.debug('changeInput', e.target);
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  async getSurveyFromEditing(surveyId, isCreated) {
    console.debug('getSurveyFromEditing is called', surveyId, isCreated);
    //Se obtiene el estado y la confiugracion de la encuesta de Firebase
    const firebaseSurvey = await getSurveyConfiguration(surveyId);

    //Consulta  a Mongo del información del curso
    const Update = await SurveysApi.getOne(this.props.event._id, surveyId);

    //Se obtiene el listado de lecciones del curso para listarlas en la lista desplegable para relacionar la encuesta con una lección
    const dataAgenda = await AgendaApi.byEvent(this.props.event._id);

    //Se envian al estado para poderlos utilizar en el markup
    this.setState({
      isLoading: false,
      idSurvey: Update._id,
      _id: Update._id,

      // Survey Config
      allow_anonymous_answers: firebaseSurvey.allow_anonymous_answers || this.state.allow_anonymous_answers,
      allow_gradable_survey: firebaseSurvey.allow_gradable_survey
        ? firebaseSurvey.allow_gradable_survey
        : 'false' || this.state.allow_gradable_survey,
      hasMinimumScore: firebaseSurvey.hasMinimumScore || this.state.hasMinimumScore,
      isGlobal: firebaseSurvey.isGlobal || this.state.isGlobal,
      showNoVotos: firebaseSurvey.showNoVotos || this.state.showNoVotos,

      // Survey State
      freezeGame: firebaseSurvey.freezeGame || this.state.freezeGame,
      openSurvey: firebaseSurvey.isOpened || this.state.openSurvey,
      publish: firebaseSurvey.isPublished || this.state.publish,

      tries: firebaseSurvey.tries || 1,
      random_survey: firebaseSurvey.random_survey || false,
      random_survey_count: firebaseSurvey.random_survey_count || 0,

      survey: Update.survey,
      show_horizontal_bar: Update.show_horizontal_bar || true,
      graphyType: Update.graphyType ? Update.graphyType : 'y',
      allow_vote_value_per_user: Update.allow_vote_value_per_user || 'false',
      activity_id: Update.activity_id,
      dataAgenda: dataAgenda.data,
      points: Update.points ? Update.points : 1,
      initialMessage: Update.initialMessage ? Update.initialMessage.replace(/<br \/>/g, '\n') : null,
      time_limit: Update.time_limit ? parseInt(Update.time_limit) : 0,
      win_Message: Update.win_Message ? Update.win_Message : '',
      neutral_Message: Update.neutral_Message ? Update.neutral_Message : '',
      lose_Message: Update.lose_Message ? Update.lose_Message : '',
      ranking: Update.rankingVisible ? Update.rankingVisible : 'false',
      displayGraphsInSurveys: Update.displayGraphsInSurveys ? Update.displayGraphsInSurveys : 'false',

      minimumScore: Update.minimumScore ? Update.minimumScore : 0,
    });

    if (!isCreated) await this.getQuestions();
  }

  async UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextProps.savedSurveyId !== this.props.savedSurveyId) {
      if (nextProps.savedSurveyId) {
        this.setState({ isUserUnconsciousReloading: true });
        await this.getSurveyFromEditing(nextProps.savedSurveyId);
        this.setState({ isUserUnconsciousReloading: false });
      }
    }
  }

  async componentDidMount() {
    if (this.props.location.state.new || this.props.inserted) {
      this.setState({
        isLoading: false,
      });
    }
    //Se consultan las api para traer en primera los datos de la encuesta para actualizar y en segunda los datos la agenda
    if (this.props.location.state.edit || (this.props.inserted && this.props.savedSurveyId)) {
      if (this.props.inserted && this.props.savedSurveyId) {
        console.debug('will get survey from props (inserted mode), survey ID:', this.props.savedSurveyId);
      }
      console.debug('this.props.savedSurveyId:', this.props.savedSurveyId);
      console.debug('this.props.location.state.edit:', this.props.location.state.edit);
      const surveyId = this.props.inserted ? this.props.savedSurveyId : this.props.location.state.edit;
      surveyId && await this.getSurveyFromEditing(surveyId);
    } else {
      const dataAgenda = await AgendaApi.byEvent(this.props.event._id);
      /* console.log(dataAgenda, 'dataAgenda'); */
      this.setState({
        dataAgenda: dataAgenda.data,
      });
    }
  }

  async getQuestions() {
    console.debug('this.props.savedSurveyId:', this.props.savedSurveyId);
    console.debug('this.props.location.state.edit:', this.props.location.state.edit);
    const surveyId = this.props.inserted ? this.props.savedSurveyId : this.props.location.state.edit;

    console.debug('call getQuestions surveyId:', surveyId);
    const Update = await SurveysApi.getOne(this.props.event._id, surveyId);

    const question = [];
    for (const prop in Update.questions) {
      selectOptions.forEach((option) => {
        if (Update.questions[prop].type === option.value) Update.questions[prop].type = option.text;
      });

      question.push(Update.questions[prop]);
    }
    this.setState({ question });
  }

  //Funcion para guardar los datos a actualizar
  async submit() {
    console.debug('call submit this.state.survey =', this.state.survey);
    if (this.state.survey) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });
      //Se recogen los datos a actualizar
      const data = {
        survey: this.state.survey,
        show_horizontal_bar: this.state.show_horizontal_bar === 'true' ? true : false,
        graphyType: this.state.graphyType,
        allow_vote_value_per_user: 'false',
        event_id: this.props.event._id,
        activity_id: this.state.activity_id,
        points: this.state.points ? parseInt(this.state.points) : 1,
        initialMessage: this.state.initialMessage,
        time_limit: parseInt(this.state.time_limit),
        win_Message: this.state.win_Message,
        neutral_Message: this.state.neutral_Message,
        lose_Message: this.state.lose_Message,

        // Survey Config
        allow_anonymous_answers: 'false',
        allow_gradable_survey: !!this.props.quizable ? 'true' : 'false',
        hasMinimumScore: false,
        isGlobal: false,
        showNoVotos: false,

        //Survey state
        freezeGame: this.state.freezeGame === 'true' ? true : false,
        open: 'false',
        publish: 'false',

        minimumScore: 0,

        // Rossie history inspired this feature
        tries: Math.max(this.state.tries, 1),
        random_survey: this.state.random_survey,
        random_survey_count: this.state.random_survey_count,
      };
      try {
        // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del curso que viene desde props
        const save = await SurveysApi.createOne(this.props.event._id, data);
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
            time_limit: parseInt(this.state.time_limit),

            //survey state
            freezeGame: data.freezeGame,
            isOpened: data.open,
            isPublished: data.publish,

            minimumScore: data.minimumScore,

            // Rossie history inspired this feature
            tries: Math.max(data.tries, 1),
            random_survey: data.random_survey,
            random_survey_count: data.random_survey_count,
          },
          { eventId: this.props.event._id, name: save.survey, category: 'none' }
        );

        await this.setState({ idSurvey });

        if (this.props.inserted && this.props.onSave) {
          await this.getSurveyFromEditing(idSurvey, true);
          this.props.onSave(idSurvey);
        }

        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: `La ${this.state.title.toLowerCase()} se guardó correctamente!`,
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
  }

  async submitWithQuestions(e) {
    //Se recogen los datos a actualizar
    console.debug('call submitWithQuestions');

    if (this.state.publish === 'true' && this.state.question.length === 0)
      return DispatchMessageService({
        type: 'error',
        /* key: 'updating', */
        msj: `Esta ${this.state.title.toLowerCase()} no cuenta con respuestas posibles`,
        action: 'show',
      });

    let isValid = true;
    let isValidInitial = true;
    const initialMessage = this.state.initialMessage;
    if (this.state.allow_gradable_survey === 'true') {
      if (this.state.question) {
        if (this.state.question.length > 0) {
          for (const preg of this.state.question) {
            if (!preg.correctAnswer) {
              isValid = false;
              break;
            }
          }
        }
      }
    }
    if (
      this.state.allow_gradable_survey == 'true' &&
      (this.state.initialMessage === '' || this.state.initialMessage === null)
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
        graphyType: this.state.graphyType,
        survey: this.state.survey,
        show_horizontal_bar: this.state.show_horizontal_bar === 'true' ? true : false,
        allow_vote_value_per_user: this.state.allow_vote_value_per_user,
        activity_id: this.state.activity_id,
        points: this.state.points ? parseInt(this.state.points) : 1,
        initialMessage: initialMessage,
        time_limit: parseInt(this.state.time_limit),
        win_Message: this.state.win_Message,
        neutral_Message: this.state.neutral_Message,
        lose_Message: this.state.lose_Message,

        // Survey Config
        allow_anonymous_answers: this.state.allow_anonymous_answers,
        allow_gradable_survey: this.state.allow_gradable_survey,
        hasMinimumScore: this.state.hasMinimumScore,
        isGlobal: this.state.isGlobal,
        rankingVisible: this.state.ranking,
        displayGraphsInSurveys: this.state.displayGraphsInSurveys,
        showNoVotos: this.state.showNoVotos,

        //Survey State
        freezeGame: this.state.freezeGame === 'true' ? true : false,
        open: this.state.openSurvey,
        publish: this.state.publish === 'true' || this.state.publish === true ? 'true' : 'false',

        minimumScore: parseInt(this.state.minimumScore),

        // Rossie history inspired this feature
        tries: Math.max(this.state.tries, 1),
        random_survey: this.state.random_survey,
        random_survey_count: this.state.random_survey_count,
      };

      // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del curso que viene desde props
      SurveysApi.editOne(data, this.state.idSurvey, this.props.event._id)
        .then(async () => {
          // Esto permite almacenar los estados en firebase
          const setDataInFire = await createOrUpdateSurvey(
            this.state.idSurvey,
            {
              name: data.survey,
              //Survey config
              allow_anonymous_answers: data.allow_anonymous_answers,
              allow_gradable_survey: data.allow_gradable_survey,
              hasMinimumScore: data.hasMinimumScore,
              isGlobal: data.isGlobal,
              showNoVotos: data.showNoVotos,
              time_limit: parseInt(this.state.time_limit),

              // Survey State
              freezeGame: data.freezeGame,
              isOpened: data.open,
              isPublished: data.publish,
              rankingVisible: data.rankingVisible,
              displayGraphsInSurveys: data.displayGraphsInSurveys,

              minimumScore: data.minimumScore,
              activity_id: data.activity_id,

              // Rossie history inspired this feature
              tries: Math.max(this.state.tries, 1),
              random_survey: data.random_survey,
              random_survey_count: data.random_survey_count,
            },
            { eventId: this.props.event._id, name: data.survey, category: 'none' }
          );
          if (!this.props.inserted) this.goBack();
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
          msj: `Esta ${this.state.title.toLowerCase()} es calificable, hay preguntas sin respuesta correcta asignada`,
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
          msj: `Esta ${this.state.title.toLowerCase()} es calificable, debe asignar un mensaje inicial`,
          action: 'show',
        });
      }
    }
  }

  // Funcion para generar un id a cada pregunta 'esto es temporal'
  generateUUID = () => {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    return uuid;
  };

  // Funcion para agregar el formulario de las preguntas
  addNewQuestion = () => {
    const uid = this.generateUUID();
    this.setState({ visibleModal: true, currentQuestion: { id: uid } });
  };

  // -------------------- Funciones para los servicios -----------------------------------

  // Borrar pregunta
  deleteOneQuestion = async (questionId) => {
    const self = this;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    const { question, _id } = self.state;
    const { event } = self.props;

    const questionIndex = question.findIndex((question) => question.id === questionId);
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
              const newListQuestion = question.filter((infoQuestion) => infoQuestion.id !== questionId);

              self.setState({ question: newListQuestion });
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
  editQuestion = (questionId) => {
    let { currentQuestion } = this.state;
    const { question } = this.state;
    const questionIndex = question.findIndex((question) => question.id === questionId);

    currentQuestion = question.find((infoQuestion) => infoQuestion.id === questionId);
    currentQuestion['questionIndex'] = questionIndex;

    this.setState({ visibleModal: true, currentQuestion });
  };

  sendForm = () => {
    console.debug('call sendForm, this.formEditRef.current =', this.formEditRef.current);
    this.setState({ confirmLoading: true });
    if (this.formEditRef.current) {
      this.formEditRef.current.submit();
    }
  };

  closeModal = (info, state) => {
    const { question } = this.state;

    // Condicional que actualiza el estado local
    // Con esto se ve reflejado el cambio en la tabla
    if (Object.entries(info).length === 2) {
      const { questionIndex, data } = info;
      const updateQuestion = question;
      this.setState({ question: [] });

      // Se iteran las opciones y se asigna el texto para el tipo de pregunta
      selectOptions.forEach((option) => {
        if (data.type === option.value) data.type = option.text;
      });

      switch (state) {
        case 'created':
          updateQuestion.push(data);
          this.setState({ question: updateQuestion });
          break;

        case 'updated':
          updateQuestion.splice(questionIndex, 1, data);
          this.setState({ question: updateQuestion });
          break;

        default:
          break;
      }
    }
    this.setState({ visibleModal: false, currentQuestion: {}, confirmLoading: false });
  };

  toggleConfirmLoading = () => {
    this.setState({ confirmLoading: false });
  };
  // ---------------------------------------------------------------------------------------

  goBack = () => this.props.history.goBack();

  onChange = (e) => {
    // Este es para el editor de texto enriquecido. El mensaje para la pagina principal de la encuesta
    if (typeof e === 'string') return this.setState({ initialMessage: e });

    // Este es para el input de los puntos de la encuesta
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ points: value });
    }
  };

  // Funcion para guardar en el estado el mensaje cuando se gana la encuesta
  onChangeWin = (e) => {
    if (typeof e === 'string') return this.setState({ win_Message: e });
  };

  // Funcion para guardar en el estado el mensaje neutral de la encuesta
  onChangeNeutral = (e) => {
    if (typeof e === 'string') return this.setState({ neutral_Message: e });
  };

  // Funcion para guardar en el estado el mensaje cuando se pierde la encuesta
  onChangeLose = (e) => {
    if (typeof e === 'string') return this.setState({ lose_Message: e });
  };

  // Funcion usada para determinar el tiempo limite en segundos de la emcuesta
  setTime_limit = (e) => {
    const reg = new RegExp('^\\d+$');
    const { value } = e.target;
    if (reg.test(value)) {
      this.setState({ time_limit: value });
    }
    //
  };

  toggleSwitch = (variable, state) => {
    const { allow_gradable_survey, allow_vote_value_per_user, ranking, displayGraphsInSurveys } = this.state;
    console.debug('variable:', variable, state);
    switch (variable) {
      case 'allow_gradable_survey':
        if (state && allow_vote_value_per_user === 'true')
          return this.setState({ allow_gradable_survey: 'true', allow_vote_value_per_user: 'false' });
        this.setState({ allow_gradable_survey: state ? 'true' : 'false' });
        break;

      case 'allow_vote_value_per_user':
        if (state && allow_gradable_survey === 'true')
          return this.setState({ allow_vote_value_per_user: 'true', allow_gradable_survey: 'false' });

        break;

      case 'ranking':
        this.setState({ ranking: ranking === 'true' ? 'false' : 'true' });
        // this.setState({ allow_vote_value_per_user: state ? 'true' : 'false' });
        break;
      case 'displayGraphsInSurveys':
        this.setState({ displayGraphsInSurveys: displayGraphsInSurveys === 'true' ? 'false' : 'true' });
        break;
      
      case 'random_survey':
        this.setState({ random_survey: state });
        break;
      
      case 'tries':
        this.setState({ tries: Math.max(state, 1) });
        break

      default:
        break;
    }
  };

  remove = () => {
    const self = this;
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
      onOk: () => {
        const onHandlerRemove = async () => {
          try {
            await SurveysApi.deleteOne(self.state.idSurvey, self.props.event._id);
            await deleteSurvey(self.state.idSurvey);
            DispatchMessageService({ key: 'loading', action: 'destroy' });
            DispatchMessageService({ type: 'success', msj: 'Se eliminó la información correctamente!', action: 'show' });
            if (!this.props.inserted) self.goBack();
            if (this.props.inserted && this.props.onDelete) {
              this.props.onDelete();
            }
          } catch (e) {
            DispatchMessageService({ key: 'loading', action: 'destroy' });
            DispatchMessageService({ type: 'error', msj: handleRequestError(e).message, action: 'show' });
          }
        };
        onHandlerRemove();
      },
    });
  };

  render() {
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
      tries,
      random_survey,
      random_survey_count,
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
    } = this.state;

    const columns = [
      {
        title: 'Pregunta',
        key: 'title',
        render: (e) => {
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
        render: (e) => <div>{e.choices?.length}</div>,
      },
      {
        title: 'Opciones',
        key: 'action',
        render: (text, record) => {
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
                    onClick={() => this.editQuestion(record.id)}
                    disabled={cEventIsActive === false && window.location.toString().includes('eventadmin')}
                  />
                </Tooltip>
              </Col>
              <Col>
                <Tooltip placement='topLeft' title='Eliminar'>
                  <Button
                    key={`removeAction${record.index}`}
                    id={`removeAction${record.index}`}
                    onClick={() => this.deleteOneQuestion(record.id)}
                    icon={<DeleteOutlined />}
                    type='danger'
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
      <Form onFinish={this.state.idSurvey ? this.submitWithQuestions : this.submit} {...formLayout}>
        <Header
          title={this.state.title}
          back={!this.props.inserted}
          save={!this.props.inserted || this.state.idSurvey}
          form={!this.props.inserted}
          saveMethod={this.props.inserted && this.state.idSurvey ? this.submitWithQuestions : undefined}
          addFn={this.props.inserted && !this.state.idSurvey ? this.submit : undefined}
          remove={this.remove}
          edit={this.state.idSurvey}
          extra={
            <Space direction='horizontal' style={{ maginRigth: '50px' }}>
              {this.state.idSurvey && (
                <>
                  <Col>
                    <Form.Item label={'Publicar'} labelCol={{ span: 14 }}>
                      <Switch
                        name={'publish'}
                        checked={publish === 'true' || publish === true}
                        checkedChildren='Sí'
                        unCheckedChildren='No'
                        onChange={(checked) => this.setState({ publish: checked ? 'true' : 'false' })}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item label={'Abrir'} labelCol={{ span: 14 }}>
                      <Switch
                        name={'openSurvey'}
                        checked={openSurvey === 'true'}
                        checkedChildren='Sí'
                        unCheckedChildren='No'
                        onChange={(checked) => this.setState({ openSurvey: checked ? 'true' : 'false' })}
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
                  {this.state.isUserUnconsciousReloading && <Spin/> }
                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Nombre <label style={{ color: 'red' }}>*</label>
                      </label>
                    }
                    rules={[{ required: true, message: 'El nombre es requerido' }]}>
                    <Input
                      value={survey}
                      placeholder={`Nombre de la ${this.state.title.toLowerCase()}`}
                      name={'survey'}
                      onChange={this.changeInput}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Intentos permitidos <label style={{ color: 'red' }}>*</label>
                      </label>
                    }
                    rules={[{ required: true, message: 'Intentos permitidos es requerido' }]}>
                    <InputNumber
                      style={{ width: '100%' }}
                      value={tries}
                      placeholder={`Cantidad de intentos permitidos en: ${this.state.title.toLowerCase()}`}
                      name={'tries'}
                      onChange={(value) => this.changeInput({ target: { name: 'tries', value: Math.max(value, 1) } })}
                    />
                  </Form.Item>
                  {this.state.idSurvey && (
                    <>
                      <Form.Item label={'Tiempo límite en segundos por pregunta'}>
                        <Select
                          name={'time_limit'}
                          value={time_limit}
                          onChange={(time) => {
                            this.setState({ time_limit: time });
                          }}>
                          {surveyTimeOptions.map((values, key) => (
                            <Option key={key} value={values.value}>
                              {values.text}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Row justify='space-between' wrap gutter={[8, 8]}>
                        {/* <Col>
                    <Form.Item label={'Permitir usuarios anónimos'}>
                      <Switch
                        name={'allow_anonymous_answers'}
                        checked={allow_anonymous_answers === 'true' || allow_anonymous_answers === true}
                        onChange={(checked) => this.setState({ allow_anonymous_answers: checked ? 'true' : 'false' })}
                      />
                    </Form.Item>
                  </Col> */}
                        {/* <Col>
                    <Form.Item label={`Publicar ${this.state.title.toLowerCase()}`}>
                      <Switch
                        name={'publish'}
                        checked={publish === 'true' || publish === true}
                        onChange={(checked) => this.setState({ publish: checked ? 'true' : 'false' })}
                      />
                    </Form.Item>
                  </Col> */}
                        <Col>
                          <Form.Item label={`Mostar gráficas en cada ${this.state.title.toLowerCase()}`}>
                            <Switch
                              name={'displayGraphsInSurveys'}
                              checked={displayGraphsInSurveys === 'true' || displayGraphsInSurveys === true}
                              onChange={(checked) => this.toggleSwitch('displayGraphsInSurveys', checked)}
                            />
                          </Form.Item>
                        </Col>
                        {/* <Col>
                          <Form.Item label={`${this.state.title} abierta`}>
                            <Switch
                              name={'openSurvey'}
                              checked={openSurvey === 'true'}
                              onChange={(checked) => this.setState({ openSurvey: checked ? 'true' : 'false' })}
                            />
                          </Form.Item>
                        </Col> */}
                      </Row>
                      {displayGraphsInSurveys === true ||
                        (displayGraphsInSurveys === 'true' && (
                          <>
                            <Form.Item label={'Elegir tipo de gráfica'}>
                              <Select
                                name={'graphyType'}
                                defaultValue={this.state.graphyType}
                                style={{ width: 120 }}
                                onChange={(graphy) => this.setState({ graphyType: graphy })}>
                                <Option value='y'>Horizontal</Option>
                                <Option value='x'>vertical</Option>
                                <Option value='pie'>Torta</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item label={'Mostrar porcentaje de participantes sin votar en las gráficas'}>
                              <Switch
                                name={'showNoVotos'}
                                checked={showNoVotos === 'true' || showNoVotos === true}
                                onChange={(checked) => this.setState({ showNoVotos: checked ? 'true' : 'false' })}
                              />
                            </Form.Item>
                          </>
                        ))}

                      <Form.Item label={`${this.state.title} global (visible en todas las lecciones)`}>
                        <Switch
                          name={'isGlobal'}
                          checked={isGlobal === 'true' || isGlobal === true}
                          onChange={(checked) => this.setState({ isGlobal: checked ? 'true' : 'false' })}
                        />
                      </Form.Item>

                      {(isGlobal === 'false' || isGlobal === false) && (
                        <>
                          <Form.Item label={`Relacionar esta ${this.state.title.toLowerCase()} a una lección`}>
                            <Select
                              disabled={this.props.inserted}
                              name={'activity_id'}
                              value={activity_id || ''}
                              onChange={(relation) => {
                                this.setState({ activity_id: relation });
                              }}>
                              <Option value=''>{'No relacionar'}</Option>
                              {dataAgenda.map((activity, key) => (
                                <Option key={key} value={activity._id}>
                                  {activity.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </>
                      )}

                      <Form.Item label={'Permitir valor de la respuesta por usuario'}>
                        <Switch
                          name={'allow_vote_value_per_user'}
                          checked={allow_vote_value_per_user === 'true' || allow_vote_value_per_user === true}
                          onChange={(checked) => this.toggleSwitch('allow_vote_value_per_user', checked)}
                        />
                      </Form.Item>
                      <Form.Item label={`${this.state.title} calificable`}>
                        <Switch
                          name={'allow_gradable_survey'}
                          checked={allow_gradable_survey === 'true' || allow_gradable_survey === true}
                          onChange={(checked) => {
                            this.toggleSwitch('allow_gradable_survey', checked);
                            if (ranking === 'true' || ranking === true) {
                              this.toggleSwitch('ranking', checked);
                            }
                          }}
                        />
                      </Form.Item>
                      {(allow_gradable_survey === 'true' || allow_gradable_survey === true) && (
                        <>
                          <Form.Item label={'Habilitar ranking'}>
                            <Switch
                              name={'ranking'}
                              checked={ranking === 'true' || ranking === true}
                              onChange={(checked) => this.toggleSwitch('ranking', checked)}
                            />
                          </Form.Item>
                          <Form.Item label={'Requiere puntaje mínimo para aprobar'}>
                            <Switch
                              name={'hasMinimumScore'}
                              checked={hasMinimumScore === 'true' || hasMinimumScore === true}
                              onChange={(checked) => this.setState({ hasMinimumScore: checked ? 'true' : 'false' })}
                            />
                          </Form.Item>
                          {(hasMinimumScore === true || hasMinimumScore === 'true') && (
                            <Form.Item label={'Puntaje mínimo para aprobar'}>
                              <Input name={'minimumScore'} value={minimumScore} onChange={this.changeInput} />
                            </Form.Item>
                          )}
                          <>
                            <Form.Item
                              label={
                                <label style={{ marginTop: '2%' }}>
                                  {'Mensaje pantalla inicial de la'}
                                  {` ${this.state.title.toLowerCase()} `}
                                  <label style={{ color: 'red' }}>*</label>
                                </label>
                              }>
                              <ReactQuill
                                name={'initialMessage'}
                                id={'initialMessage'}
                                value={this.state.initialMessage}
                                modules={toolbarEditor}
                                onChange={this.onChange}
                              />
                            </Form.Item>
                            <Form.Item label={`Mensaje pantalla final de la ${this.state.title.toLowerCase()}`}>
                              <ReactQuill
                                name={'neutral_Message'}
                                id={'neutral_Message'}
                                value={this.state.neutral_Message}
                                modules={toolbarEditor}
                                onChange={this.onChangeNeutral}
                              />
                            </Form.Item>
                            <Form.Item label={'Mensaje al ganar'}>
                              <ReactQuill
                                name={'win_Message'}
                                id={'win_Message'}
                                value={this.state.win_Message}
                                modules={toolbarEditor}
                                onChange={this.onChangeWin}
                              />
                            </Form.Item>
                            <Form.Item label={'Mensaje al perder'}>
                              <ReactQuill
                                name={'lose_Message'}
                                id={'lose_Message'}
                                value={this.state.lose_Message}
                                modules={toolbarEditor}
                                onChange={this.onChangeLose}
                              />
                            </Form.Item>
                          </>
                        </>
                      )}
                    
                    <Form.Item label={`${this.state.title} con preguntas aleatorias`}>
                      <Switch
                        name={'random_survey'}
                        checked={random_survey === 'true' || random_survey === true}
                        onChange={(checked) => {
                          this.toggleSwitch('random_survey', checked);
                        }}
                      />
                    </Form.Item>
                    {(random_survey === 'true' || random_survey) && (
                      <Form.Item
                        label={
                          <label style={{ marginTop: '2%' }}>
                            Cantidad de preguntas <label style={{ color: 'red' }}>*</label>
                          </label>
                        }
                        rules={[{ required: true, message: 'La cantidad de preguntas es requerido' }]}>
                        <InputNumber
                          style={{ width: '100%' }}
                          value={random_survey_count}
                          placeholder={`Cantidad de preguntas aleatorias de ${this.state.title.toLowerCase()}`}
                          name={'random_survey_count'}
                          onChange={(value) => this.changeInput({ target: { name: 'random_survey_count', value: Math.max(value, 0) } })}
                        />
                      </Form.Item>
                    )}
                    </>
                  )}
                </Card>
                {this.state.idSurvey && (
                  <>
                    <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
                      <Header title={'Preguntas'} addFn={this.addNewQuestion} />

                      <Table dataSource={question} columns={columns} />
                    </Card>
                    {this.state.idSurvey && Object.entries(currentQuestion).length !== 0 && (
                      <Modal
                        width={700}
                        bodyStyle={{
                          textAlign: 'center',
                        }}
                        visible={visibleModal}
                        maskClosable={false}
                        onOk={this.sendForm}
                        onCancel={this.closeModal}
                        footer={[
                          <Button key='back' onClick={this.closeModal}>
                            Cancelar
                          </Button>,
                          <Button
                            key='submit'
                            type='primary'
                            disabled={confirmLoading}
                            loading={confirmLoading}
                            onClick={this.sendForm}>
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
                            Gestionar pregunta
                          </Title>
                          <FormQuestionEdit
                            ref={this.formEditRef}
                            valuesQuestion={currentQuestion}
                            eventId={this.props.event._id}
                            surveyId={this.state.idSurvey}
                            closeModal={this.closeModal}
                            toggleConfirmLoading={this.toggleConfirmLoading}
                            gradableSurvey={allow_gradable_survey}
                            unmountForm={() => this.setState({ currentQuestion: {} })}
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
}

export default withRouter(TriviaEdit);
