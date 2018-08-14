import React, {Component} from 'react';
import axios from 'axios';
import {Actions} from "../../../helpers/request";

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rolsList: [],
            statesList: [],
            labelSelect: null,
            name: "",
            email: "",
            emailError:false,
            disabled: true,
            edit: false
        };
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modal !== this.props.modal) {
            this.setState({modal:nextProps.modal});
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
            rol: this.state.selectedOption,
            state: this.state.stateOption,
        };
        console.log(snap);
        /*let {data} = await InviteOrAddUser.createUsers(
            snap,
            `${this.props.urlRequest}/${this.props.idParam}`
        );
        if (data) {
            snap.rol = this.state.labelSelect;
            snap.state = this.state.labelState;
            this.props.addToList(snap);
            this.props.handleModal;
        } else {
            this.props.handleModal;
            alert("User can`t be created");
        }*/
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value);
        this.setState({[name]:value}, this.validForm)
        console.log(this.state);
    };

    validForm = () => {
        const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let state= this.state,
            emailValid = state.email.length > 5 && state.email.length < 61 && EMAIL_REGEX.test(state.email),
            valid = !(emailValid && state.name.length>0 && state.selectedOption && state.stateOption);
        this.setState({emailError:!emailValid});
        this.setState({disabled:valid})
    };

    selectChange = selectedOption => {
        console.log(selectedOption);
        if (selectedOption) {
            this.setState({ selectedOption: selectedOption.value, labelSelect: selectedOption.label }, this.validForm);
        }
    };

    changeState = selectedOption => {
        if (selectedOption) {
            this.setState({ stateOption: selectedOption.value, labelState: selectedOption.label }, this.validForm);
        }
    };

    render() {
        return (
            <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
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
                                        <input className="input is-rounded" type="text" name={"name"} onChange={this.handleChange} placeholder="Evius.co"/>
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
                                        <input className="input is-rounded" type="email" name={"email"} onChange={this.handleChange} placeholder="evius@co"/>
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
                                            <select value={this.state.selectedOption} onChange={this.selectChange}>
                                                {
                                                    this.state.rolsList.map((item,key)=>{
                                                        return <option key={key} value={item.value}>{item.label}</option>
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
                                            <select value={this.state.stateOption} onChange={this.changeState}>
                                                {
                                                    this.state.statesList.map((item,key)=>{
                                                        return <option key={key} value={item.value}>{item.label}</option>
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
                                    <button className="button is-success" onClick={this.handleSubmit} disabled={this.state.valid}>Crear</button>
                                    <button className="button" onClick={this.props.handleModal}>Cancel</button>
                                </div>
                        }
                        <p className="help is-danger">{this.state.msg}</p>
                    </footer>
                </div>
            </div>
        );
    }
}

export default AddUser;