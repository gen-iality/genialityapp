import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Moment from "moment";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import SearchComponent from "../shared/searchTable";
import { AgendaApi, EventsApi } from "../../helpers/request";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import AgendaLanguage from './language'

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            days: [],
            day: "",
            filtered: [],
            toShow: [],
            redirect: false,
            disabled: false
        }
    }

    async componentDidMount() {
        const { event } = this.props;
        let days = [];

        try {
            const info = await EventsApi.getOne(event._id)
            //Se valida si no existe el array dates del evento para dejar la logica 
            //que hace push a las fechas respecto a la diferencia de datetime_start y datetime_end

            const init = Moment(event.date_start);
            const end = Moment(event.date_end);
            const diff = end.diff(init, 'days');
            //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
            for (let i = 0; i < diff + 1; i++) {
                days.push(Moment(init).add(i, 'd'))
            }
            this.setState({ days, day: days[0] }, this.fetchAgenda);
            //Si el array dates del evento existe, envia al estado el array 
            //days con las fechas del array dates con su respectivo formato
            if (info.dates && info.dates.length > 0) {
                let date = info.dates

                Date.parse(date)

                for (var i = 0; i < date.length; i++) {
                    days.push(Moment(date).format("DD-MM-YYYY"))
                }

                this.setState({ days: date, day: days[0] }, this.fetchAgenda);
            }

        } catch (e) {
            console.log(e)
        }
    }

    fetchAgenda = async () => {
        const { data } = await AgendaApi.byEvent(this.props.event._id);
        //Después de traer la info se filtra por el primer día por defecto
        const filtered = this.filterByDay(this.state.days[0], data);
        this.setState({ list: data, toShow: filtered })
    };

    //Funcion para filtrar las actividades con base a la fecha de inicio
    filterByDay(day, agenda) {
        const list = agenda.filter(
            (agenda) => Moment(agenda.datetime_start, ["YYYY-MM-DD"]).format("YYYY-MM-DD") === Moment(day, ["YYYY-MM-DD"]).format("YYYY-MM-DD"),
        )
        return list
    };

    //Fn para manejar cuando se selecciona un dia, ejecuta el filtrado
    async selectDay(day) {
        const filtered = this.filterByDay(day, this.state.list);
        await this.setState({ filtered, toShow: filtered, day })
    };

    //Fn para el resultado de la búsqueda
    searchResult = (data) => this.setState({ toShow: !data ? [] : data });

    redirect = () => this.setState({ redirect: true });

    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: `${this.props.matchUrl}/actividad`, state: { new: true } }} />;
        const { days, day, filtered, toShow } = this.state;
        return (
            <Tabs>
                <TabList>
                    <Tab>Programación</Tab>
                    {/* <Tab>Programación en ingles</Tab> */}
                </TabList>
                <TabPanel>
                    <EventContent title={"Programación"} classes={"agenda-list"} addAction={this.redirect} addTitle={"Nueva actividad"}>
                        <nav className="level">
                            <div className="level-left">
                                {
                                    days.map((date, key) => <div onClick={() => this.selectDay(date)} key={key} className={`level-item date ${date === day ? "active" : ""}`}>
                                        <p className="subtitle is-5">
                                            <strong>{
                                                Moment(date, ["YYYY-MM-DD"]).format("MMMM-DD")
                                            }</strong>
                                        </p>
                                    </div>
                                    )
                                }
                            </div>
                        </nav>
                        <SearchComponent data={filtered} placeholder={"por Nombre, Espacio o Conferencista"} kind={'agenda'} classes={"field"} searchResult={this.searchResult} />
                        <EvenTable head={["Hora", "Actividad", "Categorías", "Espacio", "Conferencista", ""]} headStyle={[{ width: "12%" }, { width: "48%" }, { width: "10%" }, { width: "10%" }, { width: "18%" }, { width: "2%" }]}>
                            {toShow.map((agenda, key) => (
                                <tr key={key}>
                                    <td>{Moment(agenda.datetime_start, "YYYY-MM-DD HH:mm").format("HH:mm")} - {Moment(agenda.datetime_end, "YYYY-MM-DD HH:mm").format("HH:mm")}</td>
                                    <td>
                                        <p>{agenda.name}</p>
                                        <small className="is-italic">{agenda.restriction} {agenda.roles ? agenda.roles.map(rol => rol) : ""}</small>
                                        {agenda.type && <p><strong>{agenda.type.name}</strong></p>}
                                    </td>
                                    <td>
                                        {agenda.activity_categories.map((cat, keycat) => <span key={keycat} style={{ background: cat.color, color: cat.color ? "white" : "" }} className="tag">{cat.name}</span>)}
                                    </td>
                                    <td>{agenda.space ? agenda.space.name : ""}</td>
                                    <td>{agenda.hosts.map(({ name }, hostkey) => <p key={hostkey}>{name}</p>)}</td>
                                    <td>

                                        <Link to={{ pathname: `${this.props.matchUrl}/actividad`, state: { edit: agenda._id } }}>
                                            <button><span className="icon"><i className="fas fa-2x fa-chevron-right" /></span></button>
                                        </Link>

                                    </td>
                                </tr>
                            ))}
                        </EvenTable>
                    </EventContent>
                </TabPanel>
                <TabPanel>
                    <AgendaLanguage state={this.props} />
                </TabPanel>
            </Tabs>
        )
    }
}

export default Agenda
