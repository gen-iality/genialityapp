import React, { Component, Fragment } from 'react';
import { Redirect, withRouter, Link } from "react-router-dom";
import EventContent from "../events/shared/content";
import { SurveysApi, AgendaApi } from "../../helpers/request";
import { sweetAlert } from "../../helpers/utils";
import EvenTable from "../events/shared/table";
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-toastify';

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
            shareholders: [{ name: "" }]
        }
        this.submit = this.submit.bind(this)
        this.destroy = this.destroy.bind(this)
    }

    async componentDidMount() {
        this.getInformation()
    }
    // Se realiza la funcion para obtener todos los datos necesarios tanto para encuesta como para agenda
    getInformation = async () => {
        const info = await SurveysApi.getAll(this.props.event._id)
        const dataAgenda = await AgendaApi.byEvent(this.props.event._id)
        //Se envía al estado la data obtenida de las api
        this.setState({
            dataAgenda: dataAgenda.data,
            data: info.data,
            survey: info.survey,
            publicada: info.publicada
        })

    }
    // Funcion para permitir el cambio del value de los input y enviarlo al state
    changeInput = (e) => {
        const { name } = e.target;
        const { value } = e.target;
        this.setState({ [name]: value });
    };

    //Funcion para guardar los datos de la encuesta
    submit = async () => {
        //Se recoge la data del estado para poder guardarla 
        const data = {
            survey: this.state.survey,
            publish: this.state.publish,
            activity_id: this.state.activity_id
        }

        //Se realiza la peticion post para guardar la informacion de la data enviando tambien el id del evento
        const dataTrivia = await SurveysApi.createOne(this.props.event._id, data)
        console.log(dataTrivia)
        
        //Se obtiene la lista para evitar recargar la pagina, de esta manera se actualiza la lista
        this.getInformation()
    }
    //Funcion para eliminar un dato de la lista
    async destroy(idTrivia) {
        const TriviaDestroy = await SurveysApi.deleteOne(this.props.event._id, idTrivia)
        console.log(TriviaDestroy)

        toast.success("Trivia Eliminada")
        this.getInformation()
    }

    render() {
        const { matchUrl } = this.props;
        const { survey, dataAgenda, data } = this.state;
        if (this.state.redirect) return <Redirect to={{ pathname: `${matchUrl}`, state: { new: true } }} />;
        return (
            <Fragment>
                <EventContent title="Trivias">
                    <div className="columns is-6">
                        <div>
                            <label style={{ marginTop: "15%" }} className="label">Nombre de la trivia</label>
                            <input className="input" placeholder="Nombre de la encuesta" name={"survey"} onChange={this.changeInput} />
                        </div>
                        <div className="column">
                            <button onClick={this.submit} className="columns is-pulled-right button is-primary">Guardar</button>
                        </div>
                    </div>
                    <label style={{ marginTop: "5%" }} className="label">activar la encuesta</label>
                    <div className="select" style={{ marginBottom: "5%" }}>
                        <select onClick={e => { this.setState({ publish: e.target.value }) }}>
                            <option>...Seleccionar</option>
                            <option value={true}>Si</option>
                            <option value={false}>No</option>
                        </select>
                    </div>

                    <br />
                    <div className="select">
                        <label className="Seleccione una actividad a referenciar"></label>
                        <select onChange={e => { this.setState({ activity_id: e.target.value }) }} >
                            <option>...Selecciona</option>
                            {
                                dataAgenda.map((activity, key) => (
                                    <option key={key} value={activity._id}>{activity.name}</option>
                                ))
                            }

                        </select>
                    </div>
                    <EvenTable style={{ marginTop: "5%" }} head={["Titulo de encuesta", "Publicada", ""]}>
                        {
                            data.map((trivia, key) => (
                                <tr key={key}>
                                    <td>
                                        {trivia.survey}
                                    </td>
                                    <td>
                                        {
                                            trivia.publish === 'true' ? 'Publicada' : 'No publicada'
                                        }
                                    </td>
                                    <td>
                                        <Link to={{ pathname: `${this.props.matchUrl}/editar`, state: { edit: trivia._id } }}>
                                            <button><span className="icon"><i className="fas fa-edit" /></span></button>
                                        </Link>
                                        <button onClick={this.destroy.bind(trivia.survey, trivia._id)}><span className="icon"><i className="fas fa-trash-alt" /></span></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </EvenTable>
                </EventContent>
            </Fragment>
        )
    }
}

export default trivia
