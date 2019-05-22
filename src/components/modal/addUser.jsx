import React, {Component} from 'react';
import {UsersApi} from "../../helpers/request";
import {icon} from "../../helpers/constants";

class AddUser extends Component {

    constructor(props) {
    super(props);
    this.state = {
        statesList: [],
        message: {},
        user: {},
        state: "",
        emailError:false,
        valid: true
    };
    this.handleSubmit = this.handleSubmit.bind(this)
}

    componentDidMount() {
        const self = this,
            {states} = this.props;
        self.setState({ statesList: states, state: states[0].value });
        let user = {};
        this.props.extraFields
            .map((obj) => (
                user[obj.name] = ''));
        this.setState({user,edit:false});
    }

    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const snap = {
            properties: this.state.user,
            state_id: this.state.state,
        };
        console.log(snap);
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

    /*handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({user:{...this.state.user,[name]:value}}, this.validForm)
    };*/

    renderForm = () => {
        const {extraFields} = this.props;
        let formUI = extraFields.map((m,key) => {
            let type = m.type || "text";
            let props = m.props || {};
            let name= m.name;
            let mandatory = m.mandatory;
            let target = name;
            let value =  this.state.user[target];
            let input =  <input {...props}
                                className="input"
                                type={type}
                                key={key}
                                name={name}
                                value={value}
                                onChange={(e)=>{this.onChange(e, type)}}
            />;
            if (type === "boolean") {
                input =
                    <React.Fragment>
                        <input
                            name={name}
                            id={name}
                            className="is-checkradio is-primary is-rtl"
                            type="checkbox"
                            checked={value}
                            onChange={(e)=>{this.onChange(e, type)}} />
                        <label className={`label has-text-grey-light is-capitalized ${mandatory?'required':''}`} htmlFor={name}>{name}</label>
                    </React.Fragment>
            }
            if (type === "list") {
                input = m.options.map((o,key) => {
                    return (<option key={key} value={o.value}>{o.value}</option>);
                });
                input = <div className="select">
                    <select name={name} value={value} onChange={(e)=>{this.onChange(e, type)}}>
                        <option value={""}>Seleccione...</option>
                        {input}
                    </select>
                </div>;
            }
            return (
                <div key={'g' + key} className="field">
                    {m.type !== "boolean"&&
                    <label className={`label has-text-grey-light is-capitalized ${mandatory?'required':''}`}
                           key={"l" + key}
                           htmlFor={key}>
                        {name}
                    </label>}
                    <div className="control">
                        {input}
                    </div>
                </div>
            );
        });
        return formUI;
    };

    onChange = (e,type) => {
        const {value,name} = e.target;
        //console.log(`${name} changed ${value} type ${type}`);
        (type === "boolean") ?
            this.setState(prevState=>{return {user:{...this.state.user,[name]: !prevState.user[name]}}}, this.validForm)
            : this.setState({user:{...this.state.user,[name]:value}}, this.validForm);
    };

    selectChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]:value}, this.validForm);
    };

    validForm = () => {
        const EMAIL_REGEX = new RegExp('[^@]+@[^@]+\\.[^@]+');
        const {extraFields} = this.props, {user}= this.state,
            mandatories = extraFields.filter(field => field.mandatory),validations = [];
        mandatories.map((field,key)=>{
            let valid;
            if(field.type === 'email')  valid = user[field.name].length > 5 && user[field.name].length < 61 && EMAIL_REGEX.test(user[field.name]);
            if(field.type === 'text' || field.type === 'list')  valid = user[field.name] && user[field.name].length > 0 && user[field.name] !== "";
            if(field.type === 'number') valid = user[field.name] && user[field.name] >= 0;
            if(field.type === 'boolean') valid = (typeof user[field.name] === "boolean");
            return validations[key] = valid;
        });
        const valid = validations.reduce((sum, next) => sum && next, true);
        this.setState({valid:!valid})
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
                            Object.keys(this.state.user).length > 0 && this.renderForm()
                        }
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