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
            loading: true,
            redirect: false,
            deleteID: false,
            isLoading: { types: true, categories: true },
            data: [],
            survey: "",
            publicada: ""
        }
    }

    async componentDidMount() {
        if(this.props.location.state.edit)
        this.getInformation()
    }

    getInformation = async () => {
        const info = await SurveysApi.getOne(this.props.event._id, this.props.location.state.edit)
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

    select = (select) => {
        const publicada = select.target.value;
        this.setState({ publicada })
    };

    recolectInfo(){
        const {survey,publicada} =this.state;
        return {
            survey,
            publicada
        }
    }

    submit = async () => {
        const information = this.recolectInfo();
        console.log(information);
        const { event, location: { state } } = this.props;
        if(state.edit){
            await SurveysApi.editOne(information, state.edit, event._id)
        }else{
            await SurveysApi.createOne(event._id,information)
        }
        sweetAlert.hideLoading();
        sweetAlert.showSuccess("Información guardada")
    }

    render() {
        const { matchUrl } = this.props;
        const { survey,publicada } = this.state;
        if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
        return (
            <Fragment>
                <EventContent title="Encuesta" closeAction={this.goBack}>
                    <div>
                        <label>Nombre</label>
                        <input value={survey} className="input" placeholder="Nombre de la encuesta" name={"survey"} onChange={this.changeInput} />
                    </div>

                    <div className="column is-4">
                        <div>
                            <label>Activo</label>
                        </div>
                        <div class="select">
                            <select value={publicada} onChange={this.select}>
                                <option>...Seleccionar</option>
                                <option value="si">Si</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label>respuesta 1</label>
                        <input type="text"/>
                    </div>

                    <div>
                        <label>respuesta 2</label>
                        <input type="text"/>
                    </div>

                    <div>
                        <label>respuesta 3</label>
                        <input type="text"/>
                    </div>

                    <div>
                        <label>respuesta 4</label>
                        <input type="text"/>
                    </div>

                    <div className="column">
                        <button onClick={this.submit} className="button is-primary">Guardar</button>
                    </div>
                </EventContent>
            </Fragment>
        )
    }
}

export default withRouter(TriviaEdit);
