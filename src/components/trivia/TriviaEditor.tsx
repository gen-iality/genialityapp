import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { selectOptions, surveyTimeOptions } from './constants'
import { AgendaApi, SurveysApi } from '@helpers/request'
import ReactQuill from 'react-quill'
import { ColumnsType } from 'antd/lib/table'
import Header from '@antdComponents/Header'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { toolbarEditor } from '@helpers/constants'
import { handleRequestError } from '@helpers/utils'
import RichTextEditor from './RichTextEditor'
import FormQuestionEdit from './FormQuestionEdit'
import Loading from '../profile/loading'
import { FormInstance } from 'antd/es/form/Form'
import { StateMessage } from '@context/MessageService'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'

import { createOrUpdateSurvey, getSurveyConfiguration, deleteSurvey } from './services'

export interface ITriviaEditorProps {
  surveyId?: string
  onCreated?: (surveyId: string) => void
  onSave?: (surveyId: string) => void
  onDelete?: (surveyId: string) => void
  /**
   * Set the mode of the trivia. Default "survey"
   */
  mode?: 'quiz' | 'survey'
  availableActivities?: any[]
  eventId: string
  // Blocked to a activity ID
  activityId?: string
  // Antoher force mechanisms
  forceNonGlobal?: boolean
  forceGradable?: boolean
}

interface ITrivia {
  _id?: string
  tries: number
  survey: string
  activity_id: string
  points: number
  allow_anonymous_answers: boolean
  allow_gradable_survey: boolean
  random_survey: boolean
  random_survey_count: number
  hasMinimumScore: boolean
  isGlobal: boolean
  showNoVotos: boolean

  freezeGame: boolean
  isOpened: boolean
  isPublished: boolean
  time_limit: number
  show_horizontal_bar: boolean
  allow_vote_value_per_user: boolean
  ranking: boolean
  displayGraphsInSurveys: boolean
  rankingVisible: boolean

  initialMessage: string | null
  win_Message: string | null
  neutral_Message: string | null
  lose_Message: string | null
  graphyType: string

