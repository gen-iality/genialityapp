import React, {Component} from 'react';
import {icon} from "../../../../helpers/constants";

class ModalCrud extends Component {
    constructor(props){
        super(props)
        this.state = {
            formValid:  false,
            edit: false,
            formErrors: {email: '', name: ''},
            message: {},
            modalFields: []
        }
    }

    componentDidMount() {
        console.log("here all info in modal", this.props.info);
        const fields = this.props.info;
        this.setState({modalFields: fields});
    }
    

    validateForm = () => {this.setState({formValid: this.state.emailValid && this.state.nameValid && this.state.rolValid});};

    // closeModal = () => {
    //     let message = {class:'',content:''};
    //     console.log('here closing');
    //     this.setState({user:{}, valid:true, modal: false, uncheck:false, message},this.props.handleModal);
    // };

    // handleModal = () => {
    //     const html = document.querySelector("html");
    //     const formErrors = {email: '', name: ''};
    //     const user = {Nombres:'',email:'',rol:''};
    //     this.setState((prevState)=>{
    //         !prevState.modal ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
    //         return {modal: false, formValid:false, formErrors, user, edit: false}})
    // };

    // validForm = () => {
    //     const EMAIL_REGEX = new RegExp('[^@]+@[^@]+\\.[^@]+');
    //     const {extraFields} = this.props, {user}= this.state,
    //         mandatories = extraFields.filter(field => field.mandatory),validations = [];
    //     mandatories.map((field,key)=>{
    //         let valid;
    //         if(field.type === 'email')  valid = user[field.name].length > 5 && user[field.name].length < 61 && EMAIL_REGEX.test(user[field.name]);
    //         if(field.type === 'text' || field.type === 'list')  valid = user[field.name] && user[field.name].length > 0 && user[field.name] !== "";
    //         if(field.type === 'number') valid = user[field.name] && user[field.name] >= 0;
    //         if(field.type === 'boolean') valid = (typeof user[field.name] === "boolean");
    //         return validations[key] = valid;
    //     });
    //     const valid = validations.reduce((sum, next) => sum && next, true);
    //     this.setState({valid:!valid})
    // };

    renderForm = () => {
        let formUI = this.state.modalFields.map((data, key) => {
            
            let type = data.type || "text";
            let props = data.props || {};
            let name= data.name;
            let mandatory = data.mandatory;
            let target = name;
            // let value =  this.state.user[target];
            let input =  <input {...props}
                                className="input"
                                type={type}
                                key={key}
                                name={name}
                                // value={value}
                                onChange={(e)=>{this.onChange(e, type)}}
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
                                                <button className="button is-primary" onClick={this.handleSubmit} disabled={!formValid}>{(this.state.edit)?'Guardar':'Crear'}</button>
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