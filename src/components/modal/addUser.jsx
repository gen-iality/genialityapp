import React, {Component} from 'react';
import axios from 'axios';
import {Actions, UsersApi} from "../../helpers/request";
import {icon} from "../../helpers/constants";

class AddUser extends Component {

    constructor(props) {
    super(props);
    this.state = {
        rolesList: [],
        statesList: [],
        message: {},
        user: {},
        rol: "",
        state: "",
        emailError:false,
        valid: true
    };
    this.handleSubmit = this.handleSubmit.bind(this)
}

    componentDidMount() {
        const self = this,
            {rolstate:{roles,states}} = this.props;
        self.setState({ rolesList: roles, statesList: states, state: states[0].value, rol: roles[1].value });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.edit !== this.props.edit){
            let user = {name: '', email: ''};
            this.props.extraFields
                .map((obj) => (
                    user[obj.name] = ''));
            this.setState({user,edit:false});
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const snap = {
            properties: this.state.user,
            role_id: this.state.rol,
            state_id: this.state.state,
        };
        let message = {};
        this.setState({create:true});
        try {
            let resp = await UsersApi.createOne(snap,this.props.eventId);
            console.log(resp);
            if (resp.message === 'OK'){
                this.props.addToList(resp.data);
                message.class = (resp.status === 'CREATED')?'msg_success':'msg_warning';
                message.content = 'USER '+resp.status;
            } else {
                message.class = 'msg_danger';
                message.content = 'User can`t be created';
            }
            setTimeout(()=>{
                message.class = message.content = '';
                this.closeModal();
            },1000)
        } catch (err) {
            console.log(err.response);
            message.class = 'msg_error';
            message.content = 'ERROR...TRYING LATER';
        }
        this.setState({message,create:false});
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({user:{...this.state.user,[name]:value}}, this.validForm)
    };

    selectChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]:value}, this.validForm);
    };

    validForm = () => {
        const EMAIL_REGEX = new RegExp('[^@]+@[^@]+\\.[^@]+');
        let state= this.state,
            emailValid = state.user.email.length > 5 && state.user.email.length < 61 && EMAIL_REGEX.test(state.user.email),
            valid = !(emailValid && state.user.name.length>0 && state.rol.length>0 && state.state.length>0);
        this.setState({emailError:!emailValid});
        this.setState({valid})
    };

    closeModal = () => {
        this.setState({user:{}, valid:true},this.props.handleModal());
    };

    render() {
        return (
            <div className={`modal modal-add-user ${this.props.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <div className="modal-card-title">
                            <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }}/>
                        </div>
                        <button className="delete" aria-label="close" onClick={this.props.handleModal}/>
                    </header>
                    <section className="modal-card-body">
                        {
                            Object.keys(this.state.user).map((obj, i)=>{
                                return <div className="field" key={obj}>
                                    <label className="label is-required has-text-grey-light">{obj}</label>
                                    <div className="control">
                                        <input className="input" type="text" name={obj} onChange={this.handleChange} value={this.state.user[obj]} placeholder={obj}/>
                                    </div>
                                </div>
                            })
                        }
                        <div className="field">
                            <label className="label">Rol</label>
                            <div className="control">
                                <div className="select">
                                    <select value={this.state.rol} onChange={this.selectChange} name={'rol'}>
                                        {
                                            this.state.rolesList.map((item,key)=>{
                                                return <option key={key} value={item.value}>{item.label}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Estado</label>
                            <div className="control">
                                <div className="select">
                                    <select value={this.state.state} onChange={this.selectChange} name={'state'}>
                                        {
                                            this.state.statesList.map((item,key)=>{
                                                return <option key={key} value={item.value}>{item.label}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        {
                            this.state.create?<div>Creando...</div>:
                                <div className="modal-buttons">
                                    <button className="button is-primary" onClick={this.handleSubmit} disabled={this.state.valid}>{this.state.edit?'Guardar':'Crear'}</button>
                                    {
                                        this.state.edit&& <button className="button" onClick={this.printUser}>Imprimir</button>
                                    }
                                    <button className="button" onClick={this.closeModal}>Cancel</button>
                                </div>
                        }
                        <div className={"msg"}>
                            <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
                        </div>
                    </footer>
                </div>
                <iframe ref="ifrmPrint" style={{opacity:0, display:'none'}} title={'printUser'}/>
            </div>
        );
    }
}

export default AddUser;