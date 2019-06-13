import React, {Component} from "react";
import InfoGeneral from "./additionalDataEvent/InfoGeneral";
import InfoAsistentes from "./additionalDataEvent/infoAsistentes";
import Moment from "moment";
import InfoTiquetes from "./additionalDataEvent/infoTiquetes";

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step:0,
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
        const steps = [
            <InfoGeneral nextStep={this.nextStep} data={this.state.info}/>,
            <InfoAsistentes nextStep={this.nextStep} prevStep={this.prevStep} data={this.state.fields}/>,
            <InfoTiquetes nextStep={this.nextStep} prevStep={this.prevStep}/>
        ];
        return (
            <div>
                <div className="steps">
                    <div className={`step-item ${this.state.step===0?'is-active':''} ${(this.state.stepsValid.info&&this.state.step!==0)?'is-completed':''}`}>
                        <div className="step-marker">1</div>
                        <div className="step-details">
                            <p className="step-title">Información <br/> General</p>
                        </div>
                    </div>
                    <div className={`step-item ${this.state.step===1?'is-active':''} ${(this.state.stepsValid.fields)&&this.state.step!==1?'is-completed':''}`}>
                        <div className="step-marker">2</div>
                        <div className="step-details">
                            <p className="step-title">Información <br/> Asistentes</p>
                        </div>
                    </div>
                    <div className={`step-item ${this.state.step===2?'is-active':''} ${(this.state.stepsValid.tickets&&this.state.step!==2)?'is-completed':''}`}>
                        <div className="step-marker">3</div>
                        <div className="step-details">
                            <p className="step-title">Tiquetes</p>
                        </div>
                    </div>
                    <div className={`step-item ${this.state.step===3?'is-active':''} ${(this.state.stepsValid.content&&this.state.step!==3)?'is-completed':''}`}>
                        <div className="step-marker">4</div>
                        <div className="step-details">
                            <p className="step-title">Contenidos</p>
                        </div>
                    </div>
                </div>
                {
                    steps[this.state.step]
                }
            </div>
        )
    }
}

export default NewEvent