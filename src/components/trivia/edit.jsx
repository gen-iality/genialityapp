import React, { Component, Fragment, useEffect, useState } from "react";

import EventContent from "../events/shared/content";

import { selectOptions } from "./constants";

import { SurveysApi, AgendaApi } from "../../helpers/request";
import { createOrUpdateSurvey } from "./services";

import { withRouter } from "react-router-dom";
import ReactQuill from "react-quill";
import { toolbarEditor } from "../../helpers/constants";

import { toast } from "react-toastify";
import { Button, Row, Col, Table, Divider, Modal, Form, Input, Switch, message, Tooltip } from "antd";

import FormQuestionEdit from "./formEdit";

const { TextArea } = Input;

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
      show_horizontal_bar: true,
      allow_vote_value_per_user: false,
      activity_id: "",
      dataAgenda: [],
      quantityQuestions: 0,
      listQuestions: [],
      points: 1,
      question: [],
      visibleModal: false,
      confirmLoading: false,
      key: Date.now(),
      currentQuestion: [], // Variable que se usa para obtener datos de una pregunta y editarla en el modal
      initialMessage: null,
      freezeGame: true
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
        show_horizontal_bar: Update.show_horizontal_bar || true,
        allow_vote_value_per_user: Update.allow_vote_value_per_user || "false",
        allow_anonymous_answers: Update.allow_anonymous_answers,
        activity_id: Update.activity_id,
        freezeGame: Update.freezeGame === true ? "true" : "false",
        dataAgenda: dataAgenda.data,
        points: Update.points ? Update.points : 1,
        initialMessage: Update.initialMessage ? Update.initialMessage.replace(/<br \/>/g, "\n") : null,
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
      allow_gradable_survey: "false",
      show_horizontal_bar: this.state.show_horizontal_bar === "true" ? true : false,
      allow_vote_value_per_user: "false",
      freezeGame: this.state.freezeGame === "true" ? true : false,
      event_id: this.props.event._id,
      activity_id: this.state.activity_id,
      points: this.state.points ? parseInt(this.state.points) : 1,
      initialMessage: this.state.initialMessage,
    };
    console.log(data);
    // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
    const save = await SurveysApi.createOne(this.props.event._id, data);
    console.log(save);
    const idSurvey = save._id;

    // Esto permite almacenar los estados en firebase
    let setDataInFire = await createOrUpdateSurvey(
      idSurvey,
      { isPublished: data.publish, isOpened: "false", freezeGame: data.freezeGame },
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
      show_horizontal_bar: this.state.show_horizontal_bar === "true" ? true : false,
      allow_vote_value_per_user: this.state.allow_vote_value_per_user,
      activity_id: this.state.activity_id,
      points: this.state.points ? parseInt(this.state.points) : 1,
      initialMessage: this.state.initialMessage,
      freezeGame: this.state.freezeGame === "true" ? true : false
    };
    console.log(data);

    // Se envía a la api la data que recogimos antes, Se extrae el id de data y se pasa el id del evento que viene desde props
    SurveysApi.editOne(data, this.state.idSurvey, this.props.event._id)
      .then(async () => {
        // Esto permite almacenar los estados en firebase
        let setDataInFire = await createOrUpdateSurvey(
          this.state.idSurvey,
          { isPublished: data.publish, isOpened: data.open, allow_anonymous_answers: data.allow_anonymous_answers, freezeGame: data.freezeGame },
          { eventId: this.props.event._id, name: data.survey, category: "none" }
        );

        console.log("Fire:", setDataInFire);
        message.success({ content: setDataInFire.message, key: "updating" });
      })
      .catch((err) => {
        console.log("Hubo un error", err);
      });
  }

  // Funcion para generar un id a cada pregunta 'esto es temporal'
  generateUUID = () => {
    let d = new Date().getTime();
    let uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
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
    this.setState({ visibleModal: true, currentQuestion: { id: uid } });
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

    this.setState({ visibleModal: true, currentQuestion });
  };

  sendForm = () => {
    this.setState({ confirmLoading: true });
    if (this.formEditRef.current) {
      this.formEditRef.current.submit();
    }
  };

  closeModal = (info, state) => {
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

      switch (state) {
        case "created":
          updateQuestion.push(data);
          this.setState({ question: updateQuestion });
          break;

        case "updated":
          updateQuestion.splice(questionIndex, 1, data);
          this.setState({ question: updateQuestion });
          break;

        default:
          break;
      }
    }
    this.setState({ visibleModal: false, currentQuestion: {}, confirmLoading: false });
  };

  toggleConfirmLoading = () => {
    this.setState({ confirmLoading: false });
  };
  // ---------------------------------------------------------------------------------------

  goBack = () => this.props.history.goBack();

  onChange = (e) => {
    // Este es para el editor de texto enriquecido. El mensaje para la pagina principal de la encuesta
    if (typeof e == "string") return this.setState({ initialMessage: e });

    // Este es para el input de los puntos de la encuesta
    const { value, type } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      this.setState({ points: value });
    }
  };

  toggleSwitch = (variable, state) => {
    let { allow_gradable_survey, allow_vote_value_per_user } = this.state;
    switch (variable) {
      case "allow_gradable_survey":
        if (state && allow_vote_value_per_user == "true")
          return this.setState({ allow_gradable_survey: "true", allow_vote_value_per_user: "false" });
        this.setState({ allow_gradable_survey: state ? "true" : "false" });
        break;

      case "allow_vote_value_per_user":
        if (state && allow_gradable_survey == "true")
          return this.setState({ allow_vote_value_per_user: "true", allow_gradable_survey: "false" });
        this.setState({ allow_vote_value_per_user: state ? "true" : "false" });
        break;

      default:
        break;
    }
  };

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
      show_horizontal_bar,
      allow_vote_value_per_user,
      freezeGame,
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
                Pausar Encuesta
              </label>
              <Switch
                checked={freezeGame == "true"}
                onChange={(checked) => this.setState({ freezeGame: checked ? "true" : "false" })}
              />
            </div>
          )}
          {this.state.idSurvey && (
            <div>
              <label style={{ marginTop: "3%" }} className="label">
                Mostrar grafica de barras Vertical
              </label>
              <Switch
                checked={show_horizontal_bar == "true"}
                onChange={(checked) => this.setState({ show_horizontal_bar: checked ? "true" : "false" })}
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
                Permitir valor del voto por usuario
              </label>
              <Switch
                checked={allow_vote_value_per_user == "true"}
                onChange={(checked) => this.toggleSwitch("allow_vote_value_per_user", checked)}
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
                onChange={(checked) => this.toggleSwitch("allow_gradable_survey", checked)}
              />
            </div>
          )}

          {allow_gradable_survey == "true" && (
            <Fragment>
              <div>
                <label style={{ marginTop: "3%" }} className="label">
                  Texto de muestra para la pantalla inicial de la encuesta
                </label>
                <ReactQuill value={this.state.initialMessage} modules={toolbarEditor} onChange={this.onChange} />
              </div>
            </Fragment>
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
                    gradableSurvey={allow_gradable_survey}
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
