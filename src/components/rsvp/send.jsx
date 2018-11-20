import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Moment from "moment"
import 'moment/locale/es-us';
import {Actions, EventsApi} from "../../helpers/request";
import Dialog from "../modal/twoAction";
import ImageInput from "../shared/imageInput";
import LogOut from "../shared/logOut";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            this.setState({errImg:'Only images files allowed. Please try again :)'});
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
            return users.push(item.id)
        });
        this.setState({dataMail:users,disabled:true});
        try{
            const data = {subject:rsvp.subject,message:rsvp.message,image:rsvp.image,eventUsersIds:users};
            await EventsApi.sendRsvp(data,event._id);
            toast.success('Email sent successfully');
            this.setState({disabled:false,redirect:true,url_redirect:'/event/'+event._id+'/messages'})
        }catch (e) {
            console.log(e);
            toast.error('Something wrong. Try again later');
            this.setState({disabled:false,timeout:true,loader:false});
        }
    };

    closeModal = () => {
        this.setState((prevState)=>{
            return {modal:!prevState.modal}
        })
    };

    render() {
        const { timeout, disabled } = this.state;
        if(this.state.redirect) return (<Redirect to={{pathname: this.state.url_redirect}} />);
        return (
            <div className="columns event-rsvp">
                <div className="column is-8">
                    <div className="columns is-multiline is-centered">
                        <div className="column is-10">
                            <div className="box rsvp-subject">
                                <div className="field">
                                    <div className="rsvp-subject-txt">
                                        <label className="label">Asunto del correo <br/> <small>(Por defecto será el nombre del evento)</small></label>
                                        <i className="fa fa-info-circle info-icon"></i>
                                    </div>
                                    <div className="control">
                                        <input className="input" type="text" name="subject" placeholder="Escribe aquí el asunto del correo" onChange={this.handleChange} value={this.state.rsvp.subject}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="column is-10">
                            <div className="rsvp-title has-text-centered">
                                <h2 className="rsvp-title-txt">
                                    Hola "INVITADO", has sido invitado a:
                                    <br/>
                                    <span className="strong">{this.props.event.name}</span>
                                </h2>
                                
                            </div>
                        </div>

                        <div className="column is-10">
                            <div className="columns is-mobile is-multiline is-centered rsvp-date-wrapper">
                                <div className="column is-12">
                                    <div className="columns is-mobile is-centered">
                                        <div className="column">
                                            <div className="columns rsvp-date">
                                                <div className="column is-two-thirds">
                                                    <p>Fecha Inicio</p>
                                                    <p className="date">{Moment(this.props.event.datetime_from).format('DD MMM YYYY')}</p>
                                                </div>
                                                <div className="column is-one-third">
                                                <span className="icon is-large has-text-grey-lighter">
                                                    <i className="far fa-calendar-alt fa-2x"/>
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="vertical-line"></div>
                                        <div className="column">
                                            <div className="columns rsvp-date">
                                                <div className="column is-two-thirds">
                                                    <p>Hora</p>
                                                    <p className="date">{Moment(this.props.event.datetime_from).format('HH:mm')}</p>
                                                </div>
                                                <div className="column is-one-third">
                                                <span className="icon is-large has-text-grey-lighter">
                                                    <i className="far fa-clock fa-2x"/>
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="column is-12">
                                    <div className="columns is-mobile is-centered">
                                        <div className="column">
                                            <div className="columns rsvp-date">
                                                <div className="column is-two-thirds">
                                                    <p>Fecha Fin</p>
                                                    <p className="date">{Moment(this.props.event.datetime_to).format('DD MMM YYYY')}</p>
                                                </div>
                                                <div className="column is-one-third">
                                                <span className="icon is-large has-text-grey-lighter">
                                                    <i className="far fa-calendar-alt fa-2x"/>
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="vertical-line"></div>
                                        <div className="column">
                                            <div className="columns rsvp-date">
                                                <div className="column is-two-thirds">
                                                    <p>Hora</p>
                                                    <p className="date">{Moment(this.props.event.datetime_to).format('HH:mm')}</p>
                                                </div>
                                                <div className="column is-one-third">
                                                <span className="icon is-large has-text-grey-lighter">
                                                    <i className="far fa-clock fa-2x"/>
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="column is-10">
                            <div className="columns is-mobile is-centered rsvp-where">
                                <div className="column is-2 has-text-centered">
                                    <span className="icon is-large has-text-grey-lighter">
                                        <i className="fas fa-map-marker-alt fa-2x"/>
                                    </span>
                                </div>
                                <div className="column is-8">
                                    Ubicación del evento
                                    <br/>
                                    <span className="rsvp-location">{this.props.event.location.FormattedAddress}</span>
                                </div>
                            </div>
                        </div>

                        <div className="column is-10">
                            <div className="rsvp-pic">
                                <p className="rsvp-pic-txt">Sube una imagen <br/> <small>(Por defecto será la del evento)</small></p> 
                                <ImageInput picture={this.state.rsvp.image} imageFile={this.state.imageFile}
                                            divClass={'rsvp-pic-img'} content={<img src={this.state.rsvp.image} alt={'Imagen Perfil'}/>}
                                            classDrop={'dropzone'} contentDrop={<button className={`button is-primary is-inverted is-outlined ${this.state.imageFile?'is-loading':''}`}>Cambiar foto</button>}
                                            contentZone={<div>Subir foto</div>}
                                            changeImg={this.changeImg} errImg={this.state.errImg}/>
                            </div>
                        </div>

                        <div className="column is-10">
                            <div className="field rsvp-desc">
                                <label className="label">Cuerpo de la invitación <br/> <small>(Por defecto será la descripción del evento)</small></label>
                                <div className="control">
                                    <textarea className="textarea" value={this.state.rsvp.message} onChange={this.handleChange} name={"message"}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-10">
                            <div className="columns is-centered">
                                <div className="column has-text-centered">
                                    <button className="button is-primary" onClick={(e)=>{this.setState({modal:true})}}>Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column is-4">
                    <div className="box rsvp-send">
                        <div className="columns is-centered-is-multiline">
                            <div className="column">
                                <p className="rsvp-send-title">Seleccionados <span>{this.props.selection.length}</span></p>
                            </div>
                        </div>

                        <div className="column rsvp-send-users">
                            {
                                this.props.selection.map((item,key)=>{
                                    return <p key={key} className="selection">{item.email}</p>
                                })
                            }
                        </div>

                        <div className="column has-text-centered">
                            <button className="button is-primary"
                                    onClick={(e)=>{this.props.prevTab()}}>
                                Editar Seleccionados
                            </button>
                        </div>
                    </div>
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