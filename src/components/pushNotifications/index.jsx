import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Actions } from "../../helpers/request";
import { FormattedMessage } from "react-intl";
import axios from "axios/index";
import { BaseUrl } from "../../helpers/constants";

class pushNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            isLoaded: true,
            items: {},
            push: {},
            notifications:{}
        }
        console.log("Formulario Correcto")
        this.submit = this.submit.bind(this)
    }

    async componentDidMount() {
    }


    async submit(e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            console.log(this.state.push)
            const result = await Actions.create(`api/event/${this.props.eventId}/sendpush`,this.state.push);
            if (result) {
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
            } else {
                toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk" />);
                this.setState({ msg: 'Cant Create', create: false })
            }
            this.setState({ loading: false });
        }
        catch (error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
            if (error.response) {
                console.log(error.response);
                const { status, data } = error.response;
                console.log('STATUS', status, status === 401);
                if (status === 401) this.setState({ timeout: true, loader: false });
                else this.setState({ serverError: true, loader: false, errorData: data })
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                console.log(this.state.push)
                if (error.request) {
                    console.log(error.request);
                    errorData = error.request
                };

                this.setState({ serverError: true, loader: false, errorData })
            }
            console.log(error.config);
        }
    }
    
    render() {
        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Push Notifications</h2><br/>
                        <label className="label">Las notificaciones se envian a todos los usuarios del evento.</label>
                        <div className="column inner-column">
                            <label className="label">Titulo.</label>
                            <input className="input" type="text" onChange={(save) => { this.setState({ push: { ...this.state.push, title: save.target.value } }) }} name="title" />
                        </div>

                        <div className="column inner-column">
                            <label className="label">Mensaje</label>
                            <input className="textarea" type="textarea" onChange={(save) => { this.setState({ push: { ...this.state.push, body: save.target.value, data:'' } }) }} name="title" />
                        </div>
                        <button className="button is-primary" onClick={this.submit}>Enviar</button>
                        {/* <div className="column is-12">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th><abbr title="Position">Titulo</abbr></th>
                                        <th>Mensaje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>38</td>
                                        <td>23</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default pushNotification