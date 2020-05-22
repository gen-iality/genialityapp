import React, { Component, Fragment, useEffect, useState } from "react";

import EventContent from "../events/shared/content";

import { selectOptions } from "./constants";

import { SurveysApi, AgendaApi } from "../../helpers/request";
import { createOrUpdateSurvey } from "./services";

import { withRouter } from "react-router-dom";

import { toast } from "react-toastify";
import { Button, Row, Col, Table, Divider, Modal, Form, Input, Switch, message } from "antd";
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
      allow_anonymous_answers: "",
      openSurvey: false,
      allow_gradable_survey: false,
      activity_id: "",
      dataAgenda: [],
      quantityQuestions: 0,
      listQuestions: [],
      question: [],
      visibleModal: false,
      confirmLoading: false,
      key: Date.now(),
      currentQuestion: [], // Variable que se usa para obtener datos de una pregunta y editarla en el modal
    };
    this.submit = this.submit.bind(this);
    this.submitWithQuestions = this.submitWithQuestions.bind(this);
  }

  //Funcion para poder cambiar el value del input o select
  changeInput = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  async componentDidMount() {
    //Se consultan las api para traer en primera los datos de la encuesta para actualizar y en segunda los datos la agenda
    console.log(this.props);
    if (this.props.location.state) {
      const Update = await SurveysApi.getOne(this.props.event._id, this.props.location.state.edit);
      const dataAgenda = await AgendaApi.byEvent(this.props.event._id);

      console.log(Update);

      //Se envan al estado para poderlos utilizar en el markup
      this.setState({
        idSurvey: Update._id,
        _id: Update._id,
        survey: Update.survey,
        publish: Update.publish,
        openSurvey: Update.open || "false",
        allow_gradable_survey: Update.allow_gradable_survey || "false",
        allow_anonymous_answers: Update.allow_anonymous_answers,
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
    //Se recogen los datos a actualizar
    const data = {
      survey: this.state.survey,
      publish: "false",
      open: "false",
      allow_anonymous_answers: "false",
      event_id: this.props.event._id,
      activity_id: this.state.activity_id,
    };
    console.log(data);
    // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
    const save = await SurveysApi.createOne(this.props.event._id, data);
    console.log(save);
    const idSurvey = save._id;

    // Esto permite almacenar los estados en firebase
    let setDataInFire = await createOrUpdateSurvey(
      idSurvey,
      { isPublished: data.publish, isOpened: false },
      { eventId: this.props.event._id, name: save.survey, category: "none" }
    );
    console.log("Fire:", setDataInFire);

    await this.setState({ idSurvey });
    console.log(this.state.idSurvey);
  }

  async submitWithQuestions() {
    message.loading({ content: "Actualizando información", key: "updating" });
    //Se recogen los datos a actualizar
    const data = {
      survey: this.state.survey,
      publish: this.state.publish === "true" ? "true" : "false",
      allow_anonymous_answers: this.state.allow_anonymous_answers === "true" ? "true" : "false",
      open: this.state.openSurvey,
      allow_gradable_survey: this.state.allow_gradable_survey,
      activity_id: this.state.activity_id,
    };
    console.log(data);

    // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
    SurveysApi.editOne(data, this.state.idSurvey, this.props.event._id)
      .then(async () => {
        // Esto permite almacenar los estados en firebase
        let setDataInFire = await createOrUpdateSurvey(
          this.state.idSurvey,
          { isPublished: data.publish, isOpened: data.open, allow_anonymous_answers: data.allow_anonymous_answers },
          { eventId: this.props.event._id, name: data.survey, category: "none" }
        );

        console.log("Fire:", setDataInFire);
        message.success({ content: "Datos actualizados", key: "updating" });
      })
      .catch((err) => {
        console.log("Hubo un error", err);
      });
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
    let { listQuestions, idSurvey } = this.state;
    let uid = this.generateUUID();
    this.setState({
      listQuestions: [
        ...listQuestions,
        <FormQuestions
          key={uid}
          questionId={uid}
          eventId={this.props.event._id}
          surveyId={idSurvey}
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

    currentQuestion = question.find((infoQuestion) => infoQuestion.id == questionId);
    currentQuestion["questionIndex"] = questionIndex;
    currentQuestion["questionOptions"] = currentQuestion.choices.length;

    this.setState({ visibleModal: true, currentQuestion });
  };

  sendForm = () => {
    this.setState({ confirmLoading: true });
    if (this.formEditRef.current) {
      this.formEditRef.current.submitWithQuestions();
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
    this.setState({ visibleModal: false, currentQuestion: {}, confirmLoading: false });
  };

  toggleConfirmLoading = () => {
    this.setState({ confirmLoading: false });
  };
  // ---------------------------------------------------------------------------------------

  goBack = () => this.props.history.goBack();

  render() {
    const {
      survey,
      publish,
      openSurvey,
      activity_id,
      dataAgenda,
      question,
      visibleModal,
      confirmLoading,
      currentQuestion,
      allow_anonymous_answers,
      allow_gradable_survey,
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
          <div>
            <div>
              <label style={{ marginTop: "2%" }} className="label">
                Nombre de la Encuesta
              </label>
              <Input value={survey} placeholder="Nombre de la encuesta" name={"survey"} onChange={this.changeInput} />
            </div>
          </div>
          {this.state.idSurvey && (
            <div>
              <label style={{ marginTop: "3%" }} className="label">
                Permitir usuarios anonimos
              </label>
              <Switch
                checked={allow_anonymous_answers == "true"}
                onChange={(checked) => this.setState({ allow_anonymous_answers: checked ? "true" : "false" })}
              />
            </div>
          )}

          {this.state.idSurvey && (
            <div>
              <label style={{ marginTop: "3%" }} className="label">
                Publicar encuesta
              </label>
              <Switch
                checked={publish == "true"}
                onChange={(checked) => this.setState({ publish: checked ? "true" : "false" })}
              />
            </div>
          )}

          {this.state.idSurvey && (
            <div>
              <label style={{ marginTop: "3%" }} className="label">
                Encuesta abierta
              </label>
              <Switch
                checked={openSurvey == "true"}
                onChange={(checked) => this.setState({ openSurvey: checked ? "true" : "false" })}
              />
            </div>
          )}

          {this.state.idSurvey && (
            <div>
              <label style={{ marginTop: "3%" }} className="label">
                Encuesta calificable
              </label>
              <Switch
                checked={allow_gradable_survey == "true"}
                onChange={(checked) => this.setState({ allow_gradable_survey: checked ? "true" : "false" })}
              />
            </div>
          )}

          {this.state.idSurvey && (
            <div>
              <label style={{ marginTop: "2%" }} className="label">
                Relacionar esta encuesta a una actividad
              </label>
              <div className="select">
                <select name="activity_id" value={activity_id} onChange={this.changeInput}>
                  <option value="0">No relacionar</option>
                  {dataAgenda.map((activity, key) => (
                    <option key={key} value={activity._id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {this.state.idSurvey ? (
            <div className="column">
              <button onClick={this.submitWithQuestions} className="columns is-pulled-right button is-primary">
                Guardar
              </button>
            </div>
          ) : (
            <div className="column">
              <button onClick={this.submit} className="columns is-pulled-right button is-primary">
                Guardar
              </button>
            </div>
          )}

          {this.state.idSurvey && (
            <div>
              <Row>
                <Col span={7} style={{ marginTop: "3%" }}>
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
                {this.state.idSurvey && Object.entries(currentQuestion).length !== 0 && (
                  <FormQuestionEdit
                    ref={this.formEditRef}
                    valuesQuestion={currentQuestion}
                    eventId={this.props.event._id}
                    surveyId={this.state.idSurvey}
                    closeModal={this.closeModal}
                    toggleConfirmLoading={this.toggleConfirmLoading}
                  />
                )}
              </Modal>
            </div>
          )}
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(triviaEdit);