  // Puntaje mínimo de aprobación
  minimumScore: number
}

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const TriviaEditor: FunctionComponent<ITriviaEditorProps> = (props) => {
  const {
    surveyId: incomingSurveyId,
    mode = 'survey',
    availableActivities,
    eventId,
    onDelete = () => {},
    onSave = () => {},
    onCreated = () => {},
    activityId,
    forceGradable,
    forceNonGlobal,
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [surveyId, setSurveyId] = useState(incomingSurveyId)
  const [surveyData, setSurveyData] = useState<any>({})
  const [allActivities, setAllActivities] = useState<any[]>([])

  const [currentQuestion, setCurrentQuestion] = useState<any>({})
  const [questions, setQuestions] = useState<any[]>([])
  const [columns, setColumns] = useState<ColumnsType<typeof questions>>([])
  const [isProcessLoading, setIsProcessLoading] = useState(false)

  const [isModalOpened, setIsModalOpened] = useState(false)

  //   const surveyId = '64a4b232e0fd0566b9082784'
  const { eventIsActive } = useHelper()

  const editRef = useRef<FormInstance>(null)

  const [form] = Form.useForm<ITrivia>()

  const shouldDisplayGraphsInSurveys = Form.useWatch('displayGraphsInSurveys', form)
  const shouldBeGlobal = Form.useWatch('isGlobal', form)
  const shouldAllowGradableSurvey = Form.useWatch('allow_gradable_survey', form)
  const shouldHaveMinimumScore = Form.useWatch('hasMinimumScore', form)
  const shouldRandomSurvey = Form.useWatch('random_survey', form)

  const openModal = () => setIsModalOpened(true)
  const closeModal = () => setIsModalOpened(false)

  const generateUUID = () => {
    let d = new Date().getTime()
    const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })

    return uuid
  }

  const addNewQuestion = () => {
    const uid = generateUUID()
    setIsModalOpened(true)
    setIsProcessLoading(true)
    setCurrentQuestion({ id: uid })
  }

  const editQuestion = (questionId: string) => {
    console.log('wanna edit the question', questionId, questions)
    const questionIndex = questions.findIndex((question) => question.id === questionId)

    const newCurrentQuestion = questions.find(
      (infoQuestion) => infoQuestion.id === questionId,
    )
    if (typeof newCurrentQuestion === 'undefined') {
      Modal.warn({
        title: 'Problemas al editar',
        content:
          'No se puede editar la pregunta porque no se ha cargado correctamente las preguntas de esto',
      })
      return
    }
    newCurrentQuestion['questionIndex'] = questionIndex

    openModal()
    setCurrentQuestion(newCurrentQuestion)
  }

  const deleteOneQuestion = (questionId: string) => {
    StateMessage.show(
      null,
      'loading',
      'Por favor espere mientras se borra la información...',
    )

    const questionIndex = questions.findIndex((question) => question.id === questionId)

    Modal.confirm({
      title: `¿Está seguro de eliminar la pregunta?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminada, no la podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        const onHandlerRemove = async () => {
          try {
            SurveysApi.deleteQuestion(eventId, surveyId, questionIndex).then(
              (response) => {
                // Se actualiza el estado local, borrando la pregunta de la tabla
                const newQuestionList = questions.filter(
                  (infoQuestion) => infoQuestion.id !== questionId,
                )

                setQuestions(newQuestionList)

                StateMessage.show(null, 'success', response)
              },
            )
          } catch (e) {
            StateMessage.show(null, 'error', handleRequestError(e).message)
          } finally {
            StateMessage.destroy('loading')
          }
        }
        onHandlerRemove()
      },
    })
  }

  const getQuestions = async (update: any) => {
    const questionList: any[] = []
    for (const prop in update.questions) {
      selectOptions.forEach((option) => {
        if (update.questions[prop].type === option.value)
          update.questions[prop].type = option.text
      })

      questionList.push(update.questions[prop])
    }
    console.debug(questionList)
    setQuestions(questionList)
  }

  /**
   * Get data from persistent storage and prepare the data
   * @param surveyId The survey ID
   * @param eventId The event ID
   *
   * @hookable
   * @dispatchable
   * @classable
   */
  const loadSurveyDataById = async (
    surveyId: string,
    eventId: string,
    isJustCreated?: boolean,
  ) => {
    const firebaseSurvey: any = {} /* await getSurveyConfiguration(surveyId) */
    console.log('firebaseSurvey', firebaseSurvey)

    const update = await SurveysApi.getOne(eventId, surveyId)
    console.log('Update', update)

    form.setFieldsValue({
      // Survey config
      allow_anonymous_answers:
        firebaseSurvey.allow_anonymous_answers ?? update.allow_anonymous_answers,
      allow_gradable_survey:
        typeof forceGradable !== 'undefined'
          ? forceGradable
          : firebaseSurvey.allow_gradable_survey ?? update.allow_gradable_survey,
      hasMinimumScore: firebaseSurvey.hasMinimumScore ?? update.hasMinimumScore ?? false,

      isGlobal:
        typeof forceNonGlobal !== 'undefined'
          ? false
          : firebaseSurvey.isGlobal ?? update.isGlobal ?? false,
      showNoVotos: firebaseSurvey.showNoVotos ?? update.showNoVotos ?? false,

      // Survey state
      freezeGame: firebaseSurvey.freezeGame ?? update.freezeGame ?? false,
      isOpened: firebaseSurvey.isOpened ?? update.open ?? update.isOpened ?? false,
      isPublished:
        firebaseSurvey.isPublished ?? update.published ?? update.isPublished ?? false,

      tries: firebaseSurvey.tries ?? update.tries ?? 1,
      random_survey: firebaseSurvey.random_survey ?? update.random_survey ?? false,
      random_survey_count:
        firebaseSurvey.random_survey_count ?? update.random_survey_count ?? 0,

      survey: update.survey,
      show_horizontal_bar: update.show_horizontal_bar ?? true,
      graphyType: update.graphyType ? update.graphyType : 'y',
      allow_vote_value_per_user: update.allow_vote_value_per_user ?? false,
      activity_id: typeof activityId === 'string' ? activityId : update.activity_id ?? '',

      points: update.points ? update.points : 1,
      initialMessage: update.initialMessage
        ? update.initialMessage.replace(/<br \/>/g, '\n')
        : null,
      time_limit: update.time_limit ? parseInt(update.time_limit) : 0,
      win_Message: update.win_Message ?? '',
      neutral_Message: update.neutral_Message ?? '',
      lose_Message: update.lose_Message ?? '',
      ranking: update.rankingVisible,
      displayGraphsInSurveys: update.displayGraphsInSurveys ?? false,

      minimumScore: update.minimumScore ?? 0,
    })

    if (!isJustCreated) getQuestions(update)
  }

  const sendToFirebase = async (surveyId: string, data: ITrivia) => {
    console.log('will save in firebase for surveyId:', surveyId)
    const setDataInFire = await createOrUpdateSurvey(
      surveyId,
      {
        name: data.survey,
        //Survey config
        allow_anonymous_answers: data.allow_anonymous_answers ?? false,
        allow_gradable_survey:
          typeof forceGradable !== 'undefined'
            ? forceGradable
            : data.allow_gradable_survey ?? false,
        hasMinimumScore: data.hasMinimumScore ?? false,
        isGlobal: data.isGlobal ?? false,
        showNoVotos: data.showNoVotos ?? false,
        time_limit: data.time_limit ?? 0,

        // Survey State
        freezeGame: data.freezeGame ?? false,
        isOpened: data.isOpened ?? false,
        isPublished: data.isPublished ?? false,
        rankingVisible: data.rankingVisible ?? false,
        displayGraphsInSurveys: data.displayGraphsInSurveys ?? false,

        minimumScore: data.minimumScore ?? '',
        activity_id: data.activity_id ?? '',

        // Rossie history inspired this feature
        tries: data.tries ?? 1,
        random_survey: data.random_survey ?? false,
        random_survey_count: data.random_survey_count ?? 1,
      },
      { eventId, name: data.survey, category: 'none' },
    )
    return setDataInFire
  }

  const updateSurvey = async (values: ITrivia) => {
    if (!surveyId) {
      StateMessage.show(null, 'error', 'No se ha cargado el ID de encuesta correctamente')
      console.error(`surveyId is "${surveyId}". Nobody can update with that`)
      return
    }
    // Validate the question amount
    if (values.isPublished && questions.length === 0) {
      return StateMessage.show(
        null,
        'error',
        `${internalTitle} no cuenta con respuestas posibles`,
      )
    }

    // Validate for gradable survey
    if (
      values.allow_gradable_survey ||
      (typeof forceGradable !== 'undefined' && forceGradable)
    ) {
      if (!values.initialMessage) {
        return StateMessage.show(
          null,
          'error',
          `${internalTitle} es calificable, debe asignar un mensaje inicial`,
        )
      }

      // Validate the question format
      let isValid = false
      if (questions.length) {
        if (questions.every((question) => !!question.correctAnswer)) {
          isValid = true
        }
      }

      if (!isValid) {
        return StateMessage.show(
          null,
          'error',
          `${internalTitle} es calificable, hay preguntas sin respuesta correcta asignada`,
        )
      }
    }

    // Send data
    StateMessage.show('updating', 'loading', 'Actualizando información')
    const data = {
      //Survey State
      freezeGame: values.freezeGame,
      isOpened: values.isOpened,
      isPublished: values.isPublished,

      survey: values.survey,
      // Rossie history inspired this feature
      tries: Math.max(values.tries ?? 1, 1),
      time_limit:
        typeof values.time_limit === 'number'
          ? values.time_limit
          : parseInt(values.time_limit),
      displayGraphsInSurveys: values.displayGraphsInSurveys,
      graphyType: values.graphyType ?? 'y',
      showNoVotos: values.showNoVotos ?? false,
      isGlobal: typeof forceNonGlobal !== 'undefined' ? false : values.isGlobal,
      activity_id: typeof activityId === 'string' ? activityId : values.activity_id ?? '',
      allow_vote_value_per_user: values.allow_vote_value_per_user,
      allow_gradable_survey:
        typeof forceGradable !== 'undefined'
          ? forceGradable
          : values.allow_gradable_survey,
      rankingVisible: values.ranking ?? false,
      ranking: values.ranking ?? false,
      hasMinimumScore: values.hasMinimumScore,
      minimumScore:
        typeof values.minimumScore === 'number'
          ? values.minimumScore
          : parseInt(values.minimumScore ?? 0),
      initialMessage: values.initialMessage,
      neutral_Message: values.neutral_Message,
      win_Message: values.win_Message,
      lose_Message: values.lose_Message,
      random_survey: values.random_survey ?? false,
      random_survey_count: values.random_survey_count ?? 0,

      // Orphan properties
      show_horizontal_bar: values.show_horizontal_bar,
      points:
        typeof values.points === 'number' ? values.points : parseInt(values.points ?? 1),
      allow_anonymous_answers: values.allow_anonymous_answers,
    }

    console.log('1. data', data)

    try {
      await SurveysApi.editOne(data, surveyId, eventId)

      StateMessage.destroy('updating')
      // Save too in Firebase
      const setDataInFire = await sendToFirebase(surveyId, data)
      StateMessage.destroy('updating')
      StateMessage.show('updating', 'success', setDataInFire.message)
      console.log('updated the survey')
      onSave(surveyId)
    } catch (err) {
      console.error(err)
      StateMessage.show(null, 'error', 'Ha ocurrido un inconveniente')
    }
  }

  const createSurvey = async (values: ITrivia) => {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se guarda la información...',
    )

    const data: ITrivia = {
      //Survey State
      freezeGame: false,
      isOpened: false,
      isPublished: false,

      survey: values.survey,
      // Rossie history inspired this feature
      tries: Math.max(values.tries ?? 1, 1),
      time_limit: 0,
      displayGraphsInSurveys: false,
      graphyType: 'y',
      showNoVotos: false,
      isGlobal: typeof forceNonGlobal !== 'undefined' ? false : false,
      activity_id: activityId ?? '',
      allow_vote_value_per_user: false,
      allow_gradable_survey: typeof forceGradable !== 'undefined' ? forceGradable : false,
      rankingVisible: false,
      ranking: false,
      hasMinimumScore: false,
      minimumScore: 0,
      initialMessage: '',
      neutral_Message: '',
      win_Message: '',
      lose_Message: '',
      random_survey: false,
      random_survey_count: 0,

      // Orphan properties
      show_horizontal_bar: true,
      points: 1,
      allow_anonymous_answers: false,
    }

    console.log('1. data', data)

    try {
      const saved = await SurveysApi.createOne(eventId, data)
      console.log('saved at database', saved)

      // Important use saved._id as surveyId and save the new surveyId
      await sendToFirebase(saved._id, data)
      onCreated(saved._id)
      setSurveyId(saved._id)
      loadSurveyDataById(saved._id, eventId)

      StateMessage.destroy('loading')
      StateMessage.show(null, 'success', `${internalTitle} se creó correctamente!`)
    } catch (err) {
      console.error(err)
      StateMessage.show(null, 'error', 'Ha ocurrido un inconveniente')
    }
  }

  const handleSubmit = (values: ITrivia) => {
    if (surveyId) {
      updateSurvey(values)
    } else {
      createSurvey(values)
    }
  }

  const handleDeleteSurvey = () => {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se borra la información...',
    )
    Modal.confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        if (!surveyId) {
          StateMessage.show(
            null,
            'error',
            'No se ha cargado el ID de encuesta correctamente',
          )
          return
        }
        const onHandlerRemove = async () => {
          try {
            await SurveysApi.deleteOne(surveyId, eventId)
            await deleteSurvey(surveyId)
            StateMessage.show(null, 'success', 'Se eliminó la información correctamente!')
            onDelete(surveyId)
          } catch (e) {
            StateMessage.show(null, 'error', handleRequestError(e).message)
          } finally {
            StateMessage.destroy('loading')
          }
        }
        onHandlerRemove()
      },
    })
  }

  const closeFormInModal = (info: any, state: string) => {
    console.debug(info, state)

    // Condicional que actualiza el estado local
    // Con esto se ve reflejado el cambio en la tabla
    if (Object.entries(info).length === 2) {
      const { questionIndex, data } = info
      const updatedQuestions = [...questions]
      setQuestions([]) // Why??

      // Se iteran las opciones y se asigna el texto para el tipo de pregunta
      selectOptions.forEach((option) => {
        if (data.type === option.value) data.type = option.text
      })

      switch (state) {
        case 'created':
          updatedQuestions.push(data)
          setQuestions(updatedQuestions)
          break

        case 'updated':
          updatedQuestions.splice(questionIndex, 1, data)
          setQuestions(updatedQuestions)
          break

        default:
          break
      }
    }
    closeModal()
    setCurrentQuestion({})
    setIsLoading(false)
  }

  const internalTitle = useMemo(() => {
    if (mode === 'quiz') return 'El quiz'
    if (mode === 'survey') return 'La encuesta'
    return `cosa mode="${mode}"`
  }, [mode])

  useEffect(() => {
    setSurveyId(incomingSurveyId)
  }, [incomingSurveyId])

  useEffect(() => {
    if (Array.isArray(availableActivities)) {
      setAllActivities(availableActivities)
      console.log('Load activity from given activities')
    } else if (eventId) {
      AgendaApi.byEvent(eventId).then(({ data: activityList }) => {
        console.debug(activityList)
        setAllActivities(activityList)
      })
      console.log('Load activity from requested by event ID', eventId)
    }
  }, [availableActivities, eventId])

  useEffect(() => {
    if (!surveyId) return
    if (!eventId) {
      console.warn('no event ID provided')
      return
    }

    setIsLoading(true)
    loadSurveyDataById(surveyId, eventId).finally(() => setIsLoading(false))
  }, [surveyId, eventId])

  useEffect(() => {
    form.setFieldsValue({ ...surveyData })
  }, [surveyData])

  useEffect(() => {
    setColumns([
      {
        title: 'Pregunta',
        key: 'title',
        render: (item) => (
          <>
            <div style={{ marginBottom: '10px' }}>
              <Tag
                icon={
                  item.correctAnswer ? <CheckCircleOutlined /> : <CloseCircleOutlined />
                }
                color={item.correctAnswer ? 'success' : 'error'}
              >
                {item.correctAnswer ? 'Respuesta asignada' : 'Sin respuesta asignada'}
              </Tag>
            </div>
            <div>{item.title}</div>
          </>
        ),
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
        render: (item) => <div>{item.choices?.length}</div>,
      },
      {
        title: 'Opciones',
        key: 'action',
        render: (item) => (
          <Row gutter={[8, 8]}>
            <Col>
              <Tooltip placement="topLeft" title="Editar">
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  size="small"
                  onClick={() => editQuestion(item.id)}
                  disabled={
                    !eventIsActive && window.location.toString().includes('eventadmin')
                  }
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement="topLeft" title="Eliminar">
                <Button
                  onClick={() => deleteOneQuestion(item.id)}
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  disabled={
                    !eventIsActive && window.location.toString().includes('eventadmin')
                  }
                />
              </Tooltip>
            </Col>
          </Row>
        ),
      },
    ])
  }, [eventIsActive, questions])

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Form form={form} onFinish={handleSubmit} {...formLayout}>
        <Card
          hoverable
          style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}
          extra={
            <Row wrap justify="end" gutter={[8, 8]}>
              {surveyId && (
                <Space style={{ marginRight: 50 }}>
                  <Col>
                    <Form.Item
                      name="isPublished"
                      label="Publicar"
                      labelCol={{ span: 14 }}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Sí" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="isOpened"
                      label="Abrir"
                      labelCol={{ span: 14 }}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Sí" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                </Space>
              )}

              <Col>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  icon={surveyId ? <PlusCircleOutlined /> : <PlusCircleOutlined />}
                >
                  {surveyId ? 'Guardar' : 'Agregar'}
                </Button>
              </Col>
              {surveyId && (
                <Col>
                  <Button
                    type="ghost"
                    danger
                    onClick={handleDeleteSurvey}
                    icon={<DeleteOutlined />}
                  >
                    Eliminar
                  </Button>
                </Col>
              )}
            </Row>
          }
        >
          <Form.Item
            label="Nombre"
            name="survey"
            rules={[{ required: true, message: 'Es necesario el nombre' }]}
          >
            <Input placeholder={`Nombre de ${internalTitle.toLowerCase()}`} />
          </Form.Item>

          <Form.Item
            label="Intentos permitidos"
            name="tries"
            rules={[{ required: true, message: 'Es necesario un valor' }]}
            initialValue={1}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Cantidad de intentos" />
          </Form.Item>

          {typeof surveyId === 'string' ? (
            <>
              <Form.Item name="time_limit" label="Tiempo límite">
                <Select
                  options={surveyTimeOptions.map((value) => ({
                    label: value.text,
                    value: value.value,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="displayGraphsInSurveys"
                label={`Mostrar gráficas en ${internalTitle.toLowerCase()}`}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              {shouldDisplayGraphsInSurveys && (
                <>
                  <Form.Item name="graphyType" label="Elegir tipo de gráfica">
                    <Select
                      options={[
                        { label: 'Horizontal', value: 'y' },
                        { label: 'Vertical', value: 'x' },
                        { label: 'Torta', value: 'pie' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="showNoVotos"
                    label="Mostrar porcentaje de participantes sin votar en las gráficas"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="isGlobal"
                label={`${internalTitle} global (visible en todas las lecciones)`}
                valuePropName="checked"
                initialValue={typeof forceNonGlobal !== 'undefined' ? false : undefined}
              >
                <Switch
                  disabled={typeof forceNonGlobal !== 'undefined'}
                  checked={typeof forceNonGlobal !== 'undefined' ? false : undefined}
                />
              </Form.Item>
              {!shouldBeGlobal && (
                <>
                  <Form.Item
                    name="activity_id"
                    label={`Vincular ${internalTitle.toLowerCase()} con una lección`}
                    initialValue={activityId}
                  >
                    <Select
                      value={typeof activityId === 'string' ? activityId : undefined}
                      disabled={typeof activityId === 'string'}
                      options={
                        typeof activityId === 'string'
                          ? [{ value: activityId, label: 'Actividad vinculada' }]
                          : [{ label: 'No relacionar', value: '' }].concat(
                              allActivities.map((activity) => ({
                                label: activity.name,
                                value: activity._id,
                              })),
                            )
                      }
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="allow_vote_value_per_user"
                label="Permitir valor de la respuesta por usuario"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="allow_gradable_survey"
                label={`${internalTitle} es calificable`}
                valuePropName="checked"
                initialValue={
                  typeof forceGradable !== 'undefined' ? forceGradable : undefined
                }
              >
                <Switch
                  disabled={typeof forceGradable !== 'undefined'}
                  checked={
                    typeof forceGradable !== 'undefined' ? forceGradable : undefined
                  }
                />
              </Form.Item>
              {shouldAllowGradableSurvey && (
                <>
                  <Form.Item
                    name="ranking"
                    label="Habilitar ranking"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name="hasMinimumScore"
                    label="Requiere puntaje mínimo para aprobar"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  {shouldHaveMinimumScore && (
                    <Form.Item name="minimumScore" label="Puntaje mínimo para aprobar">
                      <InputNumber min={0} />
                    </Form.Item>
                  )}

                  <Form.Item
                    name="initialMessage"
                    label={`Mensaje pantalla inicial de ${internalTitle.toLowerCase()}`}
                  >
                    <RichTextEditor />
                  </Form.Item>
                  <Form.Item
                    name="neutral_Message"
                    label={`Mensaje pantalla final de ${internalTitle.toLowerCase()}`}
                  >
                    <RichTextEditor />
                  </Form.Item>
                  <Form.Item
                    name="win_Message"
                    label={`Mensaje al ganar ${internalTitle.toLowerCase()}`}
                  >
                    <RichTextEditor />
                  </Form.Item>
                  <Form.Item
                    name="lose_Message"
                    label={`Mensaje al perder ${internalTitle.toLowerCase()}`}
                  >
                    <RichTextEditor />
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="random_survey"
                label={`${internalTitle} con preguntas aleatorias`}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              {shouldRandomSurvey && (
                <Form.Item
                  name="random_survey_count"
                  label="Cantidad de preguntas"
                  rules={[
                    {
                      required: true,
                      message: 'La cantidad de preguntas es requerido',
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder={`Cantidad de preguntas aleatorias de ${internalTitle.toLowerCase()}`}
                  />
                </Form.Item>
              )}
            </>
          ) : null}
        </Card>
      </Form>

      {surveyId && (
        <Card
          hoverable
          style={{
            cursor: 'auto',
            marginBottom: '20px',
            borderRadius: '20px',
          }}
        >
          <Header title="Preguntas" addFn={addNewQuestion} />

          <Table dataSource={questions} columns={columns} />
        </Card>
      )}

      {surveyId && Object.entries(currentQuestion).length !== 0 ? (
        <Modal
          width={700}
          bodyStyle={{
            textAlign: 'center',
          }}
          open={isModalOpened}
          onOk={() => setIsProcessLoading(true)}
          onCancel={closeModal}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={closeModal}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={isProcessLoading}
              loading={isProcessLoading}
              onClick={() => {
                setIsProcessLoading(true)
                if (editRef.current) {
                  editRef.current.submit()
                }
              }}
            >
              Guardar
            </Button>,
          ]}
        >
          <>
            <Typography.Title
              style={{
                marginTop: '20px',
                marginBottom: '20px',
              }}
              level={4}
              type="secondary"
            >
              Gestionar pregunta
            </Typography.Title>
            <FormQuestionEdit
              ref={editRef}
              valuesQuestion={currentQuestion}
              eventId={eventId}
              surveyId={surveyId}
              closeModal={closeFormInModal}
              toggleConfirmLoading={() => setIsProcessLoading(false)}
              gradableSurvey={
                typeof forceGradable !== 'undefined'
                  ? forceGradable
                  : form.getFieldValue('allow_gradable_survey')
              }
              unmountForm={() => setCurrentQuestion({})}
            />
          </>
        </Modal>
      ) : surveyId ? (
        <em>Seleccione una pregunta para editar</em>
      ) : (
        <em>Cree {internalTitle.toLowerCase()} para agregar preguntas</em>
      )}
    </>
  )
}

export default TriviaEditor
