import React, { Component, Fragment } from 'react';
import { Redirect, withRouter, Link } from "react-router-dom";
import EventContent from "../events/shared/content";
import { SurveysApi, AgendaApi } from "../../helpers/request";
import { sweetAlert } from "../../helpers/utils";
import EvenTable from "../events/shared/table";
import 'react-tabs/style/react-tabs.css';

class TriviaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            data: [],
            dataAgenda: [],
            activity_id: "",
            survey: "",
            dateStart: "",
            timeStart: "",
            dateEnd: "",
            timeEnd: "",
            shareholders: [{ name: "" }]
        }
    }

    async componentDidMount() {
        this.getInformation()
    }

    getInformation = async () => {
        const info = await SurveysApi.getAll(this.props.event._id)
        const dataAgenda = await AgendaApi.byEvent(this.props.event._id)
        console.log(info)
        this.setState({
            dataAgenda: dataAgenda.data,
            data: info.data,
            survey: info.survey,
            publicada: info.publicada
        })

    }

    goBack = () => this.setState({ redirect: true });

    changeInput = (e) => {
        const { name } = e.target;
        const { value } = e.target;
        this.setState({ [name]: value });
    };

    selectDateStart = (select) => {
        const dateStart = select.target.value;
        this.setState({ dateStart })
    };

    selectDateEnd = (select) => {
        const dateEnd = select.target.value;
        this.setState({ dateEnd })
    };

    submit = async () => {
        const data = {
            survey: this.state.survey,
            date_start: this.state.dateStart,
            date_end: this.state.dateEnd,
            time_start: this.state.timeStart,
            time_end: this.state.timeEnd,
            activity_id: this.state.activity_id
        }

        console.log(data)

        const dataTrivia = await SurveysApi.createOne(this.props.event._id, data)
        console.log(dataTrivia)
    }
    selectTimeStart = (select) => {
        const timeStart = select.target.value;
        this.setState({ timeStart })
    }
    selectTimeEnd = (select) => {
        const timeEnd = select.target.value;
        this.setState({ timeEnd })
    }

    render() {
        const { matchUrl } = this.props;
        const { survey, dataAgenda, data } = this.state;
        if (this.state.redirect) return <Redirect to={{ pathname: `${matchUrl}`, state: { new: true } }} />;
        return (
            <Fragment>
                <EventContent title="Trivias" closeAction={this.goBack}>
                    <div className="columns is-6">
                        <div>
                            <label style={{ marginTop: "15%" }} className="label">Nombre de la trivia</label>
                            <input value={survey} className="input" placeholder="Nombre de la encuesta" name={"survey"} onChange={this.changeInput} />
                        </div>
                        <div className="column">
                            <button onClick={this.submit} className="columns is-pulled-right button is-primary">Guardar</button>
                        </div>
                    </div>
                    <label style={{ marginTop: "5%" }} className="label">activar la encuesta</label>
                    <div className="columns is-6">
                        <div className="control has-icons-left has-icons-right">
                            <input className="input is-success" onChange={this.selectDateStart} type="date" placeholder="Text input" />
                            <span className="icon is-small is-left">
                                <i className="fas fa-calendar-alt"></i>
                            </span>
                        </div>
                        <input style={{ marginLeft: "3%" }} onChange={this.selectTimeStart} className="column is-2 input is-primary" type="time" />
                    </div>
                    <div style={{ marginTop: "5%" }} className="columns is-6">
                        <div className="control has-icons-left has-icons-right">
                            <input className="input is-success" onChange={this.selectDateEnd} type="date" placeholder="Text input" />
                            <span className="icon is-small is-left">
                                <i className="fas fa-calendar-alt"></i>
                            </span>
                        </div>
                        <input style={{ marginLeft: "3%" }} onChange={this.selectTimeEnd} className="column is-2 input is-primary" type="time" />
                    </div>
                    <br />
                    <div className="select">
                        <label className="Seleccione una actividad a referenciar"></label>
                        <select onChange={e => { this.setState({ activity_id: e.target.value }) }} >
                            <option>...Selecciona una opcion</option>
                            {
                                dataAgenda.map((activity, key) => (
                                    <option key={key} value={activity._id}>{activity.name}</option>
                                ))
                            }

                        </select>
                    </div>
                    <EvenTable style={{ marginTop: "5%" }} head={["Titulo de encuesta", "Fecha de inicio", "Fecha de cierre", ""]}>
                        {
                            data.map((trivia, key) => (
                                <tr key={key}>
                                    <td>
                                        {trivia.survey}
                                    </td>
                                    <td>
                                        {trivia.date_start}
                                    </td>
                                    <td>
                                        {trivia.date_end}
                                    </td>
                                    <td>
                                        {/* <button onClick={this.destroy.bind(trivia.survey, trivia._id)}><span className="icon"><i className="fas fa-trash-alt" /></span></button> */}
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

export default withRouter(TriviaEdit);
