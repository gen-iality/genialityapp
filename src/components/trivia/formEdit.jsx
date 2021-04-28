import React, { useState, useEffect, forwardRef } from 'react';
import { fieldsFormQuestion, fieldsFormQuestionWithPoints, selectOptions, searchWithMultipleIndex } from './constants';
import { SurveysApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import { Form, Input, Button, Select, Spin, Radio, Checkbox, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import ImageInput from '../shared/imageInput';

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

const FormEdit = ({ valuesQuestion, eventId, surveyId, closeModal, toggleConfirmLoading, gradableSurvey }, ref) => {
  const [defaultValues, setDefaultValues] = useState({});
  const [questionId, setQuestionId] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allowGradableSurvey, setAllowGradableSurvey] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [questionType, setQuestionType] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesQuestion]);

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
    const exclude = ({ questionOptions, ...rest }) => rest;

    if (questionIndex === undefined) {
      return SurveysApi.createQuestion(eventId, surveyId, exclude(values)).then(() => {
        form.resetFields();
        closeModal({ questionIndex, data: exclude(values) }, 'created');
        toast.success('Pregunta creada');
      });
    }

    SurveysApi.editQuestion(eventId, surveyId, questionIndex, exclude(values))
      .then(() => {
        form.resetFields();
        closeModal({ questionIndex, data: exclude(values) }, 'updated');
        toast.success('pregunta actualizada');
      })
      .catch((err) => toast.error('No se pudo actualizar la pregunta: ', err));
  };

  const inputTextRules = [
    { required: true },
    {
      validator: fieldValidation,
    },
  ];

  function inputByType(field, key, rules, options = {}) {
    console.log('field', field);
    switch (field.type) {
      case 'text':
        return (
          <Form.Item
            key={`field${key}${field.name}`}
            name={field.name}
            label={field.label}
            rules={rules ? inputTextRules : []}>
            <Input />
          </Form.Item>
        );
      case 'image':
        return (
          <Form.Item
            key={`field${key}${field.name}`}
            name={field.name}
            label={field.label}
            valuePropName='image'
            //getValueFromEvent={normFile}
            //extra='longgggggggggggggggggggggggggggggggggg'
          >
            <Upload name='logo' action='/upload.do' listType='picture'>
              <Button icon={<UploadOutlined />}>Cargar imagen</Button>
            </Upload>
          </Form.Item>
          // <Form.Item key={`field${key}${field.name}`} name={field.name} label={field.label}>
          //   <ImageInput picture={options.picture} />
          // </Form.Item>
        );
    }
  }

  if (Object.entries(defaultValues).length !== 0)
    return (
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
        )}

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
                          <Checkbox value={index} style={{ display: 'block', width: '100%' }}>
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
                <div>
                  {/* <Form.Item
                    key={`img`}
                    name={'image'}
                    label={'Imagen'}
                    //getValueFromEvent={normFile}
                    //extra='longgggggggggggggggggggggggggggggggggg'
                  >
                    <Upload
                      itemRender={(item) => {
                        return <img src={item} />;
                      }}
                      accept='image/png, image/jpeg'
                      name='logo'
                      action='/upload.do'
                      listType='picture'
                      fileList={[
                        {
                          uid: '-1',
                          name: 'xxx.png',
                          status: 'done',
                          url: 'https://es.wikipedia.org/wiki/Bogot%C3%A1#/media/Archivo:Bogot%C3%A1Skyline.jpg',
                        },
                      ]}>
                      <Button icon={<UploadOutlined />}>Cargar imagen</Button>
                    </Upload>
                  </Form.Item> */}
                  <Upload
                    multiple={false}
                    accept='image/png, image/jpeg'
                    name='logo'
                    action='/upload.do'
                    listType='picture'
                    //previewFile={'https://es.wikipedia.org/wiki/Bogot%C3%A1#/media/Archivo:Bogot%C3%A1Skyline.jpg'}
                    defaultFileList={[
                      {
                        uid: '-1',
                        name: 'xxx',
                        status: 'done',
                        type: 'image/jpg',
                        thumbUrl:
                          'https://storage.googleapis.com/eviusauth.appspot.com/evius/events/A4c8xSIWiENsX6AgUdY968u528MUqkmOsWkNALC6.jpeg',
                        url:
                          'https://storage.googleapis.com/eviusauth.appspot.com/evius/events/A4c8xSIWiENsX6AgUdY968u528MUqkmOsWkNALC6.jpeg',
                      },
                    ]}>
                    <Button icon={<UploadOutlined />}>Cargar imagen</Button>
                  </Upload>
                </div>

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
        {/* <Form.List>
          <Select>
            {
              operationType.map((item, index) => {
                return <Option key={`operation${index}`} value={item.value}>{item.text}</Option>
              }
              )
            }

          </Select>
        </Form.List> */}
      </Form>
    );

  return <Spin></Spin>;
};

export default forwardRef(FormEdit);
