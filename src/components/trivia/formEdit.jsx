import React, { Component, useState, useEffect, forwardRef } from "react";

import { fieldsFormQuestion, selectOptions } from "./constants";

import { SurveysApi } from "../../helpers/request";

import { toast } from "react-toastify";
import { Form, Input, InputNumber, Button, Select, Spin, Radio } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

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

const formEdit = ({ valuesQuestion, eventId, surveyId, closeModal, toggleConfirmLoading }, ref) => {
  const [defaultValues, setDefaultValues] = useState({});
  const [questionId, setQuestionId] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [value, setValue] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    console.log("valuesQuestion:", valuesQuestion);

    setDefaultValues(valuesQuestion);
    setQuestionId(valuesQuestion.id);
    setQuestionIndex(valuesQuestion.questionIndex);
  }, [valuesQuestion]);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const fieldValidation = (rule, value) => {
    if (!value) {
      toggleConfirmLoading();
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  };

  const onFinish = (values) => {
    console.log(values);
    values["id"] = questionId;

    if (values.type.indexOf(" ") > 0) {
      selectOptions.forEach((option) => {
        if (values.type == option.text) values.type = option.value;
      });
    }

    const exclude = ({ questionOptions, ...rest }) => rest;

    if (questionIndex === undefined) {
      return SurveysApi.createQuestion(eventId, surveyId, exclude(values)).then((response) => {
        form.resetFields();
        closeModal({ questionIndex, data: exclude(values) }, "created");
        toast.success("Pregunta creada");
      });
    }

    SurveysApi.editQuestion(eventId, surveyId, questionIndex, exclude(values))
      .then(() => {
        form.resetFields();
        closeModal({ questionIndex, data: exclude(values) }, "updated");
        toast.success("pregunta actualizada");
      })
      .catch((err) => toast.error("No se pudo actualizar la pregunta: ", err));
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
              rules={[
                { required: true },
                {
                  validator: fieldValidation,
                },
              ]}>
              <Input />
            </Form.Item>
          ) : (
            field.name != "questionOptions" && (
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
                <Select placeholder="Seleccione una Opcion">
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

        <Form.List name={`choices`}>
          {(fields, { add, remove }) => {
            return (
              <div>
                <Radio.Group
                  onChange={onChange}
                  disabled={true}
                  value={value}
                  style={{ display: "block", marginRight: 0 }}>
                  {fields.map((field, index) => (
                    <Form.Item label={`Respuesta ${index + 1}`} required={false} key={field.key}>
                      <Radio value={index} style={{ width: "100%" }}>
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
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
                          <Input placeholder="Texto de la Respuesta" style={{ width: "90%" }} />
                        </Form.Item>
                        {fields.length > 2 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ margin: "0 8px" }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        ) : null}
                      </Radio>
                    </Form.Item>
                  ))}
                </Radio.Group>
                {fields.length < 5 && (
                  <Form.Item>
                    <Button
                      type="dashed"
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
    );

  return <Spin></Spin>;
};

export default forwardRef(formEdit);
