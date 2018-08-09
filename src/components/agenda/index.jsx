import React, {Component} from 'react';
import {DateTimePicker} from "react-widgets";
import Moment from "moment"
Moment.locale('es');

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:false,
            allDay:true,
            days:[]
        }
    }

    async componentDidMount() {
        const { event } = this.props;
        console.log(event);
        let days = [];
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        for(let i = 0; i < diff+1; i++){
            days.push(Moment(init).add(i,'d').format('ll'))
        }
        console.log(days);
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
        return (
            <React.Fragment>
                <button className="button is-outlined" onClick={(e)=>{this.setState({modal:true})}}>Agregar </button>
                <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Agenda</p>
                            <button className="delete" aria-label="close" onClick={(e)=>{this.setState({modal:false})}}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">Nombre</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                            <input className="input is-rounded" type="text" name={"name"} onChange={this.handleChange} placeholder="Evius.co"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2>Día</h2>
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
                                                        step={60}
                                                        date={false}
                                                        onChange={value => this.changeDate(value,"hour_start")}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="field">
                                                <label className="label">Hora Fin</label>
                                                <DateTimePicker
                                                    step={60}
                                                    date={false}
                                                    onChange={value => this.changeDate(value,"hour_end")}/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </section>
                        <footer className="modal-card-foot">
                            {
                                this.state.create?<div>Creando...</div>:
                                    <div>
                                        <button className="button is-success" onClick={this.newEvent} disabled={this.state.valid}>Crear</button>
                                        <button className="button" onClick={(e)=>{this.setState({modal:false})}}>Cancel</button>
                                    </div>
                            }
                            <p className="help is-danger">{this.state.msg}</p>
                        </footer>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Agenda;