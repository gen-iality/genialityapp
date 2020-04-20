import React, { Component, useState, useEffect, forwardRef } from "react";

import { fieldsFormQuestion } from "./constants";

import { SurveysApi } from "../../helpers/request";

import { Form, Input, InputNumber, Button, Select, Spin } from "antd";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not validate email!",
    number: "${label} is not a validate number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const formEdit = ({ valuesQuestion, eventId, surveyId, closeModal }, ref) => {
  const [defaultValues, setDefaultValues] = useState({});
  const [questionId, setQuestionId] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const [form] = Form.useForm();

  useEffect(() => {
    valuesQuestion.choices.forEach((option, index, arr) => {
      valuesQuestion = { ...valuesQuestion, [`choices[${index}]`]: option };
    });

    setDefaultValues(valuesQuestion);
    setQuestionId(valuesQuestion.id);
    setQuestionIndex(valuesQuestion.questionIndex);
  }, [valuesQuestion]);

  const onFinish = (values) => {
    console.log(values);
    values["choices"] = [];
    values["id"] = questionId;

    for (const key in values) {
      if (key.indexOf("choices[") == 0) {
        values.choices.push(values[key]);
        delete values[key];
      }
    }

    const exclude = ({ questionOptions, ...rest }) => rest;

    SurveysApi.editQuestion(eventId, surveyId, questionIndex, exclude(values)).then((result) => {
      console.log(("result": result));
      form.resetFields();
      closeModal();
    });
  };

  const onSelectChange = (values) => {
    console.log(values);
  };

  if (Object.entries(defaultValues).length !== 0)
    return (
      <Form
        {...layout}
        form={form}
        ref={ref}
        name="form-edit"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={defaultValues}>
        {fieldsFormQuestion.map((field, key) =>
          field.type ? (
            <Form.Item
              key={`field${key}${field.name}`}
              name={field.name}
              label={field.label}
              rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : (
            <Form.Item key={`field${key}`} name={field.name} label={field.label} rules={[{ required: true }]}>
              <Select
                placeholder="Seleccione una Opcion"
                disabled={field.name == "questionOptions"}
                onChange={onSelectChange}>
                {field.selectOptions.map((option, index) =>
                  option.text ? (
                    <Option key={`type${index}`} value={option.value}>
                      {option.text}
                    </Option>
                  ) : (
                    <Option key={`type${index}`} value={option}>
                      {option}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          )
        )}
        {defaultValues.choices.map((option, index) => (
          <Form.Item
            key={`option${index}`}
            name={`choices[${index}]`}
            label={`Respuesta ${index + 1}`}
            rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        ))}
      </Form>
    );

  return <Spin></Spin>;
};

export default forwardRef(formEdit);
