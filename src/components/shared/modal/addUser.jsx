import React, {Component} from 'react';
import axios from 'axios';
import {Actions} from "../../../helpers/request";

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rolsList: [],
            statesList: [],
            message: {},
            name: "",
            email: "",
            rol: "",
            state: "",
            emailError:false,
            valid: true
        };
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            const value = nextProps.value;
            console.log(value);
            this.setState({
                name:   value.user.name,
                email:  value.user.email,
                rol:    value.rol._id + ':' + value.rol.name,
                state:  value.state._id + ':' + value.state.name,
                edit: true
            });
        }
    }

    componentDidMount() {
        const self = this,
            rols = Actions.getAll('/api/rols'),
            states = Actions.getAll('/api/states');
        axios.all([rols, states])
            .then(axios.spread(function (roles, estados) {
                let rolData = roles.map(rol => ({
                    value: rol._id,
                    label: rol.name
                }));
                let stateData = estados.map(state => ({
                    value: state._id,
                    label: state.name
                }));
                self.setState({ rolsList: rolData, statesList: stateData });
            }))
    }

    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const snap = {
            name: this.state.name,
            email: this.state.email,
            rol: this.state.rol.split(':')[0],
            state: this.state.state.split(':')[0],
        };
        let message = {};
        this.setState({create:true});
        let resp = await Actions.post(`/api/eventUser/createUserAndAddtoEvent/${this.props.eventId}`,snap);
        console.log(resp);
        if (resp.message === 'OK'){
            this.props.addToList();
            message.class = (resp.status === 'CREATED')?'msg_success':'msg_warning';
            message.content = 'USER '+resp.status;
            console.log(message);
            this.setState({create: false, message});
            setTimeout(()=>{
                this.closeModal();
            },1000)
        } else {
            alert("User can`t be created");
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]:value}, this.validForm)
    };

    selectChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let split = value.split(':');
        const label = 'label' + name;
        this.setState({[name]:value, [label]:split[1]}, this.validForm);
    }

    validForm = () => {
        const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let state= this.state,
            emailValid = state.email.length > 5 && state.email.length < 61 && EMAIL_REGEX.test(state.email),
            valid = !(emailValid && state.name.length>0 && state.rol.length>0 && state.state.length>0);
        this.setState({emailError:!emailValid});
        this.setState({valid})
    };

    closeModal = () => {
        this.setState({name: '', email: '', rol: '', state: ''},this.props.handleModal());
    };

    render() {
        return (
            <div className={`modal ${this.props.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Usuario</p>
                        <button className="delete" aria-label="close" onClick={this.props.handleModal}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Nombre</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input is-rounded" type="text" name={"name"} onChange={this.handleChange} value={this.state.name} placeholder="Evius.co"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Email</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input is-rounded" type="email" name={"email"} onChange={this.handleChange} value={this.state.email} placeholder="evius@co"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Rol</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <div className="select">
                                            <select value={this.state.rol} onChange={this.selectChange} name={'rol'}>
                                                <option value="">Seleccione....</option>
                                                {
                                                    this.state.rolsList.map((item,key)=>{
                                                        return <option key={key} value={item.value + ':' + item.label}>{item.label}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Estado</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <div className="select">
                                            <select value={this.state.state} onChange={this.selectChange} name={'state'}>
                                                <option value="">Seleccione....</option>
                                                {
                                                    this.state.statesList.map((item,key)=>{
                                                        return <option key={key} value={item.value + ':' + item.label}>{item.label}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        {
                            this.state.create?<div>Creando...</div>:
                                <div>
                                    <button className="button is-success" onClick={this.handleSubmit} disabled={this.state.valid}>{this.state.edit?'Guardar':'Crear'}</button>
                                    <button className="button" onClick={this.closeModal}>Cancel</button>
                                </div>
                        }
                        <div className={"msg"}>
                            <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default AddUser;