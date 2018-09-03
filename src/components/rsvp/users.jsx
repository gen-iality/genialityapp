import React, {Component} from 'react';
import {EventsApi, UsersApi} from "../../helpers/request";

class UsersRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actualEvent:{},
            events: [],
            users: [],
            selection: [],
            preselection: [],
            checked: false,
            indeterminate: false
        };
        this.checkEvent = this.checkEvent.bind(this);
    }

    async componentDidMount() {
        const events = await EventsApi.getAll();
        const eventId = this.props.event._id;
        const resp = await UsersApi.getAll(eventId);
        const users = handleUsers(resp.data);
        const pos = events.map(function(e) { return e._id; }).indexOf(eventId);
        events.splice(pos,1);
        this.setState({events,users,loading:false,actualEvent:this.props.event});
    }

    //Traer los usuarios del evento seleccionado
    async checkEvent(event) {
        const resp = await UsersApi.getAll(event._id);
        const users = handleUsers(resp.data);
        this.setState({actualEvent:event,users});
    };

    //Agregar todos los usuarios a seleccionados
    toggleAll = () => {
        const selectAll = !this.state.selectAll;
        const selection = [];
        if (selectAll) {
            const currentRecords = this.state.users;
            currentRecords.forEach(item => {
                selection.push(item);
            });
        }
        this.refs.checkbox.checked = selectAll;
        this.setState({ selectAll, selection });
    };

    //Agregar o eliminar un usuario de seleccionados
    toggleSelection = (user) => {
        let selection = [...this.state.selection];
        const keyIndex = selection.map(function(e) { return e.id; }).indexOf(user.id);
        if (keyIndex >= 0) {
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(user);
        }
        this.refs.checkbox.indeterminate = selection.length < this.state.users.length;
        this.refs.checkbox.checked = selection.length >= this.state.users.length;
        this.setState({ selection });
    };

    //Revisar si usuario existe en seleccionados
    isChecked = (id) => {
        const pos = this.state.selection.map(function(e) { return e.id; }).indexOf(id);
        return pos !== -1
    };

    //Remover usuario de seleccionados
    removeThis = (user) => {
        let selection = [...this.state.selection];
        const keyIndex = selection.map(function(e) { return e.id; }).indexOf(user.id);
        selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
        ];
        this.refs.checkbox.indeterminate = true;
        this.refs.checkbox.checked = false;
        this.setState({ selection });
    };

    render() {
        return (
            <div className="columns">
                <div className="column is-3">
                    <strong>Eventos</strong>
                    <div>
                        <p>Evento Actual</p>
                        <div className="field">
                            <input className="is-checkradio is-link" id="thisEvent"
                                   type="checkbox" name="thisEvent" onClick={(e)=>{this.checkEvent(this.props.event)}}
                                   checked={this.state.actualEvent._id === this.props.event._id}/>
                            <label htmlFor="thisEvent">{this.props.event.name}</label>
                        </div>
                    </div>
                    <div>
                        <p>Otros Eventos</p>
                        {
                            this.state.events.map((event,key)=>{
                                return <div className="field" key={key}>
                                    <input className="is-checkradio is-link" id={`event${event._id}`}
                                           type="checkbox" name={`event${event._id}`} onClick={(e)=>{this.checkEvent(event)}}
                                           checked={this.state.actualEvent._id === event._id}/>
                                    <label htmlFor={`event${event._id}`} >{event.name}</label>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="column is-6">
                    <strong>Usuarios</strong>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Correo</th>
                                <th>Nombre</th>
                                <th>
                                    <input className="is-checkradio is-info is-small" id={"checkallUser"}
                                           type="checkbox" name={"checkallUser"} ref="checkbox" onClick={this.toggleAll}/>
                                    <label htmlFor={"checkallUser"}/>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.map((item,key)=>{
                                    return <tr key={key}>
                                        <td>{item.email}</td>
                                        <td>{item.name}</td>
                                        <td width="5%">
                                            <input className="is-checkradio is-info is-small" id={"checkinUser"+item.id}
                                                   type="checkbox" name={"checkinUser"+item.id} checked={this.isChecked(item.id)} onClick={(e)=>{this.toggleSelection(item)}}/>
                                            <label htmlFor={"checkinUser"+item.id}/>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="column is-3">
                    <div className="box">
                        <strong>Seleccionados {this.state.selection.length}</strong>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Correo</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.selection.map((item,key)=>{
                                        return <tr key={key}>
                                            <td>{item.email}</td>
                                            <td width="5%">
                                                <span className="icon has-text-danger" onClick={(e)=>{this.removeThis(item)}}>
                                                  <i className="fas fa-ban"/>
                                                </span>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

//Solo agregar nombre, corre y id
const handleUsers = (list) => {
    let users = [];
    list.map(user=>{
        users.push({name:user.properties.name,email:user.properties.email,id:user._id})
    });
    return users;
};

export default UsersRsvp;