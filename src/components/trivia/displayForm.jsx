import React, { Component, Fragment } from "react";

import { AntSelect, AntInput } from "./antField";

import EventContent from "../events/shared/content";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Input, Select, Row, Col } from "antd";

import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

// Componente que renderiza una cantidad de veces
// dependiendo de la cantidad de opciones escogidas

class RenderQuantityField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
    };
  }

  // Funcion para cargar los datos
  loadData = async (prevProps) => {
    const { quantity } = this.props;
    if (!prevProps || quantity !== prevProps.quantity)
      await this.setState({ quantity });
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    this.loadData(prevProps);
  }

  render() {
    let { quantity } = this.state;
    let listOptions = [];

    if (quantity > 0)
      for (let i = 0; i < quantity; i++) {
        let label = `Opción ${i + 1}`;
        let name = `opcion_${i + 1}`;

        listOptions.push(
          <Field
            key={name}
            label={label}
            component={AntInput}
            hasFeedback
            type="text"
            name={`choices[${i}]`}
          />
        );
      }

    return listOptions;
  }
}

// Campos del formulario a mostrar
export default ({ handleSubmit, values, submitCount }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      label="Nombre"
      defaultValue={values.name}
      component={AntInput}
      hasFeedback
      type="text"
      name="name"
    />

    <Field
      label="Titulo"
      defaultValue={values.title}
      component={AntInput}
      hasFeedback
      type="text"
      name="title"
    />

    <Field
      label="Pagina"
      defaultValue={values.page}
      component={AntInput}
      hasFeedback
      type="number"
      name="page"
    />

    <Field
      label="Tipo de Pregunta"
      defaultValue={values.type}
      component={AntSelect}
      hasFeedback
      name="type"
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

    {/* Componente para renderizar la cantidad de opciones escogidas */}
    {values.questionOptions > 0 && (
      <RenderQuantityField quantity={values.questionOptions} />
    )}

    <Row>
      <Col span={6} offset={9}>
        <button type="submit">Enviar</button>
      </Col>
    </Row>
  </Form>
);
