import React, {Component} from 'react';
import Moment from "moment";
import {DateTimePicker} from "react-widgets";

class AgendaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDay:true,
            days:[]
        }
    }

    async componentDidMount() {
        const { event } = this.props;
        let days = [];
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        for(let i = 0; i < diff+1; i++){
            days.push(Moment(init).add(i,'d'))
        }
        this.setState({days});
    }

    handleChange = (e) => {
        const {name} = e.target;
        const {value} = e.target;
        this.setState({[name]:value});
    };

    handleBox = (e) => {
        const {name} = e.target;
        this.setState((prevState) => {
            return {[name]:!prevState[name]}
        });
    };

    render() {
        console.log(this.props);
        return (
            <div>
                <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control">
                        <input className="input is-rounded" type="text" name={"name"} onChange={this.handleChange} placeholder="Evius.co"/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Día</label>
                    <div className="control">
                        <div className="select">
                            <select>
                                <option>Seleccione día</option>{
                                this.state.days.map((day,key)=>{
                                    return <option key={key}>{Moment(day).format('DD/MM/YY')}</option>
                                })
                            }
                            </select>
                        </div>
                    </div>
                </div>
                <h2>Horario</h2>
                <div className="field">
                    <input id="switchRoundedOutlinedDefault" type="checkbox"
                           name="allDay" className="switch is-rounded is-outlined"
                           checked={this.state.allDay} onClick={this.handleBox}/>
                        <label htmlFor="switchRoundedOutlinedDefault">Todo El Día</label>
                </div>
                {
                    !this.state.allDay && (
                        <div className="columns">
                            <div className="column">
                                <div className="field">
                                    <label className="label">Hora Inicio</label>
                                    <div className="control">
                                        <DateTimePicker
                                            dropUp step={60}
                                            date={false}
                                            onChange={value => this.changeDate(value,"hour_start")}/>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="field">
                                    <label className="label">Hora Fin</label>
                                    <DateTimePicker
                                        dropUp step={60}
                                        date={false}
                                        onChange={value => this.changeDate(value,"hour_end")}/>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default AgendaEdit;