import React, {Component} from 'react';
import  { Link } from 'react-router-dom';
import  { Redirect } from 'react-router';
import * as Cookie from "js-cookie";
import {AuthUrl, BaseUrl} from "../helpers/constants";
import {Actions} from "../helpers/request";
import axios from "axios";
import Dialog from "../components/modal/twoAction";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            name: 'user',
            user: false,
            open: false,
            timeout: false,
            modal: false,
            loader: true,
            create: false,
            valid: true
        };
        this.newEvent = this.newEvent.bind(this);
    }

    async componentDidMount(){
        let evius_token = Cookie.get('evius_token');
        if(!evius_token) {
            this.setState({user:false,loader:false});
        }
        else {
            axios.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`)
                .then((resp) => {
                    console.log(resp);
                    const data = resp.data;
                    const name = (data.displayName) ? data.displayName: data.email;
                    this.setState({name,user:true,cookie:evius_token,loader:false});
                })
                .catch(error => {
                    console.log(error);
                    console.log(error.response);
                    this.setState({timeout:true});
                });
        }
    }

    logout = () => {
        Cookie.remove("token");
        Cookie.remove("evius_token");
        window.location.replace(`${AuthUrl}/logout`);
    };

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]:value},this.isValid)
    };

    isValid = () => {
        const valid = !(this.state.event && this.state.event.length > 0);
        this.setState({valid})
    };

    async newEvent() {
        this.setState({create:true});
        let result = await Actions.create(
            '/api/user/events',
            {name:this.state.event}
        );
        console.log(result);
        if(result._id){
            window.location.replace(`${BaseUrl}/edit/${result._id}/general`);
        }else{
            this.setState({msg:'Cant Create',create:false})
        }
    };

    openMenu = () => {
        this.setState((prevState) => {
            return {open:!prevState.open}
        });
    };

    closeModal = () => {
        Cookie.remove("token");
        Cookie.remove("evius_token");
        this.setState((prevState)=>{
            return {timeout:!prevState.timeout,user:false}
        })
    };

    render() {
        const { redirectToReferrer, timeout } = this.state;
        const icon = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1128 193" style="enable-background:new 0 0 1128 193;" xml:space="preserve"> <g> <path className="st0" d="M318.4,8.6l-68,174.7c-0.8,2.3-2,3.1-4.3,3.1h-4.8c-2.5,0-3.6-0.8-4.3-2.8l-68-175c-0.8-1.8-0.3-3.1,2-3.1h4.8c3.8,0,4.8,0.5,5.6,2.8l56.6,146.4c2.3,6.4,4.3,13.8,5.6,17.1h0.8c1.3-3.3,3.1-10.4,5.3-17.1L305.9,8.4c0.8-2.3,2-2.8,5.6-2.8h4.8C318.9,5.6,319.2,6.8,318.4,8.6"/> <path className="st0" d="M396.8,5.6h5.3c2.3,0,3.1,0.8,3.1,3.3v174.2c0,2.5-0.8,3.3-3.1,3.3h-5.3c-2.6,0-3.3-0.8-3.3-3.3V8.9C393.5,6.3,394.3,5.6,396.8,5.6"/> <path className="st0" d="M563.6,179.3c37.2,0,55.3-21.1,55.3-54V8.9c0-2.5,0.8-3.3,3.1-3.3h5.6c2.3,0,3.1,0.8,3.1,3.3v116.4c0,39.5-22.1,64.9-67,64.9c-45.1,0-67.2-25.5-67.2-64.9V8.9c0-2.5,0.8-3.3,3.3-3.3h5.3c2.3,0,3.1,0.8,3.1,3.3v116.4C508.1,158.1,526.1,179.3,563.6,179.3"/> <path className="st0" d="M779,2c34.1,0,53.5,12.5,66.7,39.5c1.3,2.3,0.5,3.6-1.5,4.3l-5.1,2.3c-2,0.8-2.8,0.8-4.1-1.5c-11.5-22.7-27.5-33.4-56-33.4c-32.9,0-52,14.3-52,38.7c0,30.1,28.3,34.9,57.1,38c31.1,3.6,63.4,8.9,63.4,48.1c0,33.1-22.9,52-67.2,52c-35.7,0-56.3-14.3-68.5-44.6c-1-2.6-0.8-3.6,1.8-4.6l4.8-1.8c2.3-0.8,3.1-0.5,4.3,2c11,25.7,29,37.7,57.6,37.7c36.7,0,55.5-13.2,55.5-40.2c0-30-26.5-33.9-54.2-37.2c-31.8-3.8-66.5-9.2-66.5-48.6C715,21.6,738.7,2,779,2"/> <path className="st0" d="M108.2,17.8H3.7C3.3,17.8,3,17.4,3,17V5.8C3,5.4,3.3,5,3.7,5h104.4c0.4,0,0.7,0.3,0.7,0.7V17C108.9,17.4,108.6,17.8,108.2,17.8"/> <path className="st0" d="M108.2,102.3H3.7c-0.4,0-0.7-0.3-0.7-0.7V90.3c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7v11.2C108.9,101.9,108.6,102.3,108.2,102.3"/> <path className="st0" d="M108.2,186.8H3.7c-0.4,0-0.7-0.3-0.7-0.7v-11.2c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7V186C108.9,186.5,108.6,186.8,108.2,186.8"/> <rect x="3" y="161.3" className="st0" width="12.7" height="15.4"/> <text transform="matrix(1 0 0 1 871.8398 189.939)"><tspan x="0" y="0" className="st0 st1 st2 st3">.C</tspan><tspan x="159.4" y="0" className="st0 st1 st2">O</tspan></text> </g> </svg>';
        if (redirectToReferrer) {
            return <Redirect to={this.state.route} />;
        }
        return (
            <React.Fragment>
                <header>
                    <nav className="navbar is-fixed-top has-shadow is-spaced">
                        <div className="navbar-brand">
                            <Link className="navbar-item" to={'/'}>
                                <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }}/>
                            </Link>
                            <div className="navbar-burger burger" data-target="navbarExampleTransparentExample" onClick={this.openMenu}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div id="navbarExampleTransparentExample" className={`navbar-menu ${this.state.open ? "is-active" : ""}`}>
                            <div className="navbar-start">
                                <a className="navbar-item" href="https://google.com">Help</a>
                            </div>
                            <div className="navbar-end">
                                <div className="navbar-item">
                                    <button className="button is-primary" onClick={(e)=>{this.setState({modal:true})}} disabled={!this.state.user}>Crear Evento</button>
                                </div>
                                {
                                    this.state.loader ?
                                        <div>Wait...</div>:
                                        this.state.user ?
                                            <div className="navbar-item has-dropdown is-hoverable">
                                                <a className="navbar-link">
                                                    {this.state.name}
                                                </a>
                                                <div className="navbar-dropdown is-boxed">
                                                    <a className="navbar-item">
                                                        Mi Perfil
                                                    </a>
                                                    <Link className="navbar-item" to={"/mis_eventos"}>
                                                        Mis Eventos
                                                    </Link>
                                                    <a className="navbar-item" href="https://bulma.io/documentation/columns/basics/">
                                                        Mis Organizaciones
                                                    </a>
                                                    <hr className="navbar-divider"/>
                                                    <a className="navbar-item" onClick={this.logout}>
                                                        Salir
                                                    </a>
                                                </div>
                                            </div>:
                                            <div className="navbar-item">
                                                <button className="button is-link" onClick={this.logout}>Ingresar</button>
                                            </div>
                                }
                            </div>
                        </div>
                    </nav>
                </header>
                <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Nuevo Evento</p>
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
                                            <input className="input is-rounded" type="text" name={"event"} onChange={this.handleChange} placeholder="Evius.co"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                <Dialog modal={timeout} title={'Sesión Expiró'}
                        content={<p>Tu sesión ha expirado. Inicia sesión de nuevo o sigue mirando eventos</p>}
                        first={{title:'Iniciar Sesión',class:'is-info',action:this.logout}}
                        second={{title:'Mirar eventos',class:'',action:this.closeModal}}
                        message={{class:'',content:''}}/>
            </React.Fragment>
        );
    }
}

export default Header;