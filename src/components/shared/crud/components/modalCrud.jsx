import React, {Component} from 'react';
import {icon} from "../../../../helpers/constants";
import {SpeakersApi} from "../../../../helpers/request";

class ModalCrud extends Component {
    constructor(props){
        super(props)
        this.state = {
            formValid:  false,
            edit: false,
            formErrors: {email: '', name: ''},
            message: {},
            modalFields: [],
            newInfo: {},
            valid: true
        }
        this.submitForm = this.submitForm.bind(this)
    }

    componentDidMount() {
        // console.log("here all info in modal", this.props.info.speakers.fieldsModal);
        const fields = this.props.info.speakers.fieldsModal;
        this.setState({modalFields: fields});
        let newInfo = {};
        /*
            * This is to create keys inside newInfo object and avoid uncontrolled input error
        */
        fields.map(info => (
            newInfo[info.name] = ''));
        this.setState({newInfo, edit:false});
    }

    /*
        * This method is for save information from popup
    */
    async submitForm(e) {
        e.preventDefault();
        e.stopPropagation();
        const snap = {
            properties: this.state.newInfo
        };
        await SpeakersApi.createSpeaker(snap, this.props.enventInfo);
        // console.log("Here saving", snap);
        this.props.hideModal(); 
        return
        let message = {};
        this.setState({create:true});
        try {
            // let resp = await UsersApi.createOne(snap,this.props.eventId);
            let resp = "Testing";
            console.log(resp);
            if (resp.message === 'OK'){
                this.props.addToList(resp.data);
                message.class = (resp.status === 'CREATED')?'msg_success':'msg_warning';
                message.content = 'Speaker '+ resp.status;
            } else {
                message.class = 'msg_danger';
                message.content = 'Docmunet can`t be created';
            }
            setTimeout(()=>{
                message.class = message.content = '';
                this.props.hideModal(); 
            },1000)
        } catch (err) {
            console.log(err.response);
            message.class = 'msg_error';
            message.content = 'ERROR...TRYING LATER';
        }
        this.setState({message, create:false});
    }

    validForm = () => {
        const fieldsToSave = this.state.modalFields
        // console.log('extraFields: ', fieldsToSave);
        let mandatories = fieldsToSave.filter(field => field.mandatory), validations = [];
        mandatories.map((field, key)=>{
            let valid;
            if(field.type === 'text' || field.type === 'list') console.log('here we are', field.type);
        });
        const valid = validations.reduce((sum, next) => sum && next, true);
        this.setState({valid: !valid})
    };

    handleChange = (e,type) => {
        const {value, name} = e.target;
        // console.log(`${name} changed ${value} type ${type}`);
        // (type === "boolean") ?
        //     this.setState(prevState=>{return {user:{...this.state.user,[name]: !prevState.user[name]}}}, this.validForm)
        // this.setState({newInfo:{...this.state.newInfo,[name]: value}}, this.validForm);
        this.setState({newInfo:{...this.state.newInfo,[name]: value}});
    };

    renderForm = () => {
        let formUI = this.state.modalFields.map((data, key) => {
            let type = data.type || "text";
            let props = data.props || {};
            let name= data.name;
            let mandatory = data.mandatory;
            let target = name;
            let value =  this.state.newInfo[target];
            let input =  <input {...props}
                                className="input"
                                type={type}
                                key={key}
                                name={name}
                                value={value}
                                onChange={value => this.handleChange(value, type)}
            />;
            if (type == "boolean") {
                input =
                    <React.Fragment>
                        <input
                            name={name}
                            id={name}
                            className="is-checkradio is-primary is-rtl"
                            type="checkbox"
                            // checked={value}
                            onChange={(e)=>{this.onChange(e, type)}} />
                        <label className={`label has-text-grey-light is-capitalized ${mandatory?'required':''}`} htmlFor={name}>{name}</label>
                    </React.Fragment>
            }
            if (type == "list") {
                input = data.options.map((o,key) => {
                    return (<option key={key} value={o.value}>{o.value}</option>);
                });
                input = <div className="select">
                    <select name={name}  onChange={(e)=>{this.onChange(e, type)}}>
                        <option value={""}>Seleccione...</option>
                        {input}
                    </select>
                </div>;
            }
            return (
                <div key={'g' + key} className="field">
                    {data.type !== "boolean"&&
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

    render(){
        const {formValid, formErrors:{name,email}, emailValid, found} = this.state;
        return(
            <React.Fragment>
                <div className={`modal modal-add-user ${this.props.modal ? "is-active" : ""}`}>
                        <div className="modal-background"/>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <div className="modal-card-title">
                                    <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }}/>
                                </div>
                                <button className="delete" aria-label="close" onClick={this.props.hideModal}/>
                            </header>
                            <section className="modal-card-body">
                            {
                                this.renderForm()
                            }
                            </section>
                            {
                                    <footer className="modal-card-foot">
                                    {
                                        this.state.create?<div>Creando...</div>:
                                            <div className="modal-buttons">
                                                <button className="button is-primary" onClick={this.submitForm} disabled={!this.state.valid}>{(this.state.edit)?'Guardar':'Crear'}</button>
                                                {
                                                    this.state.edit&&
                                                    <React.Fragment>
                                                        <button className="button" onClick={(e)=>{this.setState({deleteModal:true})}}>Eliminar</button>
                                                    </React.Fragment>
                                                }
                                                <button className="button" onClick={this.props.hideModal}>Cancelar</button>
                                            </div>
                                    }
                                    <div className={"msg"}>
                                        {/* <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p> */}
                                    </div>
                                </footer>
                            }
                        </div>
                    </div>
                    {/* <div className={`modal modal-add-user ${this.props.modal ? "is-active" : ""}`}>
                        
                        <div className="column is-narrow has-text-centered">
                            <button className="button is-primary" onClick={this.props.hideModal}>Cerrar</button>
                        </div>
                    </div> */}
            </React.Fragment>
        )
    }
}



export default ModalCrud;