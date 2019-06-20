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
            step:1,
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

    nextStep = (field,data) => {
        this.setState(prevState=>{
            return {[field]:data,step:prevState.step+1,stepsValid:{...prevState.stepsValid,[field]:true}}
        })
    };

    prevStep = (field,data) => {
        this.setState(prevState=>{
            return {[field]:data,step:prevState.step-1}
        })

    };

    render() {
        return (
            <section className="columns">
                <aside className="column menu event-aside is-2 has-text-weight-bold">
                    Nuevo Evento
                </aside>
                <div className="column event-main is-10">
                    <div className="steps">
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/main`}
                            className={`step-item ${(this.state.stepsValid.info&&this.state.step!==0)?'is-completed':''}`}>
                            <div className="step-marker">1</div>
                            <div className="step-details">
                                <p className="step-title">Información <br/> General</p>
                            </div>
                        </NavLink>
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/attendees`}
                            className={`step-item ${(this.state.stepsValid.fields)&&this.state.step!==1?'is-completed':''}`}>
                            <div className="step-marker">2</div>
                            <div className="step-details">
                                <p className="step-title">Información <br/> Asistentes</p>
                            </div>
                        </NavLink>
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/tickets`}
                            className={`step-item ${(this.state.stepsValid.tickets&&this.state.step!==2)?'is-completed':''}`}>
                            <div className="step-marker">3</div>
                            <div className="step-details">
                                <p className="step-title">Tiquetes</p>
                            </div>
                        </NavLink>
                        <NavLink activeClassName={"is-active"} to={`${this.props.match.url}/pages`}
                            className={`step-item ${(this.state.stepsValid.content&&this.state.step!==3)?'is-completed':''}`}>
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
