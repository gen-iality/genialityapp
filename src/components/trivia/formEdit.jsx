import React, { useState, useEffect, forwardRef } from 'react';
import { fieldsFormQuestion, fieldsFormQuestionWithPoints, selectOptions, searchWithMultipleIndex } from './constants';
import { SurveysApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import { Form, Input, Button, Select, Spin, Radio, Checkbox, Upload, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Actions } from '../../helpers/request';

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

  const [form] = Form.useForm();

  useEffect(() => {
    if (valuesQuestion.image && valuesQuestion.image !== null) {
      setDefaultImgValue(valuesQuestion.image);
    } else {
      setDefaultImgValue(null);
    }

    return () => {
      setDefaultImgValue(null);
      unmountForm();
    };
  }, []);

  async function saveEventImage(file) {
    const url = '/api/files/upload';
    const data = new FormData();
    data.append('file', file);
    let response = null;
    response = await Actions.post(url, data)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        response = null;
        console.error(err);
      });

    setDefaultImgValue([
      {
        uid: 'img-' + questionId,
        //name: 'xxx',
        status: 'done',
        //type: 'image/png',
        thumbUrl: response,
        url: response,
      },
    ]);
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

  const onFinish = (values) => {
    values['id'] = questionId;

    delete values.image;
    if (defaultImgValue != null) {
      values.image = defaultImgValue;
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
    const pointsValue = values.points ? values.points :'1'
    const dataValues = {...values, points: pointsValue}
    const exclude = ({ questionOptions, ...rest }) => rest;
    if (questionIndex === undefined) {
      return SurveysApi.createQuestion(eventId, surveyId, exclude(dataValues)).then(() => {
        form.resetFields();
        closeModal({ questionIndex, data: exclude(dataValues) }, 'created');
        message.success({ content: 'Pregunta creada', key: 'updating' });
      });
    }

    SurveysApi.editQuestion(eventId, surveyId, questionIndex, exclude(dataValues))
      .then(() => {
        form.resetFields();
        closeModal({ questionIndex, data: exclude(dataValues) }, 'updated');
        message.success({ content: 'pregunta actualizada', key: 'updating' });
      })
      .catch((err) => toast.error('No se pudo actualizar la pregunta: ', err));
  };

  function handleRemoveImg() {
    setDefaultImgValue(null);
  }

  if (Object.entries(defaultValues).length !== 0)
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
            {/* <div>
              <Form.Item key={`img`} name={'image'} label={'Imagen'}>
                <Upload
                  multiple={false}
                  accept='image/png, image/jpeg'
                  name='logo'
                  listType='picture'
                  maxCount={1}
                  defaultFileList={defaultImgValue}
                  action={(file) => saveEventImage(file)}
                  onRemove={handleRemoveImg}>
                  <Button icon={<UploadOutlined />}>Cargar imagen</Button>
                </Upload>
              </Form.Item>
            </div> */}

            <Form.List name={`choices`}>
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {questionType === 'radiogroup' ? (
                      <Radio.Group
                        onChange={handleRadio}
                        /* disabled={!allowGradableSurvey} */
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
                          /* disabled={!allowGradableSurvey} */
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
};

export default forwardRef(FormEdit);
