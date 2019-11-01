import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import EventContent from "../events/shared/content";
import {AgendaApi} from "../../helpers/request";
import Moment from "moment";
import EvenTable from "../events/shared/table";
import {handleRequestError, sweetAlert} from "../../helpers/utils";

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            days:[],
            day:"",
            filtered:[],
            redirect:false
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
        this.setState({days},this.fetchAgenda);
    }

    fetchAgenda = async() => {
        const {data} = await AgendaApi.byEvent(this.props.event._id);
        const filtered = this.filterByDay(this.state.days[0],data);
        this.setState({list:data,day:this.state.days[0],filtered})
    };

    filterByDay = (day,agenda) => {
        //First filter activities by day. Use include to see if has the same day
        //Sort the filtered list by hour start, use moment format HHmm to get a number and used it to sort
        return agenda.filter(a => a.datetime_start.includes(day.format("YYYY-MM-DD")))
            .sort((a, b) => Moment(a.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm") - Moment(b.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm"))
    };

    selectDay = (day) => {
        const filtered = this.filterByDay(day,this.state.list);
        this.setState({filtered,day})

    };

    remove = (info) => {
        sweetAlert.twoButton(`Está seguro de borrar a ${info.name}`, "warning", true, "Borrar", async (result)=>{
            try{
                if(result.value){
                    sweetAlert.showLoading("Espera (:", "Borrando...");
                    await AgendaApi.deleteOne(info._id, this.props.eventID);
                    this.fetchAgenda();
                    sweetAlert.hideLoading();
                    sweetAlert.showSuccess("Actividad borrada")
                }
            }catch (e) {
                sweetAlert.showError(handleRequestError(e))
            }
        })
    };

    redirect = () => this.setState({redirect:true});

    render() {
        if(this.state.redirect) return <Redirect to={{pathname:`${this.props.matchUrl}/actividad`,state:{new:true}}}/>;
        const {days,day,filtered} = this.state;
        return (
            <EventContent title={"Programación"} classes={"agenda-list"} addAction={this.redirect} addTitle={"Nueva actividad"}>
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
                    <div className="level-right">

                    </div>
                </nav>
                <EvenTable head={["Hora", "Actividad", "Espacio", "Conferencista", ""]}>
                    {filtered.map(agenda=><tr key={agenda._id}>
                        <td>{Moment(agenda.datetime_start,"YYYY-MM-DD HH:mm").format("HH:mm")} - {Moment(agenda.datetime_end,"YYYY-MM-DD HH:mm").format("HH:mm")}</td>
                        <td>
                            <p>{agenda.name}</p>
                            {agenda.activity_categories.map(cat=><span style={{background:cat.color,color:cat.color?"white":""}} className="tag">{cat.name}</span>)}
                            {agenda.type&&<p><strong>{agenda.type.name}</strong></p>}
                        </td>
                        <td>{agenda.space?agenda.space.name:""}</td>
                        <td>{agenda.hosts.map(({name})=><p>{name}</p>)}</td>
                        <td>
                            <Link to={{pathname:`${this.props.matchUrl}/actividad`,state:{edit:agenda._id}}}>
                                <button><span className="icon has-text-grey"><i className="fas fa-edit"/></span></button>
                            </Link>
                            <button>
                                <span className="icon has-text-grey"
                                      onClick={(e)=>{this.remove(agenda)}}><i className="far fa-trash-alt"/></span>
                            </button>
                        </td>
                    </tr>)}
                </EvenTable>
            </EventContent>
        )
    }
}

export default Agenda
