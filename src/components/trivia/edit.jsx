import React, { Component, Fragment, useEffect, useState } from "react";

import EventContent from "../events/shared/content";

import { SurveysApi, AgendaApi } from "../../helpers/request";

import { withRouter } from "react-router-dom";

import { toast } from "react-toastify";
import { Button, Row, Col } from "antd";

import FormQuestions from "./questions";

class triviaEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      redirect: false,
      survey: "",
      publish: "",
      activity_id: "",
      dataAgenda: [],
      quantityQuestions: 0,
      listQuestions: [],
    };
    this.submit = this.submit.bind(this);
  }

  //Funcion para poder cambiar el value del input o select
  changeInput = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  async componentDidMount() {
    //Se consultan las api para traer en primera los datos de la encuesta para actualizar y en segunda los datos la agenda
    const Update = await SurveysApi.getOne(
      this.props.event._id,
      this.props.location.state.edit
    );
    const dataAgenda = await AgendaApi.byEvent(this.props.event._id);

    //Se envan al estado para poderlos utilizar en el markup
    this.setState({
      _id: Update._id,
      survey: Update.survey,
      publish: Update.publish,
      activity_id: Update.activity_id,
      dataAgenda: dataAgenda.data,
    });
  }

  //Funcion para guardar los datos a actualizar
  async submit() {
    //Se recogen los datos a actualizar
    const data = {
      id: this.state._id,
      survey: this.state.survey,
      publish: this.state.publish,
      activity_id: this.state.activity_id,
    };

    // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
    await SurveysApi.editOne(data, data.id, this.props.event._id);
    // Se da la información de datos actualizados y se redirige a la vista principal
    toast.success("datos actualizados");
    window.location.replace(this.props.matchUrl);
  }

  // Funcion para generar un id a cada pregunta 'esto es temporal'
  generateUUID = () => {
    let d = new Date().getTime();
    let uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  // Funcion para agregar preguntas
  addNewQuestion = () => {
    let { listQuestions } = this.state;
    let uid = this.generateUUID();
    this.setState({
      listQuestions: [...listQuestions, <FormQuestions key={uid} />],
    });
  };

  // Funcion para remover preguntas
  removeQuestion = (item) => {
    let { listQuestions } = this.state;
    let newArray = listQuestions.filter((question) => question.key != item);
    this.setState({ listQuestions: newArray });
  };

  render() {
    const { survey, publish, activity_id, dataAgenda } = this.state;

    return (
      <Fragment>
        <EventContent title="Trivias" closeAction={this.goBack}>
          <div className="columns is-6">
            <div>
              <label style={{ marginTop: "15%" }} className="label">
                Nombre de la trivia
              </label>
              <input
                value={survey}
                className="input"
                placeholder="Nombre de la encuesta"
                name={"survey"}
                onChange={this.changeInput}
              />
            </div>
            <div className="column">
              <button
                onClick={this.submit}
                className="columns is-pulled-right button is-primary"
              >
                Guardar
              </button>
            </div>
          </div>
          <label style={{ marginTop: "5%" }} className="label">
            activar la encuesta
          </label>
          <div className="select" style={{ marginBottom: "5%" }}>
            <select
              name="publish"
              value={publish}
              onChange={this.changeInput}
              onClick={(e) => {
                this.setState({ publish: e.target.value });
              }}
            >
              <option>...Seleccionar</option>
              <option value={true}>Si</option>
              <option value={false}>No</option>
            </select>
          </div>

          <br />
          <div className="select">
            <label className="Seleccione una actividad a referenciar"></label>
            <select
              name="activity_id"
              value={activity_id}
              onChange={this.changeInput}
            >
              <option>...Selecciona</option>
              {dataAgenda.map((activity, key) => (
                <option key={key} value={activity._id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>

          <Row>
            <Col span={12} offset={6}>
              <Button block size="large" onClick={this.addNewQuestion}>
                Agregar Pregunta
              </Button>
            </Col>
          </Row>
          {this.state.listQuestions.map((formQuestion) => (
            <div key={formQuestion.key}>
              <button onClick={() => this.removeQuestion(formQuestion.key)}>
                Eliminar
              </button>
              {formQuestion}
            </div>
          ))}
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(triviaEdit);
