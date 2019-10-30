import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import EventContent from "../events/shared/content";
import {AgendaApi} from "../../helpers/request";

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            redirect:false
        }
    }

    async componentDidMount() {
        const {data} = await AgendaApi.byEvent(this.props.event._id);
        this.setState({list:data})
    }

    redirect = () => this.setState({redirect:true});

    render() {
        if(this.state.redirect) return <Redirect to={{pathname:`${this.props.matchUrl}/actividad`,state:{new:true}}}/>;
        const {list} = this.state;
        return (
            <EventContent title={"Programación"} addAction={list.length>0?this.redirect:false} addTitle={"Nueva actividad"}>
                {
                    list.length <= 0 ?
                        <div className="empty">
                            <p>Agregue una actividad para la programación</p>
                            <Link to={{pathname:`${this.props.matchUrl}/actividad`,state:{new:true}}}>Nueva actividad</Link>
                        </div>:
                        <div>
                            {
                                list.map(i=><div key={i._id}>
                                    <p>{i.name}</p>
                                    <Link to={{pathname:`${this.props.matchUrl}/actividad`,state:{edit:i._id}}}>Editar</Link>
                                </div>)
                            }
                        </div>
                }
            </EventContent>
        )
    }
}

export default Agenda
