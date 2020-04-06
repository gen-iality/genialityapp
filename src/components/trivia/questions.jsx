import React, { Component, Fragment } from "react";

import EventContent from "../events/shared/content";

import { SurveysApi, Actions } from "../../helpers/request";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

class FormQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      quantityQuestions: 0
    };
  }

  componentDidMount() {}

  validationField = values => {
    console.log("realizando validaciones:", values);

    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  sendData = values => {
    this.setState({ isSubmitting: true });
    console.log("enviando datoooooos:", values);
  };

  render() {
    const { isSubmitting } = this.state;
    console.log(this.state);
    return (
      <Fragment>
        <EventContent>
          <div>
            <Formik
              initialValues={{ questionEmail: "", questionType: "" }}
              validate={this.validationField}
              onSubmit={this.sendData}
            >
              <Form>
                <Field type="text" name="questionEmail" />
                <ErrorMessage name="questionEmail" component="div" />

                <Field as="select" name="questionType">
                  <option value="multiple">Seleccion Multiple</option>
                  <option value="only">Seleccion Unica</option>
                </Field>
                <ErrorMessage name="questionType" component="div" />

                <button type="submit" disabled={isSubmitting}>
                  Enviar
                </button>
              </Form>
            </Formik>
          </div>
        </EventContent>
      </Fragment>
    );
  }
}

export default FormQuestions;
