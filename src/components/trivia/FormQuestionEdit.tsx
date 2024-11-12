import { useState, useEffect, forwardRef } from 'react'
import {
  fieldsFormQuestion,
  fieldsFormQuestionWithPoints,
  selectOptions,
  searchWithMultipleIndex,
} from './constants'
import { SurveysApi } from '@helpers/request'
import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  Radio,
  Checkbox,
  Upload,
  Alert,
  Space,
  Typography,
  Tooltip,
  Table,
  Divider,
  InputNumber,
} from 'antd'
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { saveImageStorage } from '@helpers/helperSaveImage'
import { StateMessage } from '@context/MessageService'
import { uploadImagedummyRequest } from '@Utilities/imgUtils'
import LikertScaleEditor from '../quiz/LikertScaleEditor'
import { SurveyQuestion } from '@components/events/surveys/types'
import TextArea from 'antd/lib/input/TextArea'
import classNames from 'classnames'

const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}
const { Text } = Typography

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}

const dataSource = [
  {
    key: '1',
    width: '500px',
    height: '300px',
  },
  {
    key: '2',
    width: '600px',
    height: '300px',
  },
]

const columns = [
  {
    title: 'Ancho',
    dataIndex: 'width',
    key: 'width',
  },
  {
    title: 'Alto',
    dataIndex: 'height',
    key: 'height',
  },
]

interface ExtendedSurveyQuestion extends SurveyQuestion {
  [key: string]: any
}

export interface IFormQuestionEditProps {
  valuesQuestion: ExtendedSurveyQuestion
  eventId: string
  surveyId: string
  closeModal: any
  toggleConfirmLoading: any
  gradableSurvey: boolean
  unmountForm: any
}

