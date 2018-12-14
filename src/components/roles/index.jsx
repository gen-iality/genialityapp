import React, {Component} from 'react';
import SearchComponent from "../shared/searchTable";
import Loading from "../loaders/loading";
import Pagination from "../shared/pagination";
import ErrorServe from "../modal/serverError";
import {icon} from "../../helpers/constants";
import connect from "react-redux/es/connect/connect";
import {Actions, HelperApi} from "../../helpers/request";

class AdminRol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:       {Nombres:'',email:'',rol:''},
            users:      [],
            userReq:    [],
            pageOfItems:[],
            total:      0,
            checkIn:    0,
            estados:    {DRAFT:0,BOOKED:0,RESERVED:0,INVITED:0},
            extraFields:[],
            message:    {},
            modal:      false,
            formErrors: {email: '', name: ''},
            emailValid: false,
            nameValid:  false,
            rolValid:   false,
            formValid:  false
        };
    }

    async componentDidMount(){
        console.log('PROPS ',this.props);
        try{
            const res = await HelperApi.listHelper(this.props.event_id);
            console.log(res);
        }catch (e) {
            console.log(e);
        }
    }

    handleModal = () => {
        const html = document.querySelector("html");
        const formErrors = {email: '', name: ''};
        const user = {Nombres:'',email:'',rol:''};
        this.setState((prevState)=>{
            !prevState.modal ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
            return {modal:!prevState.modal,formValid:false,formErrors,user}})
    };

    onChange = (e) => {
        const {value,name} = e.target;
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
        this.setState({formErrors, emailValid, nameValid, rolValid }, this.validateForm);
    };

    validateForm = () => {this.setState({formValid: this.state.emailValid && this.state.nameValid && this.state.rolValid});};

    handleSubmit = () => {
        const {user} = this.state;
        const data = {
            "properties": {"email":user.email, "Nombres":user.Nombres},
            "role_id":user.rol,
            "event_id":this.props.event._id
        };
        console.log(data);
        Actions.post(`/api/permissions/roles/CreateAndAdd`,data)
            .then(resp=>{
                console.log(resp);
            })
            .catch(err=>{
                console.log(err);
            })
    };

    render() {
        const {timeout, userReq, users, total, extraFields, estados, modal, user} = this.state;
        const {formValid, formErrors:{name,email}} = this.state;
        const {roles} = this.props;
        return (
            <React.Fragment>
                <div className="checkin">
                    <div className="columns checkin-header">
                        <div className="column">
                            <div>
                                {
                                    total>=1 && <SearchComponent  data={userReq} kind={'user'} filter={extraFields.slice(0,2)} searchResult={this.searchResult} clear={this.state.clearSearch}/>
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
                    </div>
                    <div className="columns checkin-table">
                        <div className="column">
                            {this.state.loading ? <Loading/>:
                                <div className="table-wrapper">
                                    {
                                        users.length>0&&
                                        <React.Fragment>
                                            <div className="table">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th/>
                                                        <th className="is-capitalized">Check</th>
                                                        <th className="is-capitalized">Estado</th>
                                                        {
                                                            extraFields.map((field,key)=>{
                                                                return <th key={key} className="is-capitalized">{field.Nombres}</th>
                                                            })
                                                        }
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.renderRows()
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <Pagination
                                                items={users}
                                                change={this.state.changeItem}
                                                onChangePage={this.onChangePage}
                                            />
                                        </React.Fragment>
                                    }
                                </div>
                            }
                        </div>
                    </div>*/}
                    <p>Usuarios</p>
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
                            <div className="field has-addons">
                                <label className={`label has-text-grey-light is-capitalized required`}>Correo</label>
                                <div className="control">
                                    <input className={`input ${email.length>0?'is-danger':''}`} type='email' name='email' value={user.email} onChange={this.onChange} placeholder="Correo"/>
                                </div>
                                <div className="control">
                                    <a className="button is-info">Buscar</a>
                                </div>
                                {email.length>0 && <p className="help is-danger">{email}</p>}
                            </div>
                            {/*<div className="field">
                                <div className="control">
                                    <input className={`input ${email.length>0?'is-danger':''}`} type='email' name='email' value={user.email} onChange={this.onChange}/>
                                </div>
                            </div>*/}
                            {/*<div className="field">
                                <label className={`label has-text-grey-light is-capitalized required`}>Nombre</label>
                                <div className="control">
                                    <input className={`input ${name.length>0?'is-danger':''}`} type='text' name='Nombres' value={user.name} onChange={this.onChange}/>
                                </div>
                                {name.length>0 && <p className="help is-danger">{name}</p>}
                            </div>
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
                            </div>*/}
                        </section>
                        <footer className="modal-card-foot">
                            {
                                this.state.create?<div>Creando...</div>:
                                    <div className="modal-buttons">
                                        <button className="button is-primary" onClick={this.handleSubmit} disabled={!formValid}>{this.state.edit?'Guardar':'Crear'}</button>
                                        <button className="button" onClick={this.handleModal}>Cancel</button>
                                    </div>
                            }
                            <div className={"msg"}>
                                <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
                            </div>
                        </footer>
                    </div>
                </div>
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
