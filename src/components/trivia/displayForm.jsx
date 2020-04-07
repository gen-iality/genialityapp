import React, { Component, Fragment } from "react";

import { AntSelect, AntInput } from "./antField";

import EventContent from "../events/shared/content";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Input, Select, Row, Col } from "antd";

import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

export default ({ handleSubmit, values, submitCount }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      label="Nombre"
      defaultValue={values.questionName}
      component={AntInput}
      hasFeedback
      type="text"
      name="questionName"
    />
    <ErrorMessage name="questionName" component="div" />

    <Field
      label="Titulo"
      defaultValue={values.questionTitle}
      component={AntInput}
      hasFeedback
      type="text"
      name="questionTitle"
    />
    <ErrorMessage name="questionTitle" component="div" />

    <Field
      label="Pagina"
      defaultValue={values.page}
      component={AntInput}
      hasFeedback
      type="number"
      name="page"
    />
    <ErrorMessage name="page" component="div" />

    <Field
      label="Tipo de Pregunta"
      defaultValue={values.questionType}
      component={AntSelect}
      hasFeedback
      name="questionType"
      selectOptions={values.selectOptions}
    />

    <Field
      label="Opciones"
      defaultValue={values.questionOptions}
      component={AntSelect}
      hasFeedback
      name="questionOptions"
      selectOptions={values.quantityOptions}
    />

    <ErrorMessage name="questionType" component="div" />

    <Row>
      <Col span={6} offset={9}>
        <button type="submit">Enviar</button>
      </Col>
    </Row>
  </Form>
);
