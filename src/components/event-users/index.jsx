import React, {Component} from 'react';
import XLSX from "xlsx";
import {Actions} from "../../helpers/request";
import Loading from "../../containers/loading";
import AddUser from "../shared/modal/addUser";
import ImportUsers from "../shared/modal/importUser";

class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            addUser:    false,
            importUser: false,
        };
        this.addToList=this.addToList.bind(this)
    }

    async componentDidMount() {
        let users = await Actions.getOne(`/api/user/event_users/`,this.props.eventId);
        console.log(users);
        this.setState({ users });
    }

    async addToList(user){
        console.log(user);
        let users = await Actions.getOne(`/api/user/event_users/`,this.props.eventId);
        console.log(users);
        this.setState({ users });
    }

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
                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input className="input" type="password" placeholder="Buscar"/>
                                        <span className="icon is-small is-left"><i className="fas fa-search"/></span>
                                    </p>
                                </div>
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
                        this.state.users.length<=0 ?
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
                                            <td>{item.state.name?item.state.name:''}</td>
                                            <td>{item.rol.name?item.rol.name:''}</td>
                                            <td width="5%">
                                            <span className="icon">
                                                <i className="far fa-square"/>
                                            </span>
                                            </td>
                                            <td width="5%">
                                            <span className="icon has-text-info">
                                                <i className="fas fa-edit"/>
                                            </span>
                                            </td>
                                            <td width="5%">
                                            <span className="icon has-text-danger">
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
                <AddUser handleModal={this.modalUser} modal={this.state.addUser} eventId={this.props.eventId} addToList={this.addToList}/>
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser}/>
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