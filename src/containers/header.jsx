import React, {Component} from 'react';
import  { Link } from 'react-router-dom';
import  { Redirect } from 'react-router';
import * as Cookie from "js-cookie";
import {AuthUrl, BaseUrl} from "../helpers/constants";
import {Actions} from "../helpers/request";
import axios from "axios";
import Dialog from "../components/shared/modal/twoAction";

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
                    const {data} = error.response;
                    console.log(data);
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
        const valid = !(this.state.name && this.state.name.length > 0);
        this.setState({valid})
    };

    async newEvent() {
        this.setState({create:true});
        let result = await Actions.create(
            '/api/user/events',
            {name:this.state.event}
        );
        if(result._id){
            window.location.replace(`${BaseUrl}edit/${result._id}`);
        }else{
            this.setState({msg:'Cant Create',create:false})
        }
    };

    openMenu = () => {
        this.setState((prevState) => {
            return {open:!prevState.open}
        });
    };

    render() {
        const { redirectToReferrer, timeout } = this.state;
        if (redirectToReferrer) {
            return <Redirect to={this.state.route} />;
        }
        return (
            <React.Fragment>
                <nav className="navbar is-fixed-top has-shadow is-spaced">
                    <div className="navbar-brand">
                        <Link className="navbar-item" to={'/'}>
                            <img src="data:image/png;base64,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"
                                 alt="Evius.co" width="112" height="28"/>
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
                                <button className="button is-primary" onClick={(e)=>{this.setState({modal:true})}} disabled={this.state.loader}>Crear Evento</button>
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
                        second={{title:'Mirar eventos',class:'',action:this.closeModal}}/>
            </React.Fragment>
        );
    }
}

export default Header;