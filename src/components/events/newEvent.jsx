import React, {Component} from "react";
import {NavLink, withRouter, Switch, Route, Redirect} from "react-router-dom";
import InfoGeneral from "./additionalDataEvent/InfoGeneral";
import InfoAsistentes from "./additionalDataEvent/infoAsistentes";
import Moment from "moment";
import InfoTiquetes from "./additionalDataEvent/infoTiquetes";
import Pages from "../pages";
import {Actions, EventsApi} from "../../helpers/request";
import {toast} from "react-toastify";
import {FormattedMessage} from "react-intl";
import {BaseUrl} from "../../helpers/constants";

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info:{name:'',location:{}, description: '', category_ids: [], venue: '',event_type_id: "",
                hour_start : Moment().toDate(), date_start : Moment().toDate(), hour_end : Moment().toDate(), date_end : Moment().toDate()
            },
            fields:[],
            tickets:{},
            content:[],
            stepsValid:{
                info:false,
                fields:false
            }
        }
        this.saveEvent = this.saveEvent.bind(this)
    }

    nextStep = (field,data,next) => {
        this.setState(prevState=>{
            return {[field]:data,stepsValid:{...prevState.stepsValid,[field]:true}}
        },()=>{
            this.goTo(next)
        })
    };

    async saveEvent(fields) {
        const { info } = this.state;
        const self = this;
        //this.setState({loading:true});
        const hour_start = Moment(info.hour_start).format('HH:mm');
        const date_start = Moment(info.date_start).format('YYYY-MM-DD');
        const hour_end = Moment(info.hour_end).format('HH:mm');
        const date_end = Moment(info.date_end).format('YYYY-MM-DD');
        const datetime_from = Moment(date_start+' '+hour_start, 'YYYY-MM-DD HH:mm');
        const datetime_to = Moment(date_end+' '+hour_end, 'YYYY-MM-DD HH:mm');
        const data = {
            name: info.name,
            datetime_from : datetime_from.format('YYYY-MM-DD HH:mm:ss'),
            datetime_to : datetime_to.format('YYYY-MM-DD HH:mm:ss'),
            picture: info.picture,
            venue: info.venue,
            location: info.location,
            visibility: info.visibility?info.visibility:'PUBLIC',
            description: info.description,
            category_ids: info.categories,
            organizer_id: info.organizer_id,
            event_type_id : info.event_type_id,
            user_properties : [...fields]
        };
        try{
            const result = await Actions.create('/api/events', data);
            console.log(result);
            this.setState({loading:false});
            if(result._id){
                window.location.replace(`${BaseUrl}/event/${result._id}`);
            }else{
                toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk"/>);
                this.setState({msg:'Cant Create',create:false})
            }
        }catch (error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
            if (error.response) {
                console.log(error.response);
                const {status,data} = error.response;
                console.log('STATUS',status,status === 401);
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false,errorData:data})
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                if(error.request) {
                    console.log(error.request);
                    errorData = error.request
                };
                errorData.status = 708;
                this.setState({serverError:true,loader:false,errorData})
            }
            console.log(error.config);
        }
    }

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
            <div className="event-main">
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
                </div>
                <Switch>
                    <Route exact path={`${this.props.match.url}/`} render={()=><Redirect to={`${this.props.match.url}/main`} />}/>
                    <Route exact path={`${this.props.match.url}/main`} render={()=>
                        <InfoGeneral nextStep={this.nextStep} data={this.state.info}/>}/>
                    <Route path={`${this.props.match.url}/attendees`} render={()=>
                        <InfoAsistentes nextStep={this.saveEvent} prevStep={this.prevStep} data={this.state.fields}/>}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(NewEvent)
