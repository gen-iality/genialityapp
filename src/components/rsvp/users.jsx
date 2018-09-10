import React, {Component} from 'react';
import {EventsApi, UsersApi} from "../../helpers/request";
import AddUser from "../modal/addUser";
import ImportUsers from "../modal/importUser";
import SearchComponent from "../shared/searchTable";

class UsersRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actualEvent:{},
            events: [],
            users: [],
            selection: [],
            preselection: [],
            importUser: false,
            addUser:    false,
            checked: false,
            indeterminate: false
        };
        this.checkEvent = this.checkEvent.bind(this);
        this.addToList = this.addToList.bind(this);
        this.modalImport = this.modalImport.bind(this);
    }

    async componentDidMount() {
        const events = await EventsApi.getAll();
        const eventId = this.props.event._id;
        const resp = await UsersApi.getAll(eventId);
        const users = handleUsers(resp.data);
        const pos = events.map(function(e) { return e._id; }).indexOf(eventId);
        const selection = [...this.state.selection, ...users];
        events.splice(pos,1);
        this.setState({events, loading:false,actualEvent:this.props.event, selection, auxArr: selection});
    }

    //Traer los usuarios del evento seleccionado
    async checkEvent(event) {
        if(this.state.actualEvent._id === event._id){
            this.setState({ actualEvent:{} })
        }else{
            const resp = await UsersApi.getAll(event._id);
            const users = handleUsers(resp.data);
            const selection = [...this.state.selection, ...users];
            this.setState({ actualEvent:event, selection, auxArr: selection });
        }
    };

    //Remover usuario de seleccionados
    removeThis = (user) => {
        let selection = [...this.state.selection];
        const keyIndex = selection.map(function (e) {
            return e.id;
        }).indexOf(user.id);
        selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
        ];
        if(selection.length <= 0 ){
            this.setState({actualEvent:{}})
        }
        this.setState({ selection, auxArr: selection });
    };

    //Modal fn
    modalUser = () => {
        this.setState((prevState) => {
            return {addUser:!prevState.addUser,edit:false}
        });
    };

    async addToList() {
        const {data} = await UsersApi.getAll(this.props.event._id);
        this.setState({ users: data });
    }

    async modalImport() {
        const {data} = await UsersApi.getAll(this.props.event._id);
        this.setState((prevState) => {
            return {importUser:!prevState.importUser,users:data}
        });
    };

    searchResult = (data) => {
        !data ? this.setState({selection:this.state.auxArr}) : this.setState({selection:data})
    };

    render() {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column is-5">
                        <strong>Eventos</strong>
                        <div>
                            <p>Evento Actual</p>
                            <div className="field">
                                <input className="is-checkradio is-link" id="thisEvent"
                                       type="checkbox" name="thisEvent" onClick={(e)=>{this.checkEvent(this.props.event)}}
                                       checked={this.state.actualEvent._id === this.props.event._id}/>
                                <label htmlFor="thisEvent">{this.props.event.name}</label>
                            </div>
                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-light is-rounded is-small" onClick={this.modalUser}>Agregar Usuario</button>
                                </div>
                                <div className="control">
                                    <button className="button is-light is-rounded is-small" onClick={this.modalImport}>Importar Excel</button>
                                </div>
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
                    {/*div className="column is-6">
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
                    </div>*/}
                    <div className="column is-7">
                        <div className="box">
                            <div className="field">
                                <strong>Seleccionados {this.state.selection.length}</strong>
                                <button className="button is-rounded is-primary is-outlined is-small"
                                        disabled={this.state.selection.length<=0}
                                        onClick={(e)=>{this.props.userTab(this.state.selection)}}>
                                    Siguiente
                                </button>
                            </div>
                            <SearchComponent  data={this.state.selection} kind={'invitation'} searchResult={this.searchResult}/>
                            {
                                this.state.selection.map((item,key)=>{
                                    return <div key={key} className="media">
                                            <div className="media-left">
                                                <span className="icon has-text-danger is-medium" onClick={(e)=>{this.removeThis(item)}}>
                                                    <i className="fas fa-ban"/>
                                                </span>
                                            </div>
                                            <div className="media-content">
                                                <p className="title is-5">{item.name}</p>
                                                <p className="subtitle is-6">{item.email}</p>
                                            </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <AddUser handleModal={this.modalUser} modal={this.state.addUser} eventId={this.props.event._id}
                         value={this.state.selectedUser} addToList={this.addToList}
                         extraFields={this.props.event.user_properties} edit={false}/>
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser} eventId={this.props.event._id} extraFields={this.props.event.user_properties}/>
            </React.Fragment>
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