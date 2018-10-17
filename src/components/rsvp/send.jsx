import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Moment from "moment"
import 'moment/locale/es-us';
import {Actions, EventsApi} from "../../helpers/request";
import Dialog from "../modal/twoAction";
import ImageInput from "../shared/imageInput";
import LogOut from "../shared/logOut";
Moment.locale('es-us');

class SendRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rsvp:{}
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount(){
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

    uploadImg = () => {
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
                    },
                    imageFile: false
                });
            })
            .catch(e=>{
                console.log(e.response);
                this.setState({timeout:true,loader:false});
            });
    };

    handleChange = (e) => {
      let {name, value} = e.target;
        this.setState({
            rsvp:{...this.state.rsvp,[name]:value}
        })
    };

    async submit() {
        const { event, selection } = this.props;
        const { rsvp } = this.state;
        let users = [];
        selection.map(item=>{
            users.push(item.id)
        });
        this.setState({dataMail:users,disabled:true});
        try{
            const data = {subject:rsvp.subject,message:rsvp.message,image:rsvp.image,eventUsersIds:users};
            const resp = await EventsApi.sendRsvp(data,event._id);
            this.setState({disabled:false,redirect:true,url_redirect:'/event/'+event._id+'/messages'})
        }catch (e) {
            console.log(e);
            this.setState({disabled:false,timeout:true,loader:false});
        }
    };

    render() {
        const { timeout, disabled } = this.state;
        if(this.state.redirect) return (<Redirect to={{pathname: this.state.url_redirect}} />);
        return (
            <div className="columns">
                <div className="column is-10">
                    <div className="columns">
                        <div className="column box is-half is-offset-one-quarter">
                            <div className="field">
                                <label className="label">Objeto del correo (Por defecto será el nombre del evento)</label>
                                <div className="control">
                                    <input className="input" type="text" name="subject" onChange={this.handleChange} value={this.state.rsvp.subject}/>
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
                                    <p className="date">{Moment(this.props.event.datetime_from).format('DD MMM, YYYY')}</p>
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
                                    <p>{Moment(this.props.event.datetime_from).format('HH:mm')}</p>
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
                                    <p className="date">{Moment(this.props.event.datetime_to).format('DD MMM, YYYY')}</p>
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
                                    <p>{Moment(this.props.event.datetime_to).format('HH:mm')}</p>
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
                                   {this.props.event.location.FormattedAddress}
                               </div>
                           </div>
                       </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <p>Sube una imagen (Por defecto será la del evento)</p>
                            <ImageInput picture={this.state.rsvp.image} imageFile={this.state.imageFile}
                                        divClass={'imgRsvp'} content={<img src={this.state.rsvp.image} alt={'Imagen Perfil'}/>}
                                        classDrop={'dropzone'} contentDrop={<button className={`button is-link is-inverted is-outlined ${this.state.imageFile?'is-loading':''}`}>Cambiar foto</button>}
                                        contentZone={<div>Subir foto</div>}
                                        changeImg={this.changeImg} errImg={this.state.errImg}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-half is-offset-one-quarter">
                            <div className="field">
                                <label className="label">Cuerpo de la invitación (Por defecto será la descripción del evento)</label>
                                <div className="control">
                                    <textarea className="textarea" value={this.state.rsvp.message} onChange={this.handleChange} name={"message"}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-4 is-offset-8">
                            <button className="button is-success" onClick={(e)=>{this.setState({modal:true})}}>Enviar</button>
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
                    <button className="button"
                            onClick={(e)=>{this.props.prevTab()}}>
                        Editar Seleccionados
                    </button>
                </div>
                <Dialog modal={this.state.modal} title={'Confirmación'}
                        content={<p>Se van a enviar {this.props.selection.length} invitaciones</p>}
                        first={{title:'Enviar',class:'is-info',action:this.submit,disabled:disabled}}
                        second={{title:'Cancelar',class:'',action:this.closeModal}}
                        message={{class:'',content:''}}/>
                {timeout&&(<LogOut/>)}
            </div>
        );
    }
}

export default SendRsvp;