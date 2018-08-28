import React, {Component} from 'react';
import XLSX from "xlsx";
import {Actions} from "../../helpers/request";
import Loading from "../../containers/loading";
import AddUser from "../modal/addUser";
import ImportUsers from "../modal/importUser";
import SearchComponent from "../shared/searchTable";
import Dialog from "../modal/twoAction";

class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            addUser:    false,
            loading:    true,
            importUser: false,
            message:    {class:'', content:''}
        };
        this.addToList=this.addToList.bind(this)
    }

    async componentDidMount() {
        const resp = await Actions.getOne(`/api/user/event_users/`,this.props.eventId);
        console.log(resp);
        const users = resp.data;
        this.setState({ users, auxArr:users, loading:false });
    }

    async addToList(){
        const resp = await Actions.getOne(`/api/user/event_users/`,this.props.eventId);
        const users = resp.data;
        this.setState({ users });
    }

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
        XLSX.writeFile(wb, 'usuarios.xls');
    };

    modalUser = () => {
        this.setState((prevState) => {
            return {addUser:!prevState.addUser}
        });
    };

    modalImport = () => {
        this.setState((prevState) => {
            return {importUser:!prevState.importUser}
        });
    };

    closeModal = () => {
        this.setState({modal:false})
    };

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
                                <SearchComponent  data={this.state.users} searchResult={this.searchResult}/>
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
                            <table className="table is-fullwidth is-striped">
                                <thead>
                                    <tr>
                                        <th>Correo</th>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>Rol</th>
                                        <th>CheckIn</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.users.map((item,key)=>{
                                        return <tr key={key}>
                                            <td>{item.user.email?item.user.email:''}</td>
                                            <td>{item.user.name?item.user.name:''}</td>
                                            <td>{item.state?item.state.name:''}</td>
                                            <td>{item.rol?item.rol.name:''}</td>
                                            <td width="5%">
                                            <span className="icon">
                                                <i className="far fa-square"/>
                                            </span>
                                            </td>
                                            <td width="5%">
                                                <span className="icon has-text-info action_pointer tooltip" data-tooltip="Edit User" onClick={(e)=>{this.setState({addUser:true,selectedUser:item})}}>
                                                    <i className="fas fa-edit"/>
                                                </span>
                                            </td>
                                            <td width="5%">
                                                <span className="icon has-text-danger action_pointer tooltip" data-tooltip="Delete User" onClick={(e)=>{this.setState({modal:true})}}>
                                                    <i className="fas fa-trash"/>
                                                </span>
                                            </td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                    }
                </div>
                <AddUser handleModal={this.modalUser} modal={this.state.addUser} eventId={this.props.eventId} value={this.state.selectedUser} addToList={this.addToList}/>
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser} eventId={this.props.eventId}/>
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
    data.map((obj) => {
        if(obj.user){
            const name = obj.user.name ? obj.user.name : '';
            const email = obj.user.email ? obj.user.email : '';
            info.push({Nombre:name,Correo:email,Estado:obj.state.name,Rol:obj.rol.name})
        }
        return info
    });
    return info
};

export default ListEventUser;