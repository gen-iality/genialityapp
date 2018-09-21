import React, {Component} from 'react';
import XLSX from "xlsx";
import { UsersApi } from "../../helpers/request";
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

    exportFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = parseData(this.state.users);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        XLSX.writeFile(wb, `usuarios_${this.props.event.name}.xls`);
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
        user.checkin = !user.checkin;
        users[position] = user;
        /*Actions.edit('/api/eventUser/' + user._id + '/checkin','','')
            .then((response)=>{
                console.log(response);
            });*/
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
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">Usuarios</a>
                                <div className="navbar-dropdown is-boxed">
                                    <a className="navbar-item">DRAFT</a>
                                    <a className="navbar-item">CONFIRMED</a>
                                    <a className="navbar-item">INVITED</a>
                                    <a className="navbar-item">TODOS</a>
                                </div>
                            </div>
                            <div className="navbar-item">
                                <SearchComponent  data={this.state.users} kind={'user'} searchResult={this.searchResult}/>
                            </div>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="field is-grouped">
                                    <p className="control">
                                        <button className="button is-primary" onClick={this.modalUser}>Agregar</button>
                                    </p>
                                    <p className="control">
                                        <button className="button is-primary" onClick={this.modalImport}>Importar</button>
                                    </p>
                                    <p className="control">
                                        <button className="button is-primary" onClick={this.exportFile}>Exportar</button>
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
                                    <React.Fragment>
                                        <div className="field">
                                            <input className="is-checkradio is-danger is-block" id="deleteUser"
                                                   type="checkbox" name="deleteUser" checked={this.state.deleteUser} onClick={this.enableDelete}/>
                                            <label htmlFor="deleteUser">{this.state.deleteUser?'Disable Delete User':'Enable Delete User'}</label>
                                        </div>
                                        <div className="preview-list">
                                            <table className="table is-fullwidth is-striped">
                                                <thead>
                                                <tr>
                                                    <th>CheckIn</th>
                                                    <th/>
                                                    {this.state.deleteUser&&(<th/>)}
                                                    <th>Correo</th>
                                                    <th>Nombre</th>
                                                    {
                                                        this.state.extraFields.map((extra,key)=>{
                                                            return <th key={key}>{extra.name}</th>
                                                        })
                                                    }
                                                    <th>Estado</th>
                                                    <th>Rol</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.users.map((item,key)=>{
                                                        return <tr key={key}>
                                                            <td width="5%">
                                                                <input className="is-checkradio is-info is-small" id={"checkinUser"+item._id}
                                                                       type="checkbox" name={"checkinUser"+item._id} checked={item.checkin} onClick={(e)=>{this.checkIn(item,key)}}/>
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
                                                            {Object.keys(item.properties).map((obj, i) => (
                                                                <td key={i}>{item.properties[obj]}</td>
                                                            ))}
                                                            <td>{item.state?item.state.name:''}</td>
                                                            <td>{item.rol?item.rol.name:''}</td>
                                                        </tr>
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </React.Fragment>: <h3>Not a single user...try add one or import</h3>
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