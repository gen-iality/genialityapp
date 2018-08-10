import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Moment from "moment"
Moment.locale('es');

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect:false,
            url_redirect:'',
            modal:false
        }
    }

    handleChange = (e) => {
        const {name} = e.target;
        const {value} = e.target;
        this.setState({[name]:value});
    };

    createAgenda = () => {
        const { event } = this.props;
        this.setState({redirect:true,url_redirect:'/edit/'+event._id+'/agenda/asdasd'})
    };

    render() {
        if(this.state.redirect) return (<Redirect to={{pathname: this.state.url_redirect}} />);
        return (
            <React.Fragment>
                <button className="button is-outlined" onClick={()=>{this.setState({modal:true})}}>Agregar </button>
                <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Agenda</p>
                            <button className="delete" aria-label="close" onClick={()=>{this.setState({modal:false})}}/>
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
                        </section>
                        <footer className="modal-card-foot">
                            {
                                this.state.create?<div>Creando...</div>:
                                    <div>
                                        <button className="button is-success" onClick={this.createAgenda} disabled={this.state.valid}>Crear</button>
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