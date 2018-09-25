import React, {Component} from 'react';
import {FormattedDate, FormattedTime} from 'react-intl';
import { Actions, UsersApi } from "../../helpers/request";
import Loading from "../loaders/loading";
import AddUser from "../modal/addUser";
import ImportUsers from "../modal/importUser";
import SearchComponent from "../shared/searchTable";
import Dialog from "../modal/twoAction";

class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            extraFields:[],
            addUser:    false,
            deleteUser: false,
            loading:    true,
            importUser: false,
            message:    {class:'', content:''}
        };
        this.modalImport = this.modalImport.bind(this);
    }

    async componentDidMount() {
        const { event } = this.props;
        const resp = await UsersApi.getAll(this.props.eventId);
        console.log(resp);
        const users = resp.data;
        this.setState({ users, auxArr:users, loading:false, extraFields: event.user_properties });
    }

    addToList = (user) => {
        let users = this.state.users;
        let pos = users.map(function(e) { return e._id; }).indexOf(user._id);
        if(pos >= 0){
              users[pos] = user;
        }else users.push(user);
        this.setState({ users, auxArr:users });
    };

    searchResult = (data) => {
        !data ? this.setState({users:this.state.auxArr}) : this.setState({users:data})
    };

    modalUser = () => {
        this.setState((prevState) => {
            return {addUser:!prevState.addUser,edit:false}
        });
    };

    async modalImport() {
        const {data} = await UsersApi.getAll(this.props.eventId);
        this.setState((prevState) => {
            return {importUser:!prevState.importUser,users:data}
        });
    };

    closeModal = () => {
        this.setState({modal:false})
    };

    checkIn = (user,position) => {
        const users = this.state.users;
        user.checked_in = !user.checked_in;
        users[position] = user;
        Actions.edit('/api/eventUser/' + user._id + '/checkin','','')
            .then((response)=>{
                console.log(response);
            });
        this.setState((prevState) => {
            return {data:users,change:!prevState.change}
        })
    };

    enableDelete = () => {
        this.setState((prevState) => {
            return {deleteUser:!prevState.deleteUser}
        });
    }

    render() {
        return (
            <React.Fragment>
                <nav className="navbar is-transparent">
                    <div className="navbar-menu">
                        <div className="navbar-start">
                            <div className="navbar-item">
                                <SearchComponent  data={this.state.users} kind={'user'} searchResult={this.searchResult}/>
                            </div>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button className={`button is-rounded ${this.state.deleteUser?'is-danger':''}`} onClick={this.enableDelete}>
                                            <span className="icon is-small">
                                              <i className="far fa-trash-alt"/>
                                            </span>
                                        </button>
                                    </div>
                                    <p className="control">
                                        <button className="button is-inverted is-rounded">Leer Código QR</button>
                                    </p>
                                    <p className="control">
                                        <button className="button is-primary is-rounded" onClick={this.modalUser}>Agregar Usuario +</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="main">
                    {
                        this.state.loading ?
                            <Loading/> :
                            <React.Fragment>
                                {
                                    this.state.users.length>0 ?
                                        <div className="preview-list">
                                            <table className="table is-fullwidth is-striped">
                                                <thead>
                                                <tr>
                                                    <th>Check</th>
                                                    <th/>
                                                    {this.state.deleteUser&&(<th/>)}
                                                    <th>
                                                        <div className="navbar-item has-dropdown is-hoverable">
                                                            <a className="navbar-link">Estado</a>
                                                            <div className="navbar-dropdown is-boxed">
                                                                <a className="navbar-item">DRAFT</a>
                                                                <a className="navbar-item">CONFIRMED</a>
                                                                <a className="navbar-item">INVITED</a>
                                                                <a className="navbar-item">TODOS</a>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th>Fecha</th>
                                                    <th>Hora</th>
                                                    <th>Rol</th>
                                                    <th>Nombre</th>
                                                    <th>Correo</th>
                                                    {
                                                        this.state.extraFields.map((extra,key)=>{
                                                            return <th key={key}>{extra.name}</th>
                                                        })
                                                    }
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.users.map((item,key)=>{
                                                        return <tr key={key}>
                                                            <td width="5%">
                                                                <input className="is-checkradio is-info is-small" id={"checkinUser"+item._id} disabled={item.checked_in}
                                                                       type="checkbox" name={"checkinUser"+item._id} checked={item.checked_in} onClick={(e)=>{this.checkIn(item,key)}}/>
                                                                <label htmlFor={"checkinUser"+item._id}/>
                                                            </td>
                                                            <td width="5%">
                                                        <span className="icon has-text-info action_pointer tooltip" data-tooltip="Edit User" onClick={(e)=>{this.setState({addUser:true,selectedUser:item,edit:true})}}>
                                                            <i className="fas fa-edit"/>
                                                        </span>
                                                            </td>
                                                            {this.state.deleteUser&&(
                                                                <td width="5%">
                                                            <span className="icon has-text-danger action_pointer tooltip" data-tooltip="Delete User" onClick={(e)=>{this.setState({modal:true})}}>
                                                                <i className="fas fa-trash"/>
                                                            </span>
                                                                </td>
                                                            )}
                                                            <td>{item.state?item.state.name:''}</td>
                                                            <td><FormattedDate value={item.updated_at}/></td>
                                                            <td><FormattedTime value={item.updated_at}/></td>
                                                            <td>{item.rol?item.rol.name:''}</td>
                                                            <td>{item.properties.name}</td>
                                                            <td>{item.properties.email}</td>
                                                            {
                                                                this.state.extraFields.map((extra,key)=>{
                                                                    return <td key={key}>{item.properties[extra.name]}</td>
                                                                })
                                                            }
                                                        </tr>
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                        : <h3>Not a single user...try add one or import</h3>
                                }
                            </React.Fragment>
                    }
                </div>
                <AddUser handleModal={this.modalUser} modal={this.state.addUser} eventId={this.props.eventId}
                         value={this.state.selectedUser} addToList={this.addToList}
                         extraFields={this.state.extraFields} edit={this.state.edit}/>
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser} eventId={this.props.eventId} extraFields={this.state.extraFields}/>
                <Dialog modal={this.state.modal} title={'Borrar Usuario'}
                        content={<p>Seguro de borrar este usuario?</p>}
                        first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteEvent}}
                        message={this.state.message}
                        second={{title:'Cancelar',class:'',action:this.closeModal}}/>
            </React.Fragment>
        );
    }
}

const parseData = (data) => {
    let info = [];
    data.map((item,key) => {
        info[key] = {};
        if(item.user){
            Object.keys(item.properties).map((obj, i) => (
                info[key][obj] = item.properties[obj]
            ));
            info[key]['estado'] = item.state.name;
            info[key]['rol'] = item.rol.name;
        }
        return info
    });
    return info
};

export default ListEventUser;