import React, {Component} from 'react';
import SearchComponent from "../shared/searchTable";
import Loading from "../loaders/loading";
import Pagination from "../shared/pagination";
import ErrorServe from "../modal/serverError";
import {BaseUrl, icon} from "../../helpers/constants";
import connect from "react-redux/es/connect/connect";
import {Actions, HelperApi, UsersApi} from "../../helpers/request";
import {firestore} from "../../helpers/firebase";
import Dialog from "../modal/twoAction";
import {toast} from "react-toastify";
import {FormattedMessage} from "react-intl";

class AdminRol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:       {Nombres:'',email:'',rol:''},
            users:      [],
            loading:    true,
            pageOfItems:[],
            message:    {},
            modal:      false,
            edit:      false,
            formErrors: {email: '', name: ''},
            emailValid: false,
            nameValid:  false,
            rolValid:   false,
            formValid:  false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteHelper = this.deleteHelper.bind(this)
    }

    async componentDidMount(){
        console.log('PROPS ',this.props);
        try{
            const res = await HelperApi.listHelper(this.props.event._id);
            console.log(res);
            this.setState({users:res,pageOfItems:res,loading:false})
        }catch (e) {
            console.log(e);
        }
    }

    //EDit
    editHelper = (item) => {
        const user = {
            Nombres:'QONDA',
            email:item.user.email,
            rol:item.role_id,
            id:item._id,
            model_id:item.model_id
        };
        this.setState({user,edit:true,modal:true,found:3,emailValid:true,nameValid:true,rolValid:true},this.validateForm)
    };

    //Modal
    handleModal = () => {
        const html = document.querySelector("html");
        const formErrors = {email: '', name: ''};
        const user = {Nombres:'',email:'',rol:''};
        this.setState((prevState)=>{
            !prevState.modal ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
            return {modal:!prevState.modal,formValid:false,formErrors,user,edit:false,found:0}})
    };
    onChange = (e) => {
        const {value,name} = e.target;
        if(name ==='email') this.setState({found:0}, this.validateForm);
        this.setState({user:{...this.state.user,[name]:value}}, this.validateField(name,value));
    };
    validateField = (fieldName, value) => {
        let {formErrors,emailValid,nameValid,rolValid } = this.state;
        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && value.length > 5 && value.length < 61;
                formErrors.email = emailValid ? '' : 'Correo inválido';
                break;
            case 'Nombres':
                nameValid = value && value.length > 0 && value !== "";
                formErrors.name = nameValid ? '': 'El nombre no puede estar vacio';
                break;
            case 'rol':
                rolValid = value !== "";
                break;
            default:
                break;
        }
        /*console.group('VALIDATING ?');
        console.log(fieldName);
        console.log(value);
        console.log(this.state.emailValid);
        console.log(this.state.nameValid);
        console.log(this.state.rolValid);
        console.groupEnd();*/
        this.setState({formErrors, emailValid, nameValid, rolValid }, this.validateForm);
    };
    validateForm = () => {this.setState({formValid: this.state.emailValid && this.state.nameValid && this.state.rolValid});};
    searchByEmail = () => {
        const {user:{email}} = this.state;
        UsersApi.findByEmail(email)
            .then(res=>{
                console.log(res);
                if(res.length>0){
                    this.setState({found:1,user:{...this.state.user,rol:''},emailValid:true,nameValid:true,rolValid:false},this.validateForm)
                }
                else{
                    this.setState({found:2,user:{...this.state.user,rol:'',Nombres:''},emailValid:true,nameValid:false,rolValid:false},this.validateForm)
                }
            })
            .catch(err=>{
                console.log(err);
            })
    };
    async handleSubmit() {
        const {user,edit,users} = this.state;
        const self = this;
        const data = {
            "role_id":user.rol,
            "event_id":this.props.event._id
        };
        console.log(data);
        this.setState({create:true});
        try {
            if(edit){
                data.model_id = user.id;
                const update = await HelperApi.editHelper(user.id,data);
                console.log(update);
                toast.info(<FormattedMessage id="toast.user_edited" defaultMessage="Ok!"/>);
                this.setState({message:{...this.state.message,class:'msg_warning',content:'HELPER UPDATED'},isLoading:false});
            }
            else{
                data.properties = {"email":user.email, "Nombres":user.Nombres};
                const res = await HelperApi.saveHelper(data);
                console.log(res);
                if(res._id){
                    toast.success(<FormattedMessage id="toast.user_saved" defaultMessage="Ok!"/>);
                    this.setState({message:{...this.state.message,class:'msg_success',content:'HELPER CREATED'},isLoading:false});
                }
            }
            setTimeout(()=>{
                this.setState({message:{},create:false});
                self.handleModal();
            },800);
        }
        catch (e) {
            console.log(e);
            this.setState({timeout:true})
        }
    };

    //Delete Helper
    async deleteHelper() {
        const self = this;
        try {
            const res = await HelperApi.removeHelper(self.state.user.id);
            console.log(res);
            toast.info(<FormattedMessage id="toast.user_deleted" defaultMessage="Ok!"/>);
            this.setState({message:{...this.state.message,class:'msg_error',content:'HELPER DELETED'},create:false});
            self.removeContributtor();
            setTimeout(()=>{
                this.setState({message:{},deleteModal:false});
                self.handleModal();
            },800);
        }catch (e) {
            console.log(e);
            this.setState({timeout:true})
        }
    };
    closeDelete = () => {this.setState({deleteModal:false,edit:false})};
    removeContributtor = () => {
      const {users,user} = this.state;
      const pos = users.map(user=>user._id).indexOf(user.id);
      if(pos>=0) users.splice(pos, 1);
    };

    //Search records at third column
    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };
    searchResult = (data) => {
        !data ? this.setState({pageOfItems:this.state.users}) : this.setState({pageOfItems:data})
    };

    render() {
        const {timeout, users, pageOfItems, modal, user, edit} = this.state;
        const {formValid, formErrors:{name,email}, emailValid, found} = this.state;
        const {roles} = this.props;
        return (
            <React.Fragment>
                <div className="checkin">
                    <div className="columns checkin-header">
                        <div className="column">
                            <div>
                                {
                                    users.length>0 && <SearchComponent data={users} kind={'helpers'} searchResult={this.searchResult} clear={this.state.clearSearch}/>
                                }
                            </div>
                        </div>
                        <div className="column">
                            <div className="columns is-mobile is-multiline is-centered">
                                <div className="column is-narrow has-text-centered">
                                    <button className="button is-primary" onClick={this.handleModal}>Agregar Usuario +</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div className="checkin-tags-wrapper">
                        <div className="columns is-mobile is-multiline checkin-tags">
                            {
                                Object.keys(estados).map(item=>{
                                    return <div className="column is-narrow" key={item}>
                                        <div className="tags is-centered">
                                            <span className={'tag '+item}>{estados[item]}</span>
                                            <span className="tag is-white">{item}</span>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>*/}
                    <div className="columns checkin-table">
                        <div className="column">
                            {this.state.loading ? <Loading/>:
                                <div className="table-wrapper">
                                    <div className="table">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th/>
                                                    <th className="is-capitalized">Correo</th>
                                                    <th className="is-capitalized">Nombre</th>
                                                    <th className="is-capitalized">Rol</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    pageOfItems.map((item,key)=>{
                                                        return <tr key={key}>
                                                            <td>
                                                                <span className="icon has-text-primary action_pointer"
                                                                    onClick={(e)=>{this.editHelper(item)}}><i className="fas fa-edit"/></span>
                                                            </td>
                                                            <td>{item.user.email}</td>
                                                            <td>asdad</td>
                                                            <td>{item.role.name}</td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {users.length>10&& <Pagination items={users} onChangePage={this.onChangePage}/>}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={`modal modal-add-user ${modal ? "is-active" : ""}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <div className="modal-card-title">
                                <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }}/>
                            </div>
                            <button className="delete" aria-label="close" onClick={this.handleModal}/>
                        </header>
                        <section className="modal-card-body">
                            {
                                (found===1 && !edit) ?
                                    <div className="msg"><p className="msg_info has-text-centered is-size-5">ENCONTRADO !!</p></div> :
                                    (found===2 && !edit) ?
                                        <div className="msg"><p className="msg_warning has-text-centered is-size-5">NO ENCONTRADO</p></div> : ''
                            }
                            {
                                edit ?
                                    <div className="field">
                                        <label className={`label has-text-grey-light is-capitalized required`}>Correo</label>
                                        <div className="control">
                                            <input className={`input ${email.length>0?'is-danger':''}`} type='email' name='email' value={user.email} disabled={found===1 || edit} onChange={this.onChange}/>
                                        </div>
                                        {email.length>0 && <p className="help is-danger">{email}</p>}
                                    </div>
                                    :<div className="field has-addons">
                                        <div className="control">
                                            <input className={`input ${email.length>0?'is-danger':''}`} type='email' name='email' value={user.email} onChange={this.onChange} placeholder="Correo"/>
                                        </div>
                                        <div className="control">
                                            <button className="button is-info" style={{borderRadius: '0px'}} disabled={!emailValid} onClick={this.searchByEmail}>Buscar</button>
                                        </div>
                                        {email.length>0 && <p className="help is-danger">{email}</p>}
                                    </div>
                            }
                            {
                                (found===2 || edit) &&
                                <div className="field">
                                    <label className={`label has-text-grey-light is-capitalized required`}>Nombre</label>
                                    <div className="control">
                                        <input className={`input ${name.length>0?'is-danger':''}`} type='text' name='Nombres' value={user.Nombres} disabled={edit} onChange={this.onChange}/>
                                    </div>
                                    {name.length>0 && <p className="help is-danger">{name}</p>}
                                </div>
                            }
                            {
                                (found===2 || edit || found===1) &&
                                    <div className="field">
                                        <label className={`label has-text-grey-light is-capitalized required`}>Rol</label>
                                        <div className="control">
                                            <div className="select">
                                                <select value={user.rol} onChange={this.onChange} name={'rol'}>
                                                    <option value={''}>Seleccione...</option>
                                                    {
                                                        roles.map((item,key)=>{
                                                            return <option key={key} value={item.value}>{item.label}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </section>
                        {
                            found>0&&
                                <footer className="modal-card-foot">
                                {
                                    this.state.create?<div>Creando...</div>:
                                        <div className="modal-buttons">
                                            <button className="button is-primary" onClick={this.handleSubmit} disabled={!formValid}>{(edit)?'Guardar':'Crear'}</button>
                                            {
                                                this.state.edit&&
                                                <React.Fragment>
                                                    <button className="button" onClick={(e)=>{this.setState({deleteModal:true})}}>Eliminar</button>
                                                </React.Fragment>
                                            }
                                            <button className="button" onClick={this.handleModal}>Cancel</button>
                                        </div>
                                }
                                <div className={"msg"}>
                                    <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
                                </div>
                            </footer>
                        }
                    </div>
                </div>
                <Dialog modal={this.state.deleteModal} title={'Borrar Usuario'}
                        content={<p>Seguro de borrar este usuario?</p>}
                        first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteHelper}}
                        message={this.state.message}
                        second={{title:'Cancelar',class:'',action:this.closeDelete}}/>
                {timeout&&(<ErrorServe/>)}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    roles: state.rols.items,
    loading: state.rols.loading,
    error: state.rols.error
});

export default connect(mapStateToProps)(AdminRol);
