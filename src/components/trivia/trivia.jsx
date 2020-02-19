import React, { Component, Fragment } from 'react';
import EventContent from '../events/shared/content';
import EvenTable from "../events/shared/table";
import { SurveysApi } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import { sweetAlert } from "../../helpers/utils";
import { toast } from 'react-toastify';

class trivia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            redirect: false,
            list: []
        };
    }

    async componentDidMount() {
        const { data } = await SurveysApi.getAll(this.props.event._id);
        this.setState({ list: data })
    }

    destroy(id, event) {
        let information = SurveysApi.deleteOne(event, id);
        console.log(information);
        toast.success("Information Deleted")
        setTimeout(function () { 
            window.location.reload()
        }, 4000);
    }

    redirect = () => this.setState({ redirect: true });

    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: `${this.props.matchUrl}/encuesta`, state: { new: true } }} />;
        const { list } = this.state;
        return (
            <Fragment>
                <div>
                    <h1></h1>
                    <EventContent title={"Trivias"} classes={"trivias-list"} addAction={this.redirect} addTitle={"Nueva trivia"}>
                        <EvenTable head={["Nombre", "Activo", ""]}>
                            {
                                list.map((trivia, key) => (
                                    <tr key={key}>
                                        <td>{trivia.survey}</td>
                                        <td>{trivia.publicada}</td>
                                        <td>
                                            <Link to={{ pathname: `${this.props.matchUrl}/encuesta`, state: { edit: trivia._id } }}>
                                                <button><span className="icon"><i className="fas fa-2x fa-chevron-right" /></span></button>
                                            </Link>
                                        </td>
                                        <td>
                                            <button onClick={this.destroy.bind(trivia.publicada, trivia._id, this.props.event._id)}><span className="icon"><i className="fas fa-trash-alt" /></span></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </EvenTable>
                    </EventContent>
                </div>
            </Fragment>
        )
    }


}

export default trivia