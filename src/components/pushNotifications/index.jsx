import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Actions, PushFeed } from "../../helpers/request";
import { FormattedMessage } from "react-intl";
import Loading from "../loaders/loading";
import { handleRequestError, sweetAlert } from "../../helpers/utils";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import TableAction from "../events/shared/tableAction";

class pushNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            items: {},
            push: {},
            loading: true,
            notifications: {},
            result: []
        }
        this.submit = this.submit.bind(this)
    }

    fetchItem = async () => {
        const result = await PushFeed.byEvent(this.props.eventId);
        this.setState({
            result,
            loading: false
        });
    };

    async componentDidMount() {
        this.fetchItem();
    }

    saveRole = async () => {
        try {
            if (this.state.id !== 'new') {
                await PushFeed.editOne({ title: this.state.title, body: this.state.body }, this.state.id, this.props.eventId);
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.title = state.title;
                            item.body = state.body;
                            toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                            return item;
                        } else return item;
                    });
                    return { list, id: "", title: "", body: "" };
                });
            } else {
                const newRole = await PushFeed.create({ title: this.state.title, body: this.state.body }, this.props.eventId);
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.title = newRole.title;
                            item.body = newRole.body;
                            toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                            return item;
                        } else return item;
                    });
                    return { list, id: "", title: "", body: "" };
                });
            }
        } catch (e) {
            console.log(e);

        }
    };

    editItem = (cert) => this.setState({ id: cert._id, title: cert.title, body: cert.body });

    removeItem = (id) => {
        sweetAlert.twoButton(`Está seguro de borrar este espacio`, "warning", true, "Borrar", async (result) => {
            try {
                if (result.value) {
                    sweetAlert.showLoading("Espera (:", "Borrando...");
                    await PushFeed.deleteOne(id, this.props.eventId);
                    this.setState(state => ({ id: "", title: "", body: "" }));
                    this.fetchItem();
                    sweetAlert.hideLoading();
                }
            } catch (e) {
                sweetAlert.showError(handleRequestError(e))
            }
        });
    }

    async submit(e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            console.log(this.state.push)
            const result = await Actions.create(`api/event/${this.props.eventId}/sendpush`, this.state.push);
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
        const { result } = this.state;
        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Push Notifications</h2><br />
                        <label className="label">Las notificaciones se envian a todos los usuarios del evento.</label>
                        <div className="column inner-column">
                            <label className="label">Titulo.</label>
                            <input className="input" type="text" onChange={(save) => { this.setState({ push: { ...this.state.push, title: save.target.value } }) }} name="title" />
                        </div>

                        <div className="column inner-column">
                            <label className="label">Mensaje</label>
                            <input className="textarea" type="textarea" onChange={(save) => { this.setState({ push: { ...this.state.push, body: save.target.value, data: '', id: this.props.eventId } }) }} name="title" />
                        </div>
                        <button className="button is-primary" onClick={this.submit}>Enviar</button>
                        <div className="column is-12">
                            <EventContent title="Notificaciones" closeAction={this.goBack} description_complete={"Observe o elimine las notificaciones observadas "} addAction={this.newRole} addTitle={"Nuevo espacio"}>
                                {console.log(this.state.result),
                                    this.state.loading ? <Loading /> :
                                        <EvenTable head={["Titulo", "Notificacion", "Fecha", ""]}>
                                            {this.state.result.map((cert, key) => {
                                                console.log(cert)
                                                return <tr key={key}>
                                                    <div class="notification is-primary">
                                                        Enviados correctamente <p>{cert.success}</p>
                                                    </div>
                                                    <td>
                                                        <p>{cert.title}</p>
                                                    </td>

                                                    <td>
                                                        <p>{cert.body}</p>
                                                    </td>
                                                    <td>{cert.created_at}</td>
                                                    <TableAction id={this.state.id} object={cert} saveItem={this.saveRole} editItem={this.editItem}
                                                        removeNew={this.removeNewRole} removeItem={this.removeItem} discardChanges={this.discardChanges} />
                                                </tr>
                                            })}
                                        </EvenTable>
                                }
                            </EventContent>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default pushNotification