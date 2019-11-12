import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import Moment from "moment";
import {AgendaApi} from "../../helpers/request";
import EventContent from "../events/shared/content";
import SearchComponent from "../shared/searchTable";
import EvenTable from "../events/shared/table";

class ReportList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            days:[],
            day:"",
            filtered:[],
            toShow:[]
        }
    }

    componentDidMount() {
        const { event } = this.props;
        let days = [];
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        for(let i = 0; i < diff+1; i++){
            days.push(Moment(init).add(i,'d'))
        }
        this.setState({days, day:days[0]},this.fetchAgenda);
    }

    fetchAgenda = async() => {
        const {data} = await AgendaApi.byEvent(this.props.event._id);
        data.map(item=>{
            item.remaining_capacity = item.remaining_capacity ? item.remaining_capacity : item.capacity;
            return item;
        });
        const filtered = this.filterByDay(this.state.days[0],data);
        this.setState({list:data,filtered,toShow:filtered})
    };

    filterByDay = (day,agenda) => {
        //First filter activities by day. Use include to see if has the same day
        //Sort the filtered list by hour start, use moment format HHmm to get a number and used it to sort
        const list = agenda.filter(a => a.datetime_start.includes(day.format("YYYY-MM-DD")))
            .sort((a, b) => Moment(a.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm") - Moment(b.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm"));
        list.map(item=>{
            item.restriction = item.access_restriction_type === "EXCLUSIVE" ? "Exclusiva para: " : item.access_restriction_type === "SUGGESTED" ? "Sugerida para: " : "Abierta";
            item.roles = item.access_restriction_roles.map(({name})=>name);
            return item
        })
        return list
    };

    selectDay = (day) => {
        const filtered = this.filterByDay(day,this.state.list);
        this.setState({filtered,toShow:filtered,day})

    };

    searchResult = (data) => this.setState({toShow:!data?[]:data});

    render() {
        const {days,day,filtered,toShow} = this.state;
        return (
            <EventContent title={"CheckIn por Actividad"} classes={"agenda-list"}>
                <nav className="level">
                    <div className="level-left">
                        {
                            days.map((date,key)=> <div onClick={()=>this.selectDay(date)} key={key} className={`level-item date ${date===day?"active":""}`}>
                                    <p className="subtitle is-5">
                                        <strong>{date.format("MMM DD")}</strong>
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </nav>
                <SearchComponent data={filtered} placeholder={"por Nombre, Espacio o Conferencista"} kind={'agenda'} classes={"field"} searchResult={this.searchResult}/>
                <div className="checkin-warning">
                    <p className="is-size-7 has-text-right has-text-centered-mobile">Para actualizar valores, refrescar la página</p>
                </div>
                <EvenTable head={["Hora", "Actividad", "Registrados", "Cupos libres", "Capacidad", ""]} headStyle={[{width:"12%"},{width:"52%"},{width:"12%"},{width:"12%"},{width:"12%"}]}>
                    {toShow.map(agenda=><tr key={agenda._id}>
                        <td>{Moment(agenda.datetime_start,"YYYY-MM-DD HH:mm").format("HH:mm")} - {Moment(agenda.datetime_end,"YYYY-MM-DD HH:mm").format("HH:mm")}</td>
                        <td>
                            <p>{agenda.name}</p>
                            {agenda.type&&<p><strong>{agenda.type.name}</strong></p>}
                        </td>
                        <td>{agenda.capacity-agenda.remaining_capacity}</td>
                        <td>{agenda.remaining_capacity}</td>
                        <td>{agenda.capacity}</td>
                        <td>
                            <Link to={{pathname:`${this.props.url}/checkin/${agenda._id}`,state:{name:agenda.name}}}>
                                <button><span className="icon"><i className="fas fa-2x fa-chevron-right"/></span></button>
                            </Link>
                        </td>
                    </tr>)}
                </EvenTable>
            </EventContent>
        )
    }
}

export default withRouter(ReportList)
