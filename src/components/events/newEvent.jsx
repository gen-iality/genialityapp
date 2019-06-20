import React, {Component} from "react";
import {NavLink, withRouter, Switch, Route, Redirect} from "react-router-dom";
import InfoGeneral from "./additionalDataEvent/InfoGeneral";
import InfoAsistentes from "./additionalDataEvent/infoAsistentes";
import Moment from "moment";
import InfoTiquetes from "./additionalDataEvent/infoTiquetes";
import Pages from "../pages";

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info:{name:'',location:{}, description: '', category_ids: [], venue: '',event_type_id: "",
                hour_start : Moment().toDate(), date_start : Moment().toDate(), hour_end : Moment().toDate(), date_end : Moment().toDate()
            },
            fields:{
                properties_group:[],
                user_properties:[]
            },
            tickets:{},
            content:[],
            stepsValid:{
                info:false,
                fields:false,
                tickets:false,
                content:false
            }
        }
    }

    nextStep = (field,data,next) => {
        this.setState(prevState=>{
            return {[field]:data,stepsValid:{...prevState.stepsValid,[field]:true}}
        },()=>{
            this.goTo(next)
        })
    };

    prevStep = (field,data,prev) => {
        this.setState({[field]:data},()=>{
            this.goTo(prev)
        })

    };

    goTo = (route) => {
        this.props.history.push(`${this.props.match.url}/${route}`)
    };

    render() {
        return (
            <section className="columns">
                <aside className="column menu event-aside is-2 has-text-weight-bold">
                    Nuevo Evento
                </aside>
                <div className="column event-main is-10">
                    <div className="steps">
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/main`} onClick={e=>{e.preventDefault()}}
                                 className={`step-item ${(this.state.stepsValid.info)?'is-completed':''}`}>
                            <div className="step-marker">1</div>
                            <div className="step-details">
                                <p className="step-title">Información <br/> General</p>
                            </div>
                        </NavLink>
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/attendees`} onClick={e=>{e.preventDefault()}}
                                 className={`step-item ${(this.state.stepsValid.fields)?'is-completed':''}`}>
                            <div className="step-marker">2</div>
                            <div className="step-details">
                                <p className="step-title">Información <br/> Asistentes</p>
                            </div>
                        </NavLink>
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/tickets`} onClick={e=>{e.preventDefault()}}
                                 className={`step-item ${(this.state.stepsValid.tickets)?'is-completed':''}`}>
                            <div className="step-marker">3</div>
                            <div className="step-details">
                                <p className="step-title">Tiquetes</p>
                            </div>
                        </NavLink>
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/pages`} onClick={e=>{e.preventDefault()}}
                                 className={`step-item ${(this.state.stepsValid.content)?'is-completed':''}`}>
                            <div className="step-marker">4</div>
                            <div className="step-details">
                                <p className="step-title">Contenidos</p>
                            </div>
                        </NavLink>
                    </div>
                    <Switch>
                        <Route exact path={`${this.props.match.url}/`} render={()=><Redirect to={`${this.props.match.url}/main`} />}/>
                        <Route exact path={`${this.props.match.url}/main`} render={()=>
                            <InfoGeneral nextStep={this.nextStep} data={this.state.info}/>}/>
                        <Route path={`${this.props.match.url}/attendees`} render={()=>
                            <InfoAsistentes nextStep={this.nextStep} prevStep={this.prevStep} data={this.state.fields}/>}/>
                        <Route path={`${this.props.match.url}/tickets`} render={()=>
                            <InfoTiquetes nextStep={this.nextStep} prevStep={this.prevStep}/>}/>
                        <Route path={`${this.props.match.url}/pages`} render={()=>
                            <Pages/>}/>
                    </Switch>
                </div>
            </section>
        )
    }
}

export default withRouter(NewEvent)
