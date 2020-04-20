import React, { Component, Fragment, useEffect, useState } from "react";

import EventContent from "../events/shared/content";

import { selectOptions } from "./constants";

import { SurveysApi, AgendaApi } from "../../helpers/request";

import { withRouter } from "react-router-dom";

import { toast } from "react-toastify";
import { Button, Row, Col, Table, Divider, Modal, Form, Input } from "antd";

import FormQuestions from "./questions";
import FormQuestionEdit from "./formEdit";

class triviaEdit extends Component {
  constructor(props) {
    super(props);
    this.formEditRef = React.createRef();
    this.state = {
      loading: false,
      redirect: false,
      survey: "",
      publish: "",
      activity_id: "",
      dataAgenda: [],
      quantityQuestions: 0,
      listQuestions: [],
      question: [],
      visibleModal: false,
      confirmLoading: false,
      currentQuestion: [], // Variable que se usa para obtener datos de una pregunta y editarla en el modal
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
        dataAgenda: dataAgenda.data,
      });

      this.getQuestions();
    } else {
      const dataAgenda = await AgendaApi.byEvent(this.props.event._id);
      this.setState({
        dataAgenda: dataAgenda.data,
      });
    }
  }

  async getQuestions() {
    const Update = await SurveysApi.getOne(this.props.event._id, this.props.location.state.edit);

    const question = [];
    for (const prop in Update.questions) {
      selectOptions.forEach((option) => {
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
        publish: this.state.publish === "true" ? "true" : "false",
        activity_id: this.state.activity_id,
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
        activity_id: this.state.activity_id,
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

  // Funcion para agregar el formulario de las preguntas
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
        />,
      ],
    });
  };

  // Funcion para remover el formulario de las preguntas
  removeQuestion = (item, newQuestion) => {
    let { listQuestions, question } = this.state;
    let newArray = listQuestions.filter((question) => question.key != item);

    // Este condicional sirve para actualizar el estado local
    // Solo se invoca al crear una nueva pregunta y despues se agrega la pregunta creada a la tabla
    if (newQuestion) {
      // Se iteran las opciones y se asigna el texto para el tipo de pregunta
      selectOptions.forEach((option) => {
        if (newQuestion.type == option.value) newQuestion.type = option.text;
      });

      question = [...question, newQuestion];
      this.setState({ question });
    }
    this.setState({ listQuestions: newArray });
  };

  // -------------------- Funciones para los servicios -----------------------------------

  // Borrar pregunta
  deleteQuestion = async (questionId) => {
    let { question, _id } = this.state;
    const { event } = this.props;

    let questionIndex = question.findIndex((question) => question.id == questionId);

    SurveysApi.deleteQuestion(event._id, _id, questionIndex).then((response) => {
      // Se actualiza el estado local, borrando la pregunta de la tabla
      let newListQuestion = question.filter((infoQuestion) => infoQuestion.id != questionId);

      this.setState({ question: newListQuestion });
      toast.success(response);
    });
  };

  // Editar pregunta
  editQuestion = (questionId) => {
    let { question, currentQuestion } = this.state;
    let questionIndex = question.findIndex((question) => question.id == questionId);

    currentQuestion = question.filter((infoQuestion) => infoQuestion.id == questionId);
    currentQuestion[0]["questionIndex"] = questionIndex;
    currentQuestion[0]["questionOptions"] = currentQuestion[0].choices.length;

    this.setState({ visibleModal: true, currentQuestion });
  };

  sendForm = () => {
    this.setState({ confirmLoading: true });
    if (this.formEditRef.current) {
      this.formEditRef.current.submit();
    }
  };
  closeModal = (info) => {
    let { question } = this.state;

    // Condicional que actualiza el estado local
    // Con esto se ve reflejado el cambio en la tabla
    if (Object.entries(info).length === 2) {
      let { questionIndex, data } = info;
      let updateQuestion = question;
      this.setState({ question: [] });

      // Se iteran las opciones y se asigna el texto para el tipo de pregunta
      selectOptions.forEach((option) => {
        if (data.type == option.value) data.type = option.text;
      });

      updateQuestion.splice(questionIndex, 1, data);
      this.setState({ question: updateQuestion });
    }
    this.setState({ visibleModal: false, currentQuestion: [], confirmLoading: false });
  };
  // ---------------------------------------------------------------------------------------

  goBack = () => this.props.history.goBack();

  render() {
    const {
      survey,
      publish,
      activity_id,
      dataAgenda,
      question,
      visibleModal,
      confirmLoading,
      currentQuestion,
    } = this.state;
    const columns = [
      {
        title: "Pregunta",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Tipo de Pregunta",
        dataIndex: "type",
        key: "type",
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
        ),
      },
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
              <label style={{ marginTop: "3%" }} className="label">
                activar la encuesta
              </label>
              <div className="select" style={{ marginBottom: "1%" }}>
                <select
                  name="publish"
                  value={publish}
                  onChange={this.changeInput}
                  onClick={(e) => {
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
          <label style={{ marginTop: "2%" }} className="label">
            Seleccione una actividad a referenciar
          </label>
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
              {this.state.listQuestions.map((formQuestion) => (
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
              <Table style={{ marginTop: "5%" }} dataSource={question} columns={columns} />
              <Modal
                width={700}
                title="Editando Pregunta"
                visible={visibleModal}
                onOk={this.sendForm}
                onCancel={this.closeModal}
                footer={[
                  <Button key="back" onClick={this.closeModal}>
                    Cancelar
                  </Button>,
                  <Button key="submit" type="primary" loading={confirmLoading} onClick={this.sendForm}>
                    Guardar
                  </Button>,
                ]}>
                {currentQuestion.map((question) => (
                  <FormQuestionEdit
                    ref={this.formEditRef}
                    valuesQuestion={question}
                    eventId={this.props.event._id}
                    surveyId={this.state._id}
                    closeModal={this.closeModal}
                  />
                ))}
              </Modal>
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
