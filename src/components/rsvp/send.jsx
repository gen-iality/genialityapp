import React, {Component} from 'react';
import Moment from "moment"
import 'moment/locale/es-us';
import Dropzone from "react-dropzone";
import {Actions} from "../../helpers/request";
Moment.locale('es-us');

class SendRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rsvp:{}
        };
        this.uploadImg = this.uploadImg.bind(this)
    }

    componentDidMount(){
        console.log(this.props.event);
        this.setState({
            rsvp:{...this.state.rsvp,subject:this.props.event.name,message:this.props.event.description,image:this.props.event.picture}
        })
    }

    changeImg = (files) => {
        const file = files[0];
        if(file){
            this.setState({imageFile:file});
            this.uploadImg()
        }else{
            this.setState({errImg:'Only images files allowed. Please try again (:'});
        }
    };

    async uploadImg() {
        console.log('MAKE THE AXIOS REQUEST');
        let data = new FormData();
        const url = '/api/files/upload',
            self = this;
        data.append('file',this.state.imageFile);
        Actions.post(url, data)
            .then((image) => {
                self.setState({
                    rsvp: {
                        ...self.state.rsvp,
                        image: image
                    }
                });
            });
    };

    handleChange = (e) => {
      const {name, value} = e.target;this.setState({
            rsvp:{...this.state.rsvp,[name]:value}
        })
    };

    render() {
        return (
            <div className="columns">
                <div className="column is-10">
                    <div className="columns">
                        <div className="column box is-half is-offset-one-quarter">
                            <div className="field">
                                <label className="label">Objeto del correo (Por defecto será el nombre del evento)</label>
                                <div className="control">
                                    <input className="input" type="text" name={"subject"} onClick={this.handleChange} value={this.state.rsvp.subject}/>
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
                            <div className="columns rsvpDate">
                                <div className="column">
                                    <p>Fecha Inicio</p>
                                    <p>{Moment(this.props.event.date_start).format('DD MMM, YYYY')}</p>
                                </div>
                                <div className="column">
                                   <span className="icon is-large has-text-grey">
                                       <i className="far fa-calendar-alt fa-2x"/>
                                   </span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="columns">
                                <div className="column">
                                    <p>Hora</p>
                                    <p>{Moment(this.props.event.hour).format('HH:mm')}</p>
                                </div>
                                <div className="column">
                                   <span className="icon is-large has-text-grey">
                                       <i className="far fa-clock fa-2x"/>
                                   </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-offset-one-quarter">
                            <div className="columns rsvpDate">
                                <div className="column">
                                    <p>Fecha Fin</p>
                                    <p>{Moment(this.props.event.date_end).format('DD MMM, YYYY')}</p>
                                </div>
                                <div className="column">
                                   <span className="icon is-large has-text-grey">
                                       <i className="far fa-calendar-alt fa-2x"/>
                                   </span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="columns">
                                <div className="column">
                                    <p>Hora</p>
                                </div>
                                <div className="column">
                                   <span className="icon is-large has-text-grey">
                                       <i className="far fa-clock fa-2x"/>
                                   </span>
                                </div>
                            </div>
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
                            <div className="imgRsvp">
                                <img src={this.state.rsvp.image} alt={'Imagen Perfil'}/>
                                <Dropzone accept="image/*" onDrop={this.changeImg} className="dropzone">
                                    <button className={`button is-link is-inverted is-outlined ${this.state.imageFile?'is-loading':''}`}>Cambiar foto</button>
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <div className="field">
                                <label className="label">Cuerpo de la invitación (Por defecto será la descripción del evento)</label>
                                <div className="control">
                                    <textarea className="textarea" value={this.state.rsvp.message} onClick={this.handleChange} name={"message"}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <div className="field">
                                <label className="label">Pie de la invitación (Opcional)</label>
                                <div className="control">
                                    <input className="input" type={"text"} value={this.state.rsvp.footer} onClick={this.handleChange} name={"footer"}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-4 is-offset-8">
                            <button className="button is-success" onClick={(e)=>{this.props.rsvpTab(this.state.rsvp)}}>Enviar</button>
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