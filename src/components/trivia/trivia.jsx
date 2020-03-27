import React, { Component, Fragment } from 'react';
import EventContent from '../events/shared/content';
import EvenTable from "../events/shared/table";
import { SurveysApi, Actions } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
import firebase from 'firebase';
import axios from 'axios'

class trivia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            redirect: false,
            list: [],
            file: "",
            disabledButton: true,
            folder: "",
            id: ""
        };
    }

    async componentDidMount() {
        const { data } = await SurveysApi.getAll(this.props.event._id)
        console.log(data)
        this.setState({ list: data })
    }

    redirect = () => this.setState({ redirect: true });

    destroy = async (id) => {
        const info = await SurveysApi.deleteOne(this.props.event._id, id)
        toast.success("Información Eliminada")
        setTimeout(function () {
            window.location.reload()
        }, 2000);
        console.log(info)
    }

    render() {
        const { list } = this.state;
        return (
            <Fragment>
                <div className="columns">
                    <div class="column">
                        <div class="control has-icons-left has-icons-right">
                            <input class="input is-success" type="text" placeholder="Text input" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                    </div>
                    <div className="column">
                        <Link to={{ pathname: `${this.props.matchUrl}/encuesta`}}>
                            <button className="columns is-pulled-right button is-primary">Crear Trivia</button>
                        </Link>

                    </div>
                </div>
                <EventContent classes={"trivias-list"}>
                    <EvenTable head={["Nombre", ""]}>
                        {
                            list.map((trivia, key) => (
                                <tr key={key}>
                                    <td>
                                        {trivia.title}
                                    </td>
                                    <td>
                                        <button onClick={this.destroy.bind(trivia.title, trivia._id)}><span className="icon"><i className="fas fa-trash-alt" /></span></button>
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