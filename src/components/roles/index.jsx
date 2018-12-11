import React, {Component} from 'react';
import SearchComponent from "../shared/searchTable";
import Loading from "../loaders/loading";
import Pagination from "../shared/pagination";
import ErrorServe from "../modal/serverError";
import {icon} from "../../helpers/constants";
import connect from "react-redux/es/connect/connect";

class AdminRol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:       {name:'',email:'',rol:''},
            users:      [],
            userReq:    [],
            pageOfItems:[],
            total:      0,
            checkIn:    0,
            estados:    {DRAFT:0,BOOKED:0,RESERVED:0,INVITED:0},
            extraFields:[],
            message:    {},
            modal:      false
        };
    }

    componentDidMount(){
        console.log('PROPS ',this.props);
    }

    handleModal = () => {
        const html = document.querySelector("html");
        this.setState((prevState)=>{
            !prevState.modal ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
            return {modal:!prevState.modal}})
    };

    onChange = (e) => {
        const {value,name} = e.target;
        this.setState({user:{...this.state.user,[name]:value}}, this.validForm);
    };

    handleSubmit = () => {
        const {user} = this.state;
        console.log(user);
    };

    render() {
        const {timeout, userReq, users, total, extraFields, estados, modal, user} = this.state;
        const {rolstate:{roles}} = this.props;
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
                                                                return <th key={key} className="is-capitalized">{field.name}</th>
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
                            <div className="field">
                                <label className={`label has-text-grey-light is-capitalized required`}>Nombre</label>
                                <div className="control">
                                    <input className="input" type='text' name='name' value={user.name} onChange={this.onChange}/>
                                </div>
                            </div>
                            <div className="field">
                                <label className={`label has-text-grey-light is-capitalized required`}>Correo</label>
                                <div className="control">
                                    <input className="input" type='text' name='email' value={user.email} onChange={this.onChange}/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Rol</label>
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
                        </section>
                        <footer className="modal-card-foot">
                            {
                                this.state.create?<div>Creando...</div>:
                                    <div className="modal-buttons">
                                        <button className="button is-primary" onClick={this.handleSubmit} disabled={this.state.valid}>{this.state.edit?'Guardar':'Crear'}</button>
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
    rolstate: state.rolstate.items,
    loading: state.rolstate.loading,
    error: state.rolstate.error
});

export default connect(mapStateToProps)(AdminRol);
