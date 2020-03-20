import React, { Component } from "react";
import EventContent from "../events/shared/content";
import Moment from "moment";
import EvenTable from "../events/shared/table";
import SearchComponent from "../shared/searchTable";
import { AgendaApi, Actions } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import ReactQuill from "react-quill";
import { toolbarEditor } from "../../helpers/constants";

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            days: [],
            day: "",
            space: "",
            spaces: [],
            filtered: [],
            toShow: [],
            redirect: false,
            disabled: false
        }
    }

    componentDidMount() {
        this.fetchAgenda()

        const { event } = this.props;
        let days = [];
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
        for (let i = 0; i < diff + 1; i++) {
            days.push(Moment(init).add(i, 'd'))
        }
        this.setState({ days, day: days[0] }, this.fetchAgenda);
    }

    fetchAgenda = async () => {
        const { data } = await AgendaApi.byEvent(this.props.eventId);
        console.log(data)
        //Después de traer la info se filtra por el primer día por defecto
        const filtered = this.filterByDay(this.state.days[0], data);
        this.setState({ list: data, filtered, toShow: filtered, spaces: data })
    };

    filterByDay = (day, agenda) => {
        const list = agenda.filter(a => a.datetime_start.includes(day.format("YYYY-MM-DD")))
            .sort((a, b) => Moment(a.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm") - Moment(b.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm"));
        list.map(item => {
            item.restriction = item.access_restriction_type === "EXCLUSIVE" ? "Exclusiva para: " : item.access_restriction_type === "SUGGESTED" ? "Sugerida para: " : "Abierta";
            item.roles = item.access_restriction_roles.map(({ name }) => name);
            return item
        })
        return list
    };

    //Fn para manejar cuando se selecciona un dia, ejecuta el filtrado
    selectDay = (day) => {
        const filtered = this.filterByDay(day, this.state.list);
        this.setState({ filtered, toShow: filtered, day })

    };

    selectSpace(space) {
        console.log(space)
        const filtered = this.filterBySpace(space, this.state.list);
        this.setState({ filtered, toShow: filtered, space })
    }

    filterBySpace = (space) => {
        const list = this.state.filtered.filter(a => a.space.name === space)
        console.log(list)
        list.map(item => {
            item.restriction = item.access_restriction_type === "EXCLUSIVE" ? "Exclusiva para: " : item.access_restriction_type === "SUGGESTED" ? "Sugerida para: " : "Abierta";
            item.roles = item.access_restriction_roles.map(({ name }) => name);
            return item
        })
        return list
    };

    //Fn para el resultado de la búsqueda
    searchResult = (data) => this.setState({ toShow: !data ? [] : data });

    redirect = () => this.setState({ redirect: true });

    render() {
        const { days, day, filtered, spaces, toShow } = this.state;
        return (
            <div>
                <EventContent className="columns is-desktop ">
                    <div style={{float:"left"}}>
                        {
                            spaces.map((agenda, key) => <div onClick={() => this.selectSpace(agenda.space.name)} key={key}>
                                <button style={{ marginTop: "3%", marginBottom: "3%" }} className="button is-primary">{agenda.space.name}</button>
                            </div>
                            )
                        }
                    </div>

                    <div className="column is-offset-5">
                        <nav className="level">
                            <div className="level-left">
                                {
                                    days.map((date, key) => <div onClick={() => this.selectDay(date)} key={key} className={`level-item date ${date === day ? "active" : ""}`}>
                                        <button className="button is-primary">{date.format("MMM DD")}</button>
                                    </div>
                                    )
                                }
                            </div>
                        </nav>
                        {toShow.map(agenda =>
                            <div style={{ marginBottom: "5%" }}>
                                <div class="card">
                                    <header class="card-header">
                                        <p class="card-header-title">
                                            {agenda.name}
                                        </p>
                                    </header>
                                    <div class="card-content">
                                        <div class="content">
                                            <div>
                                                <strong>{agenda.datetime_start} - {agenda.datetime_end}</strong>
                                            </div>
                                            <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                                                <div dangerouslySetInnerHTML={{ __html: agenda.description }}></div>
                                                {agenda.space.name}
                                            </div>
                                            {agenda.hosts.map(({ name }) =>
                                                <div>
                                                    <br style={{ marginTop: "5%" }} />
                                                    <strong>Conferencista</strong>
                                                    <p>{name}</p>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                                <footer class="card-footer">
                                    {agenda.activity_categories.map(cat => <span style={{ background: cat.color, color: cat.color ? "white" : "" }} className="tag">{cat.name}</span>)}
                                </footer>
                            </div>
                        )
                        }
                    </div>
                </EventContent>
            </div>
        )
    }
}

export default Agenda