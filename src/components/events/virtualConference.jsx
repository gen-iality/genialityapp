import React, { Component, Fragment } from "react"
import { Card, Button } from "antd"
import WithUserEventRegistered from "../shared/withUserEventRegistered"
import { AgendaApi } from "../../helpers/request";
import TimeStamp from "react-timestamp";
import Moment from "moment";

class VirtualConference extends Component {
    constructor(props) {
        super(props);
        console.log("INNER event", this.props.event, "CurrentUser", this.props.currentUser, "UsuarioRegistrado", this.props.usuarioRegistrado)
        this.state = {
            data: [],
            infoAgendaArr: [],
            currentUser: this.props.currentUser || undefined,
            usuarioRegistrado: this.props.usuarioRegistrado || undefined,
            event: this.props.event || undefined

        }
    }

    async componentDidUpdate() {



        if (!this.props.event || this.state.infoAgendaArr) return;
        console.log("INNER event", this.props.event, "CurrentUser", this.props.currentUser, "UsuarioRegistrado", this.props.usuarioRegistrado)

        const infoAgenda = await AgendaApi.byEvent(this.props.event._id);
        console.log("EVENTOAGENDA", infoAgenda);

        //Revisamos si tiene conferencia virtual
        const infoAgendaArr = [];
        for (const prop in infoAgenda.data) {
            if (infoAgenda.data[prop].meeting_id) {
                infoAgendaArr.push(infoAgenda.data[prop]);
            }
        }

        console.log(infoAgendaArr);
        this.setState({ infoAgendaArr });
    }

    async componentDidMount() {
        console.log("EVENTOAGENDAU", this.props.event);
        if (!this.props.event) return;
        const infoAgenda = await AgendaApi.byEvent(this.props.event._id);

        const infoAgendaArr = [];
        for (const prop in infoAgenda.data) {
            if (infoAgenda.data[prop].meeting_id) {
                infoAgendaArr.push(infoAgenda.data[prop]);
            }
        }

        console.log(infoAgendaArr);
        this.setState({ infoAgendaArr });
    }

    capitalizeDate(val) {
        val = Moment(val).format("DD MMMM HH:HH")
        return val.toLowerCase()
            .trim()
            .split(' ')
            .map(v => v[0].toUpperCase() + v.substr(1))
            .join(' ');
    }

    render() {
        const { infoAgendaArr } = this.state
        const { toggleConference, currentUser } = this.props
        return (
            <Fragment>
                <div>
                    <h1>Listado de conferencias Virtuales</h1>
                    {
                        infoAgendaArr.map((item, key) => (

                            (<div key={key}>
                                <Card bordered={true} style={{ marginBottom: "3%" }}>
                                    <p>{item.name}</p>
                                    {(item.hosts && item.hosts.length > 0) &&
                                        < div >
                                            <span style={{ fontWeight: "bold" }}> Conferencistas: </span> {item.hosts.map((item, key) => (<span key={key}> {item.name}</span>))}
                                        </div>
                                    }
                                    <p>{item.datetime_start} - {item.datetime_end}</p>

                                    <Button onClick={() => { toggleConference(true, item.meeting_id, currentUser) }}>Entrar a la conferencia </Button>

                                </Card>
                            </div>)
                        ))
                    }
                </div>
            </Fragment >
        )
    }
}

export default WithUserEventRegistered(VirtualConference)