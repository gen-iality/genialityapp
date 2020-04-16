import React, { Component, Fragment } from "react";

import EventContent from "../events/shared/content";

import { SurveysApi, Actions } from "../../helpers/request";
import { AntSelect, AntInput } from "./antField";
import DisplayForm from "./displayForm";
import { initValues } from "./constants";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Input, Select, Row, Col } from "antd";

import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

const { Option } = Select;

class FormQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      quantityQuestions: 0
    };
  }

  componentDidMount() {}

  sendData = async values => {
    const { eventId, surveyId, questionId, removeQuestion } = this.props;
    this.setState({ isSubmitting: true });

    values.id = questionId;

    console.log("SENDING DATA:", values);

    // Funcion que excluye las propiedades de un objeto
    // para no enviarlas a la base de datos
    const exclude = ({ selectOptions, quantityOptions, questionOptions, ...rest }) => rest;

    // Ejecuta el servicio
    SurveysApi.createQuestion(eventId, surveyId, exclude(values)).then(response => {
      removeQuestion(questionId, response);
      toast.success("Pregunta creada");
    });
  };

  render() {
    const { isSubmitting } = this.state;

    return (
      <Fragment>
        <EventContent>
          <div>
            <Formik initialValues={initValues()} onSubmit={this.sendData} render={DisplayForm}></Formik>
          </div>
        </EventContent>
      </Fragment>
    );
  }
}

export default FormQuestions;
