import React, { Component, Fragment } from "react"
import { Card, Button } from "antd"
import WithUserEventRegistered from "../shared/withUserEventRegistered"
import { AgendaApi, SurveysApi } from "../../helpers/request";
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
            event: this.props.event || undefined,
            survey: [],
        }

    }

    async componentDidUpdate() {

        //Si aún no ha cargado el evento no podemos hacer nada más
        if (!this.props.event) return;

        //Si ya cargamos la agenda no hay que volverla a cargar o quedamos en un ciclo infinito
        if (this.state.infoAgendaArr && this.state.infoAgendaArr.length) return;

        let filteredAgenda = await this.filterVirtualActivities(this.props.event._id)
        this.setState({ infoAgendaArr: filteredAgenda });
        if (filteredAgenda && filteredAgenda.length > 0) {
            let survey = await SurveysApi.getByActivity(this.props.event._id, filteredAgenda[0]._id);
            this.setState({ survey: survey });
        }

    }
    async componentDidMount() {

        if (!this.props.event) return;

        let filteredAgenda = await this.filterVirtualActivities(this.props.event._id)
        this.setState({ infoAgendaArr: filteredAgenda });


    }

    async filterVirtualActivities(event_id) {
        let infoAgendaArr = [];
        let id = []
        if (!event_id) return infoAgendaArr;
        const infoAgenda = await AgendaApi.byEvent(event_id);

        for (const prop in infoAgenda.data) {
            if (infoAgenda.data[prop].meeting_id) {
                infoAgendaArr.push(infoAgenda.data[prop]);
            }

            if (infoAgenda.data[prop]._id) {
                id.push(infoAgenda.data[prop]);
            }
        }

        return infoAgendaArr;
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
        const { infoAgendaArr, survey } = this.state
        const { toggleConference, currentUser, usuarioRegistrado } = this.props
        return (
            <Fragment>
                <div>
                    <Card bordered={true} >
                        <span>Conferencias Virtuales</span>
                    </Card>
                    {
                        infoAgendaArr.map((item, key) => (

                            (<div key={key}>
                                <Card bordered={true} style={{ marginBottom: "3%" }}>
                                    <p>{item.name}</p>
                                    {(item.hosts && item.hosts.length > 0) && false &&
                                        < div >
                                            <span style={{ fontWeight: "bold" }}> Conferencistas: </span> {item.hosts.map((item, key) => (<span key={key}> {item.name}, </span>))}
                                        </div>
                                    }
                                    <p> {Moment(item.datetime_start).format("MMMM D h:mm A")} - {Moment(item.datetime_end).format("h:mm A")} </p>


                                    <Button type="primary" onClick={() => { toggleConference(true, item.meeting_id, currentUser, survey.data) }}>Entrar a la conferencia </Button>

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