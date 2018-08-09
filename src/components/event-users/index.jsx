import React, {Component} from 'react';
import {Actions} from "../../helpers/request";

class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:[]
        }
    }

    async componentDidMount() {
        let users = await Actions.getOne(`/api/user/event_users/`,this.props.eventId);
        console.log(users);
        this.setState({ users });
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
                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input className="input" type="password" placeholder="Buscar"/>
                                        <span className="icon is-small is-left"><i className="fas fa-search"></i></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="field is-grouped">
                                    <p className="control">
                                        <button className="button is-primary">Agregar</button>
                                    </p>
                                    <p className="control">
                                        <button className="button is-primary">Importar</button>
                                    </p>
                                    <p className="control">
                                        <button className="button is-primary">Exportar</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="main">
                    {
                        this.state.users.length>0 && (
                            <table className="table is-fullwidth is-striped">
                                <thead>
                                <tr>
                                    <th>Correo</th>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Rol</th>
                                    <th>CheckIn</th>
                                    <th></th>
                                    <th></th>
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
                        )
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default ListEventUser;