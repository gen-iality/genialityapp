import React, { Component } from 'react';
import { Actions } from "../../helpers/request";
import LogOut from "../shared/logOut";
import EventContent from "../events/shared/content";
import EvenTable from "../shared/table";
import Moment from "moment";
import TableAction from "../events/shared/tableAction";
import { Link } from "react-router-dom";
import { handleRequestError, sweetAlert } from "../../helpers/utils";
import { SurveysApi } from "../../helpers/request";

const question = [
    { question: "Encuesta1" },
    { question: "Encuesta2" },
    { question: "Encuesta3" }
]

class SurveysCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.event,
            loading: true,
            surveys: {},
            info: {},
            dates: []
        };
    }

    async componentDidMount() {
        this.fetchItems()
    }

    fetchItems = async () => {
        const dates = await SurveysApi.getAll(this.props.eventId);
        await this.setState({ dates: dates })
        console.log(this.state.dates)
    }

    onChange = (e) => {
        this.setState({ name: e.target.value })
    };

    newRole = () => {
        if (!this.state.list.find(({ _id }) => _id === "new")) {
            this.setState(state => {
                const list = state.list.concat({ name: '', created_at: new Date(), _id: 'new' });
                return { list: list, id: 'new', };
            });
        }
    };

    removeNew = () => {
        this.setState(state => {
            const list = state.list.filter(item => item._id !== "new");
            return { list: list, id: "", name: "" };
        });
    };

    saveItem = async () => {
        try {
            if (this.state.id !== 'new') {
                await SurveysApi.editOne({ name: this.state.surveys }, this.state.dates._id, this.props.eventId);
                this.setState(state => {
                    const list = state.dates.map(item => {
                        if (item._id === state.id) {
                            item.name = state.name;
                            return item;
                        } else return item;
                    });
                    return { list: list, id: "", name: "" };
                });
            } else {
                const newRole = await SurveysApi.create({ name: this.state.surveys, event_id: this.props.eventId });
                this.setState(state => {
                    const list = state.dates.map(item => {
                        if (item._id === state.id) {
                            item.name = newRole.name;
                            item.created_at = newRole.created_at;
                            item._id = newRole._id;
                            return item;
                        } else return item;
                    });
                    return { list: list, id: "", name: "" };
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    editItem = (cert) => this.setState({ id: cert._id, name: cert.survey });

    removeItem = (deleteID) => {
        sweetAlert.twoButton(`Está seguro de borrar este tipo de asistente`, "warning", true, "Borrar", async (result) => {
            try {
                if (result.value) {
                    sweetAlert.showLoading("Espera (:", "Borrando...");
                    await SurveysApi.deleteOne(deleteID, this.props.eventID);
                    this.setState(state => ({ id: "", name: "" }));
                    this.fetchItems();
                    sweetAlert.hideLoading();
                }
            } catch (e) {
                sweetAlert.showError(handleRequestError(e))
            }
        });
    };

    render() {
        const { timeout } = this.state;
        const { dates, id } = this.state;
        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section" style={{ marginBottom: "4%" }}>Listado de Encuestas</h2>
                        <Link to={{ pathname: `Createsurvey` }}>
                            <button className="button is-primary">Crear Encuesta</button>
                        </Link>
                        <div>
                            {dates}
                            {<EventContent title={"Encuestas"} description={"Clasifique a los asistentes en categorías personalizadas. Ej: Asistente, conferencista, mesa de honor, etc."}
                                addAction={this.newRole} addTitle={"Nuevo rol"}>
                                <EvenTable head={["Nombre", "Acciones"]}>
                                    {this.state.dates.map((cert, key) => {
                                        return <tr key={key}>
                                            <td>
                                                {
                                                    id === cert._id ?
                                                        <input type="text" value={cert.survey} autoFocus onChange={this.onChange} /> :
                                                        <p>{cert.survey}</p>
                                                }
                                            </td>
                                            <td>{Moment(cert.created_at).format("DD/MM/YYYY")}</td>
                                            <TableAction id={id} object={cert} saveItem={this.saveItem} editItem={this.editItem}
                                                removeNew={this.removeNew} removeItem={this.removeItem} discardChanges={this.discardChanges} />
                                        </tr>
                                    })}
                                </EvenTable>
                            </EventContent>}
                        </div>
                    </div>
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}
export default SurveysCreate