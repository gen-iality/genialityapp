import React, { Component, Fragment } from "react";
import { Redirect, withRouter, Link } from "react-router-dom";
import EventContent from "../events/shared/content";
import { SurveysApi, AgendaApi } from "../../helpers/request";
import { deleteSurvey } from "./services";

import { sweetAlert } from "../../helpers/utils";
import EvenTable from "../events/shared/table";
import "react-tabs/style/react-tabs.css";
import { Table } from 'antd';
import { toast } from "react-toastify";

import { message } from "antd";

class trivia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      data: [],
      dataAgenda: [],
      activity_id: "",
      survey: "",
      publish: "",
      shareholders: [{ name: "" }],
    };
    this.destroy = this.destroy.bind(this);
  }

  async componentDidMount() {
    this.getInformation();
  }
  // Se realiza la funcion para obtener todos los datos necesarios tanto para encuesta como para agenda
  getInformation = async () => {
    const info = await SurveysApi.getAll(this.props.event._id);
    const dataAgenda = await AgendaApi.byEvent(this.props.event._id);
    //Se envía al estado la data obtenida de las api
    this.setState({
      dataAgenda: dataAgenda.data,
      data: info.data,
      survey: info.survey,
      publicada: info.publicada,
    });
  };
  // Funcion para permitir el cambio del value de los input y enviarlo al state
  changeInput = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  //Funcion para eliminar un dato de la lista
  destroy(idTrivia) {
    message.loading({ content: "Eliminando Encuesta", key: "deleting" });

    SurveysApi.deleteOne(this.props.event._id, idTrivia).then(async (TriviaDestroy) => {
      console.log(TriviaDestroy);
      let deleteSurveyInFire = await deleteSurvey(idTrivia);
      console.log("Fire:", deleteSurveyInFire);
      message.success({ content: deleteSurveyInFire.message, key: "deleting" });
      this.getInformation();
    });
  }

  render() {
    const { matchUrl } = this.props;
    const { data } = this.state;
    if (this.state.redirect) return <Redirect to={{ pathname: `${matchUrl}`, state: { new: true } }} />;
    return (
      <Fragment className="columns is-12">
        <EventContent title={"Encuestas"}>
          <Link to={{ pathname: `${matchUrl}/encuesta` }}>
            <button className="columns is-pulled-right button is-primary">
              <span className="icon">
                <i className="fas fa-plus-circle" />
              </span>
              <spa>Nueva Encuesta</spa>
            </button>
          </Link>
          <Table dataSource={data} columns={trivia.survey}/>;
          <EvenTable style={{ marginTop: "5%" }} head={["Nombre de encuesta", "Publicada", ""]}>
            {data.map((trivia, key) => (
              <tr key={key}>
                <td>{trivia.survey}</td>
                <td>{trivia.publish === "true" ? "Publicada" : "No publicada"}</td>
                <td>
                  <Link to={{ pathname: `${this.props.matchUrl}/report`, state: { report: trivia._id } }}>
                    <button>
                      <span className="icon">
                        <i className="fas fa-search" />
                      </span>
                    </button>
                  </Link>
                  <Link to={{ pathname: `${this.props.matchUrl}/encuesta`, state: { edit: trivia._id } }}>
                    <button>
                      <span className="icon">
                        <i className="fas fa-edit" />
                      </span>
                    </button>
                  </Link>
                  <button onClick={this.destroy.bind(trivia.survey, trivia._id)}>
                    <span className="icon">
                      <i className="fas fa-trash-alt" />
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </EvenTable>
        </EventContent>
      </Fragment>
    );
  }
}

export default trivia;
