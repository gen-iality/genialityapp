import { useState, useEffect, forwardRef } from 'react';
import { fieldsFormQuestion, fieldsFormQuestionWithPoints, selectOptions, searchWithMultipleIndex } from './constants';
import { SurveysApi } from '../../helpers/request';
import { Form, Input, Button, Select, Spin, Radio, Checkbox, Upload, Alert, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Actions } from '../../helpers/request';
import { saveImageStorage } from '../../helpers/helperSaveImage';
import { DispatchMessageService } from '../../context/MessageService';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const FormEdit = (
  { valuesQuestion, eventId, surveyId, closeModal, toggleConfirmLoading, gradableSurvey, unmountForm },
  ref
) => {
  const [defaultValues, setDefaultValues] = useState({});
  const [questionId, setQuestionId] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allowGradableSurvey, setAllowGradableSurvey] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [questionType, setQuestionType] = useState(null);
  const [defaultImgValue, setDefaultImgValue] = useState(null);
  const [loading, setLoading] = useState(false);
  /** se almacenan las dimenciones de la imagen para mostarlas en el error */
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  /** Estado para validar algun error en las dimensiones de la imagen */
  const [wrongDimensions, setWrongDimensions] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (valuesQuestion.image && valuesQuestion.image !== null) {
      setDefaultImgValue(valuesQuestion.image);
    } else {
      setDefaultImgValue(null);
    }

    return () => {
      setDefaultImgValue(null);
      setWrongDimensions(false);
      unmountForm();
    };
  }, []);

  /** request para no mostrar el error que genera el component upload de antd */
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  /**
   * * This function is used to upload an image to the firebase Blob Storage.
   * * The image is selected from the default image dropdown list.
   * * If the image is selected, the image is uploaded to the firebase Blob Storage.
   * * The image is then returned.
   * @returns The URL of the uploaded image.
   */
  async function saveEventImage() {
    const selectedLogo = defaultImgValue !== null ? defaultImgValue[0].thumbUrl : null;
    if (selectedLogo?.includes('https://')) return selectedLogo;
    if (selectedLogo) {
      const urlOfTheUploadedImage = await saveImageStorage(selectedLogo);

      return urlOfTheUploadedImage;
    }
    return null;
  }

  /**
   * The function validates the image dimensions of the uploaded image
   * @returns The return value is the boolean value of the validation.
   */
  function validatingImageDimensions(blobImage) {
    var reader = new FileReader(); //Initiate the FileReader object.
    //Read the contents of Image File.
    reader.readAsDataURL(blobImage);
    reader.onload = function(e) {
      //Initiate the JavaScript Image object.
      var image = new Image();

      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;

      //Validate the File Height and Width.
      image.onload = function() {
        var height = this.height;
        var width = this.width;
        if (height > 300 || width > 600) {
          setDimensions({
            width: width,
            height: height,
          });
          setDefaultImgValue(null);
          setWrongDimensions(true);

          return false;
        }
        return true;
      };
    };
  }

  useEffect(() => {
    setLoading(true);
    let state = gradableSurvey === 'true' ? true : false;

    setDefaultValues(valuesQuestion);
    setQuestionId(valuesQuestion.id);
    setQuestionIndex(valuesQuestion.questionIndex);

    if (valuesQuestion.type) {
      let choice = selectOptions.find((option) => option.text === valuesQuestion.type);
      setQuestionType(choice.value);
    }

    setAllowGradableSurvey(state);

    setCorrectAnswerIndex(valuesQuestion.correctAnswerIndex);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, valuesQuestion]);

  const handleRadio = (e) => {
    setCorrectAnswerIndex(e.target.value);
  };

  const handleCheckbox = (value) => {
    setCorrectAnswerIndex(value.sort((a, b) => a - b));
  };

  const handleFunction = (value) => {
    setQuestionType(value);
    setCorrectAnswerIndex(value === 'radiogroup' ? null : []);
  };

  const fieldValidation = (rule, value) => {
    if (value) {
      toggleConfirmLoading();
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  };

  const onFinish = async (values) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });
    values['id'] = questionId;

    const imageUrl = await saveEventImage();

    delete values.image;

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
      ];
      values.image = newImagenValue;
    } else {
      values.image = imageUrl;
    }

    if (allowGradableSurvey) {
      switch (questionType) {
        case 'radiogroup':
          values['correctAnswer'] = values.choices && values.choices[correctAnswerIndex];
          values['correctAnswerIndex'] = correctAnswerIndex;
          break;

        case 'checkbox':
          values['correctAnswer'] = values.choices && searchWithMultipleIndex(values.choices, correctAnswerIndex);
          values['correctAnswerIndex'] = correctAnswerIndex;
          break;

        default:
          break;
      }
    }

    if (values.type.indexOf(' ') > 0) {
      selectOptions.forEach((option) => {
        if (values.type === option.text) values.type = option.value;
      });
    }
    // eslint-disable-next-line no-unused-vars
    const pointsValue = values.points ? values.points : '1';
    const dataValues = { ...values, points: pointsValue };
    const exclude = ({ questionOptions, ...rest }) => rest;
    if (questionIndex === undefined) {
      try {
        SurveysApi.createQuestion(eventId, surveyId, exclude(dataValues)).then(() => {
          form.resetFields();
          closeModal({ questionIndex, data: exclude(dataValues) }, 'created');
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'success',
            msj: 'Pregunta creada',
            action: 'show',
          });
        });
      } catch (err) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: 'Problema creando la pregunta!',
          action: 'show',
        });
      }
    } else {
      SurveysApi.editQuestion(eventId, surveyId, questionIndex, exclude(dataValues))
        .then(() => {
          form.resetFields();
          closeModal({ questionIndex, data: exclude(dataValues) }, 'updated');
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'success',
            msj: 'Pregunta actualizada',
            action: 'show',
          });
        })
        .catch((err) => {
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'error',
            msj: 'No se pudo actualizar la pregunta',
            action: 'show',
          });
        });
    }
  };

  function handleRemoveImg() {
    setDefaultImgValue(null);
  }

  if (Object.entries(defaultValues).length !== 0) {
    return (
      <>
        {loading ? (
          <Spin />
        ) : (
          <Form
            {...layout}
            form={form}
            ref={ref}
            name='form-edit'
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={defaultValues}>
            {allowGradableSurvey === true ? (
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
                      ]}>
                      <Input />
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
                        ]}>
                        <Select placeholder='Seleccione una Opcion' onChange={handleFunction}>
                          {field.selectOptions.map((option, index) =>
                            option.text ? (
                              <Option key={`type${index}`} value={option.value}>
                                {option.text}
                              </Option>
                            ) : (
                              <Option key={`quantity${index}`} value={option}>
                                {option}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    )
                  )
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
                      ]}>
                      <Input />
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
                        ]}>
                        <Select placeholder='Seleccione una Opción' onChange={handleFunction}>
                          {field.selectOptions.map((option, index) =>
                            option.text ? (
                              <Option key={`type${index}`} value={option.value}>
                                {option.text}
                              </Option>
                            ) : (
                              <Option key={`quantity${index}`} value={option}>
                                {option}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    )
                  )
                )}
              </div>
            )}
            <div>
              <Form.Item key={`img`} name={'image'} label={'Imagen'}>
                <Space direction='vertical'>
                  <Upload
                    multiple={false}
                    accept='image/png, image/jpeg'
                    name='logo'
                    listType='picture'
                    maxCount={1}
                    /** Se envia el blob del upload para validar las dimensiones */
                    action={(file) => validatingImageDimensions(file)}
                    onChange={(file) => {
                      if (file.fileList.length > 0) {
                        setDefaultImgValue(file.fileList);
                        setWrongDimensions(false);
                      } else {
                        setWrongDimensions(false);
                        setDefaultImgValue(null);
                      }
                    }}
                    customRequest={dummyRequest}
                    fileList={defaultImgValue}
                    onRemove={handleRemoveImg}>
                    <Button icon={<UploadOutlined />}>Cargar imagen</Button>
                  </Upload>
                  {wrongDimensions && (
                    <Alert
                      showIcon
                      closable
                      className='animate__animated animate__bounceIn'
                      style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        borderLeft: '5px solid #FF4E50',
                        fontSize: '14px',
                        textAlign: 'start',
                        borderRadius: '5px',
                      }}
                      type='error'
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
                  <p>
                    <small>Tenga en cuenta que la dimensión de la imagen debe ser 500px*300px ó 600px*300px</small>
                  </p>
                </Space>
              </Form.Item>
            </div>

            <Form.List name={`choices`}>
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {questionType === 'radiogroup' ? (
                      <Radio.Group
                        onChange={handleRadio}
                        disabled={!allowGradableSurvey}
                        value={correctAnswerIndex}
                        style={{ display: 'block', marginRight: 0 }}>
                        {fields.map((field, index) => (
                          <Form.Item label={`Respuesta ${index + 1}`} required={false} key={field.key}>
                            <Radio value={index} style={{ width: '100%' }}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: `Por favor ingresa un valor a la respuesta ${index + 1}`,
                                  },
                                  {
                                    validator: fieldValidation,
                                  },
                                ]}
                                noStyle>
                                <Input placeholder='Texto de la Respuesta' style={{ width: '90%' }} />
                              </Form.Item>
                              {fields.length > 2 ? (
                                <MinusCircleOutlined
                                  className='dynamic-delete-button'
                                  style={{ margin: '0 8px' }}
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                              ) : null}
                            </Radio>
                          </Form.Item>
                        ))}
                      </Radio.Group>
                    ) : (
                      questionType === 'checkbox' && (
                        <Checkbox.Group
                          onChange={handleCheckbox}
                          disabled={!allowGradableSurvey}
                          value={correctAnswerIndex}
                          style={{ display: 'block', marginRight: 0 }}>
                          {fields.map((field, index) => (
                            <Form.Item label={`Respuesta ${index + 1}`} required={false} key={field.key}>
                              <Checkbox value={index} style={{ width: '100%' }}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: `Por favor ingresa un valor a la respuesta ${index + 1}`,
                                    },
                                    {
                                      validator: fieldValidation,
                                    },
                                  ]}
                                  noStyle>
                                  <Input placeholder='Texto de la Respuesta' style={{ width: '85%' }} />
                                </Form.Item>
                                {fields.length > 2 ? (
                                  <MinusCircleOutlined
                                    className='dynamic-delete-button'
                                    style={{ margin: '0 8px' }}
                                    onClick={() => {
                                      remove(field.name);
                                    }}
                                  />
                                ) : null}
                              </Checkbox>
                            </Form.Item>
                          ))}
                        </Checkbox.Group>
                      )
                    )}

                    {fields.length < 5 && (
                      <Form.Item>
                        <Button
                          type='dashed'
                          onClick={() => {
                            add();
                          }}>
                          <PlusOutlined /> Agregar Otra Respuesta
                        </Button>
                      </Form.Item>
                    )}
                  </div>
                );
              }}
            </Form.List>
          </Form>
        )}
      </>
    );
  } else {
    return null;
  }
};

export default forwardRef(FormEdit);
