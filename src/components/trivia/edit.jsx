import React, { Component, Fragment, useEffect, useState } from "react";

import EventContent from "../events/shared/content";

import { selectOptions } from "./constants";

import { SurveysApi, AgendaApi } from "../../helpers/request";

import { withRouter } from "react-router-dom";

import { toast } from "react-toastify";
import { Button, Row, Col, Table, Divider } from "antd";

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
      question: []
    };
    this.submit = this.submit.bind(this);
  }

  //Funcion para poder cambiar el value del input o select
  changeInput = e => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  async componentDidMount() {
    //Se consultan las api para traer en primera los datos de la encuesta para actualizar y en segunda los datos la agenda

    if (this.props.location.state) {
      const Update = await SurveysApi.getOne(this.props.event._id, this.props.location.state.edit);
      const dataAgenda = await AgendaApi.byEvent(this.props.event._id);

      console.log(Update);

      //Se envan al estado para poderlos utilizar en el markup
      this.setState({
        _id: Update._id,
        survey: Update.survey,
        publish: Update.publish,
        activity_id: Update.activity_id,
        dataAgenda: dataAgenda.data
      });

      this.getQuestions();
    } else {
      const dataAgenda = await AgendaApi.byEvent(this.props.event._id);
      this.setState({
        dataAgenda: dataAgenda.data
      });
    }
  }

  async getQuestions() {
    const Update = await SurveysApi.getOne(this.props.event._id, this.props.location.state.edit);

    const question = [];
    for (const prop in Update.questions) {
      selectOptions.forEach(option => {
        if (Update.questions[prop].type == option.value) Update.questions[prop].type = option.text;
      });

      question.push(Update.questions[prop]);
    }
    this.setState({ question });
  }

  //Funcion para guardar los datos a actualizar
  async submit() {
    if (this.props.location.state) {
      //Se recogen los datos a actualizar
      const data = {
        id: this.state._id,
        survey: this.state.survey,
        publish: this.state.publish,
        activity_id: this.state.activity_id
      };

      // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
      await SurveysApi.editOne(data, data.id, this.props.event._id);
      // Se da la información de datos actualizados y se redirige a la vista principal
      toast.success("datos actualizados");
      window.location.replace(this.props.matchUrl);
    } else {
      //Se recogen los datos a actualizar
      const data = {
        id: this.state._id,
        survey: this.state.survey,
        publish: "false",
        activity_id: this.state.activity_id
      };

      // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
      await SurveysApi.createOne(this.props.event._id, data);
      // Se da la información de datos actualizados y se redirige a la vista principal
      toast.success("datos creados");
      window.location.replace(this.props.matchUrl);
    }
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
    let { listQuestions, _id } = this.state;
    let uid = this.generateUUID();
    this.setState({
      listQuestions: [
        ...listQuestions,
        <FormQuestions
          key={uid}
          questionId={uid}
          eventId={this.props.event._id}
          surveyId={_id}
          removeQuestion={this.removeQuestion}
        />
      ]
    });
  };

  // Funcion para remover preguntas
  removeQuestion = item => {
    let { listQuestions } = this.state;
    let newArray = listQuestions.filter(question => question.key != item);
    this.setState({ listQuestions: newArray });
  };

  // Funciones para los servicios -----------------------------------

  // Borrar pregunta
  deleteQuestion = questionId => {
    console.log("Eliminando pregunta", questionId);
  };
  // Editar pregunta
  editQuestion = questionId => {
    console.log("Editando pregunta", questionId);
  };

  goBack = () => this.props.history.goBack();

  render() {
    const { survey, publish, activity_id, dataAgenda } = this.state;
    const columns = [
      {
        title: "Pregunta",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "Tipo de Pregunta",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "Acciones",
        key: "action",
        render: (text, record) => (
          <div>
            <Button onClick={() => this.deleteQuestion(record.id)} style={{ marginRight: 16, color: "red" }}>
              <span className="icon">
                <i className="fas fa-trash-alt" />
              </span>
            </Button>

            <Button onClick={() => this.editQuestion(record.id)}>
              <span className="icon">
                <i className="fas fa-edit" />
              </span>
            </Button>
          </div>
        )
      }
    ];
    return (
      <Fragment>
        <EventContent title="Encuestas" closeAction={this.goBack}>
          <div className="columns is-6">
            <div>
              <label style={{ marginTop: "15%" }} className="label">
                Nombre de la Encuesta
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
              <button onClick={this.submit} className="columns is-pulled-right button is-primary">
                Guardar
              </button>
            </div>
          </div>
          {this.props.location.state ? (
            <div>
              <label style={{ marginTop: "5%" }} className="label">
                activar la encuesta
              </label>
              <div className="select" style={{ marginBottom: "5%" }}>
                <select
                  name="publish"
                  value={publish}
                  onChange={this.changeInput}
                  onClick={e => {
                    this.setState({ publish: e.target.value });
                  }}>
                  <option>...Seleccionar</option>
                  <option value={true}>Si</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <br />
          <label className="label">Seleccione una actividad a referenciar</label>
          <div className="select">
            <select name="activity_id" value={activity_id} onChange={this.changeInput}>
              <option>...Selecciona</option>
              {dataAgenda.map((activity, key) => (
                <option key={key} value={activity._id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>
          {this.props.location.state ? (
            <div>
              <Row>
                <Col span={5} style={{ marginTop: "3%" }}>
                  <Button block size="large" onClick={this.addNewQuestion}>
                    Agregar Pregunta
                  </Button>
                </Col>
              </Row>
              {this.state.listQuestions.map(formQuestion => (
                <div key={formQuestion.key}>
                  <Divider orientation="left">Pregunta</Divider>
                  <Row>
                    <Col>
                      <Button span={6} offset={6} onClick={() => this.removeQuestion(formQuestion.key)}>
                        Cancelar
                      </Button>
                    </Col>
                  </Row>
                  {formQuestion}
                </div>
              ))}
              <Table style={{ marginTop: "5%" }} dataSource={this.state.question} columns={columns} />
            </div>
          ) : (
            <div></div>
          )}
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(triviaEdit);
