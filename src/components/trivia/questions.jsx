import React, { Component, Fragment } from "react";

import EventContent from "../events/shared/content";

import { SurveysApi, Actions } from "../../helpers/request";

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

  sendData = (values) => {
    this.setState({ isSubmitting: true });
    console.log("enviando datoooooos:", values);
  };

  render() {
    const { isSubmitting } = this.state;

    return (
      <Fragment>
        <EventContent>
          <div>
            <Formik
              initialValues={{
                questionName: "",
                questionTitle: "",
                page: "",
                questionType: "",
              }}
              validate={this.validationField}
              onSubmit={this.sendData}
            >
              <Form>
                <Field label="Nombre" component={Input} name="questionName" />
                <ErrorMessage name="questionName" component="div" />

                <Field label="Titulo" component={Input} name="questionTitle" />
                <ErrorMessage name="questionTitle" component="div" />

                <Field
                  label="Pagina"
                  component={Input}
                  type="number"
                  name="page"
                />
                <ErrorMessage name="page" component="div" />

                <Field
                  label="Tipo de Pregunta"
                  component={Select}
                  name="questionType"
                >
                  <Option key="multiple" value="multiple">
                    Multiple
                  </Option>
                  <Option key="only" value="only">
                    Unica
                  </Option>
                </Field>

                <ErrorMessage name="questionType" component="div" />

                <Row>
                  <Col span={6} offset={9}>
                    <Button type="submit" disabled={isSubmitting}>
                      Enviar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Formik>
          </div>
        </EventContent>
      </Fragment>
    );
  }
}

export default FormQuestions;