const FormQuestionEdit = forwardRef<any, IFormQuestionEditProps>((props, ref) => {
  const {
    valuesQuestion,
    eventId,
    surveyId,
    closeModal,
    toggleConfirmLoading,
    gradableSurvey,
    unmountForm,
  } = props
  const [defaultValues, setDefaultValues] = useState<any>({})
  const [questionId, setQuestionId] = useState<string>('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [allowGradableSurvey, setAllowGradableSurvey] = useState(false)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number[] | null>([])
  const [questionType, setQuestionType] = useState<string | undefined>()
  const [defaultImgValue, setDefaultImgValue] = useState<any[] | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  /** se almacenan las dimenciones de la imagen para mostarlas en el error */
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })
  /** Estado para validar algun error en las dimensiones de la imagen */
  const [wrongDimensions, setWrongDimensions] = useState(false)
  // Order for the ranking correct answers
  const [rankingCorrectAnswers, setRankingCorrectAnswers] = useState<any[]>([])
  // This stuffs are used for the rating questions
  const [maxRateDescription, setMaxRateDescription] =
    useState<string>('Completely satisfied')
  const [rateMax, setRateMax] = useState<number>(10)
  const [minRateDescription, setMinRateDescription] = useState<string>('Not Satisfied')
  const [rateMin, setRateMin] = useState<number>(0)
  const [ratingCorrectAnswer, setRatingCorrectAnswer] = useState<any | undefined>()
  // For the likert scale surveys
  const [likertScaleData, setLikertScaleData] = useState<any | undefined>()
  // For the text type
  const [rawText, setRawText] = useState('')

  const [form] = Form.useForm()

  useEffect(() => {
    if (valuesQuestion.image && valuesQuestion.image !== null) {
      const images = Array.isArray(valuesQuestion.image)
        ? valuesQuestion.image
        : [valuesQuestion.image]
      setDefaultImgValue(images)
    } else {
      setDefaultImgValue(undefined)
    }

    return () => {
      setDefaultImgValue(undefined)
      setWrongDimensions(false)
      unmountForm()
      setRankingCorrectAnswers([])
    }
  }, [])

  const editRankingCorrectAnswer = (index: number, value: any) => {
    const newRecord = [...rankingCorrectAnswers]
    newRecord[index] = value
    setRankingCorrectAnswers(newRecord)
  }

  /**
   * Build a fake correct answer index for the ranking type.
   * @param {number} size The field size.
   */
  const buildFakeCorrectAnswerIndexForRankingType = (size: number) => {
    setCorrectAnswerIndex(Array.from(Array(size).keys()))
  }

  /**
   * * This function is used to upload an image to the firebase Blob Storage.
   * * The image is selected from the default image dropdown list.
   * * If the image is selected, the image is uploaded to the firebase Blob Storage.
   * * The image is then returned.
   * @returns The URL of the uploaded image.
   */
  async function saveEventImage() {
    const selectedLogo =
      defaultImgValue !== null && defaultImgValue !== undefined
        ? defaultImgValue[0].thumbUrl
        : null
    if (selectedLogo?.includes('https://')) return selectedLogo
    if (selectedLogo) {
      const urlOfTheUploadedImage = await saveImageStorage(selectedLogo)

      return urlOfTheUploadedImage
    }
    return null
  }

  /**
   * The function validates the image dimensions of the uploaded image
   * @returns The return value is the boolean value of the validation.
   */
  function validatingImageDimensions(blobImage: any) {
    const reader = new FileReader() //Initiate the FileReader object.
    //Read the contents of Image File.
    reader.readAsDataURL(blobImage)
    reader.onload = function (e) {
      //Initiate the JavaScript Image object.
      const image = new Image()

      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result

      //Validate the File Height and Width.
      image.onload = function () {
        const height = this.height
        const width = this.width
        // if (height > 300 || width > 600) {
        //   setDimensions({
        //     width: width,
        //     height: height,
        //   })
        //   setDefaultImgValue(undefined)
        //   setWrongDimensions(true)

        //   return false
        // }
        return true
      }
    }
  }

  useEffect(() => {
    setIsLoading(true)
    console.log('valuesQuestion', valuesQuestion)

    setDefaultValues(valuesQuestion)
    setQuestionId(valuesQuestion.id)
    setQuestionIndex(valuesQuestion.questionIndex)

    if (valuesQuestion.type) {
      const choice = selectOptions.find((option) => option.text === valuesQuestion.type)
      setQuestionType(choice ? choice.value : choice)
    }

    if (valuesQuestion.type === 'Rating') {
      console.debug('valuesQuestion.type = rating')
      setMaxRateDescription(valuesQuestion.maxRateDescription || 'Completely satisfied.')
      setRateMax(valuesQuestion.rateMax || 10)
      setMinRateDescription(valuesQuestion.minRateDescription || 'Not Satisfied.')
      setRateMin(valuesQuestion.rateMin || 0)
      setRatingCorrectAnswer(valuesQuestion.correctAnswer || 0)
    }

    setAllowGradableSurvey(gradableSurvey)

    if (Array.isArray(valuesQuestion.correctAnswerIndex)) {
      setCorrectAnswerIndex(valuesQuestion.correctAnswerIndex)
    } else {
      setCorrectAnswerIndex([valuesQuestion.correctAnswerIndex])
    }
    // Load rankingCorrectAnswers
    if (valuesQuestion.type === 'Ranking') {
      ;(valuesQuestion.correctAnswer || []).forEach((answer, index) => {
        const position = valuesQuestion.choices.indexOf(answer)
        if (position < 0) {
          // Then, nobody knows what it is
          return
        }
        rankingCorrectAnswers[index] = position + 1
      })
    }

    if (valuesQuestion.type === 'Escala de Likert (matrix)') {
      console.debug('load matrix')
      setLikertScaleData({
        ...likertScaleData, // Previous data
        values: valuesQuestion.correctAnswer, // The correct answers
        rows: valuesQuestion.choices.rows,
        columns: valuesQuestion.choices.columns,
      })
    }

    if (valuesQuestion.type === 'Texto') {
      console.debug('load text')
      setRawText(
        Array.isArray(valuesQuestion.correctAnswer)
          ? valuesQuestion.correctAnswer[0]
          : valuesQuestion.correctAnswer ?? '',
      )
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [form, valuesQuestion])

  const handleRadio = (e: any) => {
    setCorrectAnswerIndex(e.target.value)
  }

  const handleCheckbox = (value: any[]) => {
    setCorrectAnswerIndex(value.sort((a, b) => a - b))
  }

  const handleFunction = (value: string) => {
    setQuestionType(value)
    setCorrectAnswerIndex(value === 'radiogroup' ? null : [])
  }

  const fieldValidation = (rule: any, value: any) => {
    if (value) {
      toggleConfirmLoading()
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  }

  /**
   * Sort the choices list according to the ranking list.
   * If the ranking list has null-values, then this null-values will be
   * taken as zero.
   * @param {number[]} choices The options.
   * @param {number[]} ranking The options' order.
   * @returns {number[]}
   */
  const sortChoicesByRanking = (choices: any[], ranking: any[]) => {
    const pairs = choices.map((value, i) => ({ value, r: ranking[i] }))
    console.debug('pairs', pairs)
    const result = pairs.sort((a, b) => {
      if (a.r === undefined) return -1
      if (b.r === undefined) return 1
      if (a.r === undefined && b.r === undefined) return 0
      if (a.r > b.r) return 1
      if (a.r < b.r) return -1
      if (a.r === b.r) return 0
    })

    console.debug(choices)
    console.debug()
    console.debug(ranking)
    console.debug()
    console.debug(result)

    return result.map((r) => r.value)
  }

  const onFinish = async (values: any) => {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se guarda la información...',
    )
    values['id'] = questionId

    const imageUrl = await saveEventImage()

    delete values.image
    delete values.video

    if (imageUrl) {
      const newImagenValue = [
        {
          uid: 'img-' + questionId,
          name: 'banner',
          status: 'done',
          type: 'image',
          thumbUrl: imageUrl,
          imageLink: imageUrl,
          imageWidth: '500px',
          imageHeight: '300px',
        },
      ]
      values.image = newImagenValue
    } else {
      values.image = imageUrl
    }

    const videoURL = values.url

    if (videoURL) {
      const newVideoValue = [
        {
          uid: 'video-' + questionId,
          type: 'html',
          name: 'videoQuestion',
          html: `<div style='position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;'>
                  <iframe style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='${videoURL}&title=0&byline=0&portrait=0' allowFullScreen allowusermedia frameborder='0'>
                  </iframe>
                </div>`,
          url: videoURL,
        },
      ]
      values.video = newVideoValue
    } else {
      values.video = null
    }

    const fixedCorrectAnswerIndex = Array.isArray(correctAnswerIndex)
      ? correctAnswerIndex.map((x) => x || 0)
      : [correctAnswerIndex || 0]

    if (allowGradableSurvey) {
      switch (questionType) {
        case 'radiogroup':
          values['correctAnswer'] =
            values.choices && values.choices[fixedCorrectAnswerIndex[0]]
          values['correctAnswerIndex'] = fixedCorrectAnswerIndex
          break

        case 'checkbox':
          values['correctAnswer'] =
            values.choices &&
            searchWithMultipleIndex(values.choices, fixedCorrectAnswerIndex)
          values['correctAnswerIndex'] = fixedCorrectAnswerIndex
          break

        case 'ranking':
          // TODO: implement that. Take in mind the order defined in `rankingCorrectAnswers`
          const sortted = sortChoicesByRanking(values.choices, rankingCorrectAnswers)
          console.debug(values.choices, rankingCorrectAnswers, sortted)
          values['correctAnswer'] = sortted
          values['correctAnswerIndex'] = fixedCorrectAnswerIndex
          break

        case 'rating':
          values['isRequired'] = true
          values['correctAnswer'] = ratingCorrectAnswer
          values['correctAnswerIndex'] = fixedCorrectAnswerIndex
          break

        case 'matrix':
          values['correctAnswer'] = likertScaleData?.values || []
          values['isRequired'] = true
          values['correctAnswerIndex'] = fixedCorrectAnswerIndex
          break

        case 'text':
          values['isRequired'] = true
          values['correctAnswer'] = rawText
          values['correctAnswerIndex'] = 0
          break

        default:
          break
      }
    }
    console.debug('will save values', values)

    if (questionType === 'matrix') {
      values['choices'] = {
        rows: likertScaleData?.rows || {},
        columns: likertScaleData?.columns || {},
      }
    } else if (questionType === 'rating') {
      values['maxRateDescription'] = maxRateDescription
      values['rateMax'] = rateMax
      values['minRateDescription'] = minRateDescription
      values['rateMin'] = rateMin
    } else if (questionType === 'text') {
      values['choices'] = []
    }

    if (values.type.indexOf(' ') > 0) {
      selectOptions.forEach((option) => {
        if (values.type === option.text) values.type = option.value
      })
    }

    const pointsValue = values.points ? values.points : '1'
    const dataValues = { ...values, points: pointsValue }

    const exclude = (data: any) => {
      delete data.questionOptions
      return data
    }

    if (questionIndex === undefined) {
      try {
        SurveysApi.createQuestion(eventId, surveyId, exclude(dataValues)).then(() => {
          form.resetFields()
          closeModal({ questionIndex, data: exclude(dataValues) }, 'created')
          StateMessage.destroy('loading')
          StateMessage.show(null, 'success', 'Pregunta creada')
        })
      } catch (err) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', 'Problema creando la pregunta!')
      }
    } else {
      SurveysApi.editQuestion(eventId, surveyId, questionIndex, exclude(dataValues))
        .then(() => {
          form.resetFields()
          closeModal({ questionIndex, data: exclude(dataValues) }, 'updated')
          StateMessage.destroy('loading')
          StateMessage.show(null, 'success', 'Pregunta actualizada')
        })
        .catch((err) => {
          console.error(err)
          StateMessage.destroy('loading')
          StateMessage.show(null, 'error', 'No se pudo actualizar la pregunta')
        })
    }
  }

  function handleRemoveImg() {
    setDefaultImgValue(undefined)
  }

  if (Object.entries(defaultValues).length !== 0) {
    return (
      <>
        {isLoading ? (
          <Spin />
        ) : (
          <Form
            {...layout}
            form={form}
            ref={ref}
            name="form-edit"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={defaultValues} // initial values
          >
            {allowGradableSurvey ? (
              <div>
                {fieldsFormQuestionWithPoints.map((field, key) =>
                  field.type ? (
                    <Form.Item
                      key={`field${key}${field.name}`}
                      name={field.name}
                      label={field.label}
                      rules={[
                        { required: true },
                        {
                          validator: fieldValidation,
                        },
                      ]}
                      initialValue={field.defaultValue}
                    >
                      <TextArea defaultValue={field.defaultValue} />
                    </Form.Item>
                  ) : (
                    field.selectOptions && (
                      <Form.Item
                        key={`field${key}`}
                        name={field.name}
                        label={field.label}
                        rules={[
                          { required: true },
                          {
                            validator: fieldValidation,
                          },
                        ]}
                      >
                        <Select
                          placeholder="Seleccione una Opcion"
                          onChange={handleFunction}
                        >
                          {field.selectOptions.map((option: any, index: number) =>
                            option.text ? (
                              <Option key={`type${index}`} value={option.value}>
                                {option.text}
                              </Option>
                            ) : (
                              <Option key={`quantity${index}`} value={option}>
                                {option}
                              </Option>
                            ),
                          )}
                        </Select>
                      </Form.Item>
                    )
                  ),
                )}
              </div>
            ) : (
              <div>
                {fieldsFormQuestion.map((field, key) =>
                  field.type ? (
                    <Form.Item
                      key={`field${key}${field.name}`}
                      name={field.name}
                      label={field.label}
                      rules={[
                        { required: true },
                        {
                          validator: fieldValidation,
                        },
                      ]}
                    >
                      {/* <Input /> */}
                      <TextArea />
                    </Form.Item>
                  ) : (
                    field.selectOptions && (
                      <Form.Item
                        key={`field${key}`}
                        name={field.name}
                        label={field.label}
                        rules={[
                          { required: true },
                          {
                            validator: fieldValidation,
                          },
                        ]}
                      >
                        <Select
                          placeholder="Seleccione una Opción"
                          onChange={handleFunction}
                        >
                          {field.selectOptions.map((option: any, index: number) =>
                            option.text ? (
                              <Option key={`type${index}`} value={option.value}>
                                {option.text}
                              </Option>
                            ) : (
                              <Option key={`quantity${index}`} value={option}>
                                {option}
                              </Option>
                            ),
                          )}
                        </Select>
                      </Form.Item>
                    )
                  ),
                )}
              </div>
            )}
            <>
              <Form.Item key="img" name="image" label="Imagen">
                <Space direction="horizontal">
                  <Upload
                    multiple={false}
                    accept="image/png, image/jpeg"
                    name="logo"
                    listType="picture"
                    maxCount={1}
                    /** Se envia el blob del upload para validar las dimensiones */
                    action={(file) => {
                      validatingImageDimensions(file)
                    }}
                    onChange={(file) => {
                      console.log('file:', file.fileList)
                      if (file.fileList.length > 0) {
                        setDefaultImgValue(file.fileList)
                        setWrongDimensions(false)
                      } else {
                        setWrongDimensions(false)
                        setDefaultImgValue(undefined)
                      }
                    }}
                    customRequest={uploadImagedummyRequest}
                    fileList={defaultImgValue}
                    onRemove={handleRemoveImg}
                  >
                    <Button icon={<UploadOutlined />}>Cargar imagen</Button>
                  </Upload>
                  <Tooltip
                    title={
                      <div style={{ background: 'white', padding: '10px' }}>
                        {/* <Text type="secondary">
                          Tenga en cuenta que la dimensión de la imagen deben coincidir
                          con la siguiente tabla.
                        </Text>
                        <Divider />
                        <Table
                          dataSource={dataSource}
                          columns={columns}
                          pagination={false}
                          size="small"
                        /> */}
                      </div>
                    }
                  >
                    <QuestionCircleOutlined
                      style={{ color: '#faad14', marginRight: '10px' }}
                    />
                  </Tooltip>
                </Space>
              </Form.Item>
              {wrongDimensions && (
                <Alert
                  showIcon
                  closable
                  className="animate__animated animate__bounceIn"
                  style={{
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    borderLeft: '5px solid #FF4E50',
                    fontSize: '14px',
                    textAlign: 'start',
                    borderRadius: '5px',
                  }}
                  type="error"
                  message={
                    <p>
                      Las dimensiones de la imagen actual son:{' '}
                      <strong>
                        {dimensions.width}*{dimensions.height}
                      </strong>
                      .
                    </p>
                  }
                />
              )}
            </>
            <>
              <Form.Item name="url" label="URL">
                <Input
                  size="middle"
                  onChange={(e) => {
                    console.log('e.target.value', e.target.value)
                  }}
                />
              </Form.Item>
            </>

            <Form.List name="choices">
              {(fields, { add, remove }) => {
                return (
                  <>
                    <style>
                      {`
                    .abc-ranking, .abc-ranking > .ant-space-item { width: 100%; }
                    .abc-rating, .abc-rating > .ant-space-item, .abc-rating > .ant-space-item > .ant-space-vertical { width: 100%; }
                    `}
                    </style>
                    <Space
                      direction="vertical"
                      className={classNames({
                        'abc-ranking':
                          questionType === 'ranking' || questionType === 'rating',
                      })}
                      style={{ width: '100%' }}
                    >
                      {questionType === 'radiogroup' ? (
                        <Radio.Group
                          onChange={handleRadio}
                          disabled={!allowGradableSurvey}
                          value={
                            Array.isArray(correctAnswerIndex)
                              ? correctAnswerIndex[0]
                              : correctAnswerIndex
                          }
                          style={{ display: 'block', marginRight: 0 }}
                        >
                          {fields.map((field, index) => (
                            <Form.Item
                              label={<Text type="secondary">Respuesta {index + 1}</Text>}
                              required={false}
                              key={field.key}
                            >
                              <Radio value={index} style={{ width: '100%' }}>
                                {fields.length > 2 ? (
                                  <MinusCircleOutlined
                                    onClick={() => {
                                      remove(field.name)
                                    }}
                                  />
                                ) : null}
                              </Radio>

                              <Form.Item
                                style={{ width: '100%' }}
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: `Por favor ingresa un valor a la respuesta ${
                                      index + 1
                                    }`,
                                  },
                                  {
                                    validator: fieldValidation,
                                  },
                                ]}
                              >
                                <TextArea
                                  placeholder="Asignar respuesta"
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            </Form.Item>
                          ))}
                        </Radio.Group>
                      ) : questionType === 'checkbox' ? (
                        <Checkbox.Group
                          onChange={handleCheckbox}
                          disabled={!allowGradableSurvey}
                          value={correctAnswerIndex}
                          style={{ display: 'block' }}
                        >
                          {fields.map((field, index) => (
                            <Form.Item
                              label={<Text type="secondary">Respuesta {index + 1}</Text>}
                              required={false}
                              key={field.key}
                            >
                              <Checkbox value={index} style={{ width: '100%' }}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: `Por favor ingresa un valor a la respuesta ${
                                        index + 1
                                      }`,
                                    },
                                    {
                                      validator: fieldValidation,
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Input
                                    placeholder="Asingar respuesta"
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                                {fields.length > 2 ? (
                                  <MinusCircleOutlined
                                    onClick={() => {
                                      remove(field.name)
                                    }}
                                  />
                                ) : null}
                              </Checkbox>
                            </Form.Item>
                          ))}
                        </Checkbox.Group>
                      ) : questionType === 'ranking' ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <p>
                            Este tipo de pregunta permite al usuario ordenar elementos en
                            una lista proporcionada.
                          </p>
                          <p>Orden de las opciones:</p>
                          {fields.map((field, index) => (
                            <Form.Item
                              label={<Text type="secondary">Opción</Text>}
                              required={false}
                              key={field.key}
                            >
                              <Space direction="horizontal" key={`space_${field.key}`}>
                                {allowGradableSurvey && (
                                  <InputNumber
                                    value={rankingCorrectAnswers[index] || ''} // Value
                                    onChange={(e) => editRankingCorrectAnswer(index, e)}
                                    placeholder="#orden"
                                    style={{ maxWidth: '5em' }}
                                  />
                                )}
                                <Form.Item
                                  {...field}
                                  noStyle
                                  style={{ width: '100%' }}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: `Por favor ingresa la opción ${index + 1}`,
                                    },
                                    {
                                      validator: fieldValidation,
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="Asingar opción"
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Space>
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  onClick={() => {
                                    remove(field.name)
                                    // Delete its ranking
                                    const newRankingCorrectAnswers = [
                                      ...rankingCorrectAnswers,
                                    ]
                                    newRankingCorrectAnswers.splice(index, 1)
                                    setRankingCorrectAnswers(newRankingCorrectAnswers)
                                    buildFakeCorrectAnswerIndexForRankingType(
                                      fields.length - 1,
                                    )
                                  }}
                                />
                              ) : null}
                            </Form.Item>
                          ))}
                          <p>
                            Si es calificable, la respuesta correcta será acorde al orden
                            asignado a cada opción.
                          </p>
                        </Space>
                      ) : questionType === 'rating' ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {/* The max rate description in this question kind */}
                          <p>
                            Este tipo de pregunta permite al usuario seleccionar un valor
                            en un rango proporcionado, basado en un valor mínimo y un
                            máximo.
                          </p>
                          <Form.Item
                            label={
                              <Text type="secondary">
                                Descripción de la valuación máxima
                              </Text>
                            }
                            required
                          >
                            <Input
                              value={maxRateDescription}
                              onChange={(e) => setMaxRateDescription(e.target.value)}
                              placeholder="Descripción de la valuación máxima"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>

                          {/* The max value */}
                          <Form.Item
                            label={<Text type="secondary">Valor máxima</Text>}
                            required
                          >
                            <InputNumber
                              // style={{ maxWidth: '5em' }}
                              value={rateMax}
                              onChange={(e) => setRateMax(e)}
                              placeholder="Valor de la valuación máxima"
                              style={{ width: '100%' }}
                              min={0}
                            />
                          </Form.Item>

                          {/* The min rate description in this question kind */}
                          <Form.Item
                            label={
                              <Text type="secondary">
                                Descripción de la valuación mínima
                              </Text>
                            }
                            required
                          >
                            <Input
                              value={minRateDescription}
                              onChange={(e) => setMinRateDescription(e.target.value)}
                              placeholder="Descripción de la valuación mínima"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>

                          {/* The min value */}
                          <Form.Item
                            label={<Text type="secondary">Valor mínima</Text>}
                            required
                          >
                            <InputNumber
                              // style={{ maxWidth: '5em' }}
                              value={rateMin}
                              onChange={(e) => setRateMin(e)}
                              placeholder="Valor de la valuación mínima"
                              style={{ width: '100%' }}
                              min={0}
                            />
                          </Form.Item>

                          {/* The correct answer */}
                          {allowGradableSurvey && (
                            <Form.Item
                              label={<Text type="secondary">Valoración correcta</Text>}
                              required
                            >
                              <InputNumber
                                // style={{ maxWidth: '5em' }}
                                value={ratingCorrectAnswer || ''}
                                onChange={(e) => setRatingCorrectAnswer(e)}
                                placeholder="Valoración correcta"
                                style={{ width: '100%' }}
                                min={0}
                              />
                              <p>
                                Si marca como evaluable, este valor será usado como
                                respuesta correcta.
                              </p>
                            </Form.Item>
                          )}
                        </Space>
                      ) : questionType === 'matrix' ? (
                        <Space direction="vertical">
                          <p>
                            Este tipo de pregunta representa una escala psicométrica que
                            mide el grado en que el encuestado está de acuerdo o en
                            desacuerdo con cada consulta.
                          </p>
                          <LikertScaleEditor
                            source={likertScaleData || {}}
                            onEdit={(x) => setLikertScaleData(x)}
                          />
                        </Space>
                      ) : questionType === 'text' ? (
                        <Form.Item label="Texto">
                          <Input
                            value={rawText}
                            onChange={(e) => {
                              setCorrectAnswerIndex(0)
                              setRawText(e.target.value ?? '')
                            }}
                          />
                        </Form.Item>
                      ) : (
                        <p>Tipo desconocido</p>
                      )}
                    </Space>
                    {fields.length < 15 &&
                      questionType !== 'rating' &&
                      questionType !== 'text' && (
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              add()
                              if (questionType === 'ranking') {
                                // Only for ranking
                                buildFakeCorrectAnswerIndexForRankingType(
                                  fields.length + 1,
                                )
                              }
                            }}
                          >
                            <PlusOutlined /> Agregar otra{' '}
                            {questionType === 'ranking' ? 'opción' : 'respuesta'}
                          </Button>
                        </Form.Item>
                      )}
                  </>
                )
              }}
            </Form.List>
            <p>
              <ExclamationCircleOutlined
                style={{ color: '#faad14', marginRight: '10px' }}
              />
              <small>
                <b>
                  Tenga en cuenta que la cantidad de respuestas posibles está limitada a
                  15
                </b>
              </small>
            </p>
          </Form>
        )}
      </>
    )
  } else {
    return null
  }
})

FormQuestionEdit.displayName = 'FormQuestionEdit'

export default FormQuestionEdit