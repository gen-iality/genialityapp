import React, { Component } from "react";
import EventContent from "../events/shared/content";
import Moment from "moment";
import EvenTable from "../events/shared/table";
import SearchComponent from "../shared/searchTable";
import { AgendaApi, SpacesApi, Actions } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import ReactQuill from "react-quill";
import { toolbarEditor } from "../../helpers/constants";

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            listDay: [],
            days: [],
            day: "",
            space: "",
            spaces: [],
            nameSpace: "",
            filtered: [],
            toShow: [],
            redirect: false,
            disabled: false
        }
        this.returnList = this.returnList.bind(this)
    }

    async componentDidMount() {
        //Se carga esta funcion para cargar los datos 
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
        // Se consulta a la api de agenda
        const { data } = await AgendaApi.byEvent(this.props.eventId);

        //se consulta la api de espacios para 
        let space = await SpacesApi.byEvent(this.props.event._id);

        //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
        const filtered = this.filterByDay(this.state.days[0], data);
        this.setState({ list: data, filtered, toShow: filtered, spaces: space })
    };

    returnList(){
        this.setState({toShow: this.state.listDay, nameSpace:"inicio"})
    }

    filterByDay = (day, agenda) => {
        //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
        const list = agenda.filter(a => a.datetime_start.includes(day.format("YYYY-MM-DD")))
            .sort((a, b) => Moment(a.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm") - Moment(b.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm"));
        this.setState({ listDay: list })

        //Se mapea la lista para poder retornar los datos ya filtrados
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

    //Funcion para ejecutar el filtro por espacio y mandar el espacio a filtrar
    selectSpace(space) {
        const filtered = this.filterBySpace(space, this.state.list);
        this.setState({ filtered, toShow: filtered, space })
    }

    //Funcion que realiza el filtro por espacio, teniendo en cuenta el dia
    filterBySpace = (space, dates) => {

        //Se filta la lista anterior para esta vez filtrar por espacio
        const list = this.state.listDay.filter(a => a.space.name === space);

        this.setState({ nameSpace: space })

        //Se mapea la lista para poder retornar la lista filtrada por espacio
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
        const { days, day, nameSpace, spaces, toShow } = this.state;
        return (
            <div>
                <div className="columns is-desktop ">        
                    <div style={{ float: "left" }}>
                    <button style={{ marginTop: "3%", marginBottom: "3%" }} className={`${nameSpace === "inicio" ? "button is-danger" : "button is-primary"}`} onClick={this.returnList}>Inicio</button>
                        {
                            spaces.map((space, key) => <div onClick={() => this.selectSpace(space.name, space.datetime_start, space.datetime_start)} key={key}>
                                <button disabled={false} style={{ marginTop: "3%", marginBottom: "3%" }} className={`${nameSpace === space.name ? "button is-danger" : "button is-primary"}`}>{space.name}</button>
                            </div>
                            )
                        }
                    </div>
                    <div className="column is-offset-1">
                        <nav className="level">
                            <div className="level-left">
                                {
                                    days.map((date, key) => <div onClick={() => this.selectDay(date)} key={key}>
                                        <button className={`level-item date ${date === day ? "button is-danger" : "button is-primary"}`}>{date.format("MMM DD")}</button>
                                    </div>
                                    )
                                }
                            </div>
                        </nav>
                        {toShow.map((agenda, key) =>
                            <div key={key} style={{ marginBottom: "5%" }}>
                                <div className="card">
                                    <header className="card-header">
                                        <p className="card-header-title">
                                            {agenda.name}
                                        </p>
                                    </header>
                                    <div className="card-content">
                                        <div className="content">
                                            <div>
                                                <strong>{agenda.datetime_start} - {agenda.datetime_end}</strong>
                                            </div>
                                            <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                                                <div dangerouslySetInnerHTML={{ __html: agenda.description }}></div>
                                                {agenda.space.name}
                                            </div>
                                            {agenda.hosts.map((speaker, key) =>
                                                <div key={key}>
                                                    <br style={{ marginTop: "5%" }} />
                                                    <strong>Conferencista</strong>
                                                    <p>{speaker.name}</p>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                                <footer className="card-footer">
                                    {agenda.activity_categories.map((cat, key) => <span key={key} style={{ background: cat.color, color: cat.color ? "white" : "" }} className="tag">{cat.name}</span>)}
                                </footer>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Agenda