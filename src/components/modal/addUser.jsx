import React, {Component} from 'react';
import axios from 'axios';
import {Actions, UsersApi} from "../../helpers/request";

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rolsList: [],
            statesList: [],
            message: {},
            user: {},
            rol: "",
            state: "",
            emailError:false,
            valid: false
        };
        this.handleSubmit = this.handleSubmit.bind(this)
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.edit) {
            const value = nextProps.value;
            let user = {};
            Object.keys(value.properties)
                .map((obj) => (
                    user[obj] = value.properties[obj]
                ));
            this.setState({
                user, rol: value.rol._id + ':' + value.rol.name,
                state: value.state._id + ':' + value.state.name, edit: true
            });
        }else {
            let user = {name: '', email: ''};
            nextProps.extraFields
                .map((obj) => (
                    user[obj.name] = ''))
            this.setState({user,  edit: false});
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const snap = {
            properties: this.state.user,
            role_id: this.state.rol.split(':')[0],
            state_id: this.state.state.split(':')[0],
        };
        let message = {};
        this.setState({create:true});
        try {
            let resp = await UsersApi.editOne(snap,this.props.eventId);
            console.log(resp);
            if (resp.message === 'OK'){
                this.props.addToList(resp.data);
                message.class = (resp.status === 'CREATED')?'msg_success':'msg_warning';
                message.content = 'USER '+resp.status;
            } else {
                alert("User can`t be created/updated");
            }
        } catch (err) {
            console.log(err.response);
            message.class = 'msg_error';
            message.content = 'ERROR...TRYING LATER';
        }
        this.setState({message,create:false});
        setTimeout(()=>{
            message.class = message.content = '';
            this.closeModal();
        },1000)
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({user:{...this.state.user,[name]:value}})
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
            emailValid = state.user.email.length > 5 && state.user.email.length < 61 && EMAIL_REGEX.test(state.user.email),
            valid = !(emailValid && state.user.name.length>0 && state.rol.length>0 && state.state.length>0);
        this.setState({emailError:!emailValid});
        this.setState({valid})
    };

    closeModal = () => {
        this.setState({user:{}, rol: '', state: ''},this.props.handleModal());
    };

    render() {
        return (
            <div className={`modal ${this.props.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{`${this.state.edit?'Edición':'Nuevo'} Usuario`}</p>
                        <button className="delete" aria-label="close" onClick={this.props.handleModal}/>
                    </header>
                    <section className="modal-card-body">
                        {
                            Object.keys(this.state.user).map((obj, i)=>{
                                return <div className="field is-horizontal" key={obj}>
                                    <div className="field-label is-normal">
                                        <label className="label">{obj}</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <div className="control">
                                                <input className="input is-rounded" type="text" name={obj} onChange={this.handleChange} value={this.state.user[obj]} placeholder="Evius.co"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
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