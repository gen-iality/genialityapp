import React, { Component, Fragment } from "react";

import EventContent from "../events/shared/content";

import { SurveysApi, Actions } from "../../helpers/request";
import { AntSelect, AntInput } from "./antField";
import DisplayForm from "./displayForm";
import showSelectOptions from "./constants";

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
      quantityQuestions: 0,
    };
  }

  componentDidMount() {}

  validationField = (values) => {
    console.log("realizando validaciones:", values);

    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  sendData = async (values) => {
    const { eventId, surveyId, questionId, removeQuestion } = this.props;
    this.setState({ isSubmitting: true });

    console.log("SENDING DATA:", values);

    // Funcion que excluye las propiedades de un objeto
    // para no enviarlas a la base de datos
    const exclude = ({
      selectOptions,
      quantityOptions,
      questionOptions,
      ...rest
    }) => rest;

    // Ejecuta el servicio
    SurveysApi.createQuestion(eventId, surveyId, exclude(values)).then(() => {
      removeQuestion(questionId);
    });
  };

  render() {
    const { isSubmitting } = this.state;

    return (
      <Fragment>
        <EventContent>
          <div>
            <Formik
              initialValues={{
                name: "",
                title: "",
                page: "",
                selectOptions: showSelectOptions,
                quantityOptions: [1, 2, 3, 4],
              }}
              onSubmit={this.sendData}
              render={DisplayForm}
            ></Formik>
          </div>
        </EventContent>
      </Fragment>
    );
  }
}

export default FormQuestions;
