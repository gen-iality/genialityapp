import React, {Component} from 'react';
import Moment from "moment"
import "moment/src/locale/es"

class SendRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rsvp:{}
        }
    }

    componentDidMount(){
        console.log(this.props.event);
        this.setState({
            rsvp:{...this.state.rsvp,name:this.props.event.name,message:this.props.event.description}
        })
    }

    render() {
        return (
            <div className="columns">
                <div className="column is-10">
                    <div className="columns">
                        <div className="column box is-half is-offset-one-quarter">
                            <div className="field">
                                <label className="label">Objeto del correo (Por defecto será el nombre del evento)</label>
                                <div className="control">
                                    <input className="input" type="text" value={this.state.rsvp.name}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="content column has-text-centered is-half is-offset-one-quarter">
                            <p>
                                Hola "invitado", te invito a:
                                <br/>
                                <strong>{this.state.rsvp.name}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-offset-one-quarter">
                            <p>Fecha Inicio</p>
                            <p>{Moment(this.props.event.date_start).format('LL')}</p>
                        </div>
                        <div className="column">
                            <p>Hora</p>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-offset-one-quarter">
                            <p>Fecha Fin</p>
                            <p>{Moment(this.props.event.date_end).format('LL')}</p>
                        </div>
                        <div className="column">
                            <p>Hora</p>
                        </div>
                    </div>
                    <div className="columns">
                       <div className="column is-half is-offset-one-third">
                           <div className="columns">
                               <div className="column is-one-fifth">
                                 <span className="icon is-large has-text-grey">
                                    <i className="fas fa-map-marker-alt fa-3x"/>
                                </span>
                               </div>
                               <div className="column">
                                   Ubicación del evento
                                   <br/>
                                   {this.props.event.location}
                               </div>
                           </div>
                       </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <p>Sube una imagen (Por defecto será la del evento)</p>
                            <div>
                                <img src={this.props.event.picture} alt={'Imagen Perfil'}/>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <div className="field">
                                <label className="label">Cuerpo de la invitación (Por defecto será la descripción del evento)</label>
                                <div className="control">
                                    <textarea className="textarea" value={this.state.rsvp.message}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-4 is-offset-8">
                            <button className="button is-success">Enviar</button>
                        </div>
                    </div>
                </div>
                <div className="column box sendrsvp">
                    <strong>Seleccionados {this.props.selection.length}</strong>
                    <div className="rsvpusers">
                        {
                            this.props.selection.map((item,key)=>{
                                return <p key={key} className="selection">{item.email}</p>
                            })
                        }
                    </div>
                    <button className="button">Editar Seleccionados</button>
                </div>
            </div>
        );
    }
}

export default SendRsvp;