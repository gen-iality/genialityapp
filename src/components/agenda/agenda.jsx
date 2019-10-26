import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import EventContent from "../events/shared/content";

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            redirect:false
        }
    }

    async componentDidMount() {}

    redirect = () => this.setState({redirect:true});

    render() {
        if(this.state.redirect) return <Redirect to={`${this.props.matchUrl}/actividad`}/>;
        const {list} = this.state;
        return (
            <EventContent title={"Programación"} addAction={list.length>0?this.redirect:false} addTitle={"Nueva actividad"}>
                {
                    list.length <= 0 ?
                        <div className="empty">
                            <p>Agregue una actividad para la programación</p>
                            <Link to={{pathname:`${this.props.matchUrl}/actividad`,state:{new:true}}}>Nueva actividad</Link>
                        </div>:
                        <p>Listado</p>
                }
            </EventContent>
        )
    }
}

export default Agenda
