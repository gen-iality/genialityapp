import React, { Component, Fragment } from 'react';
import { Redirect, withRouter, Link } from "react-router-dom";
import EventContent from "../events/shared/content";
import { SurveysApi } from "../../helpers/request";
import { sweetAlert } from "../../helpers/utils";
import 'react-tabs/style/react-tabs.css';

class TriviaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            data: [],
            survey: "",
            dateStart: "",
            timeStart:"",
            dateEnd:"",
            timeEnd:"",
            shareholders: [{ name: "" }]
        }
    }

    async componentDidMount() {

    }

    getInformation = async () => {
        const info = await SurveysApi.getOne(this.props.event._id, this.props.location.state.edit)
        console.log(info)
        this.setState({ data: [info] })
        this.setState({ survey: info.survey })
        this.setState({ publicada: info.publicada })
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
        console.log("Nombre Encuesta: ",this.state.survey)
        console.log("Fecha Inicio: ",this.state.dateStart)
        console.log("Fecha Fin: ",this.state.dateEnd)
        console.log("Hora Inicio: ",this.state.timeStart)
        console.log("Hora Fin: ",this.state.timeEnd)
    }
    selectTimeStart = (select)=>{
        const timeStart = select.target.value;
        this.setState({ timeStart })
    }
    selectTimeEnd = (select)=>{
        const timeEnd = select.target.value;
        this.setState({ timeEnd })
    }

    render() {
        const { matchUrl } = this.props;
        const { survey } = this.state;
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
                </EventContent>
            </Fragment>
        )
    }
}

export default withRouter(TriviaEdit);
