import React, {Component} from 'react';
import {Actions, EventsApi, UsersApi} from "../../helpers/request";
import AddUser from "../modal/addUser";
import ImportUsers from "../modal/importUser";
import SearchComponent from "../shared/searchTable";
import {FormattedMessage} from "react-intl";
import Dialog from "../modal/twoAction";
import axios from "axios";

class UsersRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actualEvent:{},
            events: [],
            users: [],
            selection: [],
            auxArr: [],
            state: 'all',
            preselection: [],
            importUser: false,
            addUser:    false,
            checked: false,
            ticket: false,
            indeterminate: false
        };
        this.checkEvent = this.checkEvent.bind(this);
        this.modalImport = this.modalImport.bind(this);
    }

    async componentDidMount() {
        const listEvents = await EventsApi.getAll();
        const eventId = this.props.event._id;
        const resp = await UsersApi.getAll(eventId);
        const users = this.handleUsers(resp.data);
        const pos = listEvents.data.map((e)=> { return e._id; }).indexOf(eventId);
        listEvents.data.splice(pos,1);
        if(this.props.selection.length>0) this.setState({selection:this.props.selection});
        this.setState({events:listEvents.data,users,userAux:users,loading:false,actualEvent:this.props.event});
        this.handleCheckBox(users,this.state.selection)
    }

    //Solo agregar nombre, corre y id
    handleUsers = (list) => {
        let users = [];
        list.map(user=>{
            users.push({name:user.properties.name,email:user.properties.email,state:user.state.name,id:user._id})
        });
        return users;
    };

    //Traer los usuarios del evento seleccionado
    async checkEvent(event) {
        if(this.state.actualEvent._id !== event._id){
            const resp = await UsersApi.getAll(event._id);
            const users = this.handleUsers(resp.data);
            this.setState({ actualEvent:event, users, userAux:users });
            this.handleCheckBox(users,this.state.selection)
        }
    };

    handleCheckBox = (users, selection) => {
        let exist = 0,
            unexist = 0;
        for(let i=0;i<users.length;i++){
            const pos = selection.map((e)=> { return e.id; }).indexOf(users[i].id);
            (pos < 0) ?  unexist++ : exist++;
        }
        if(exist === users.length){
            this.refs.checkbox.indeterminate = false;
            this.refs.checkbox.checked = true;
        }
        else if(unexist === users.length){
            this.refs.checkbox.indeterminate = false;
            this.refs.checkbox.checked = false;
        }
        else {
            this.refs.checkbox.indeterminate = true;
            this.refs.checkbox.checked = false;
        }
    }

    //Agregar todos los usuarios a seleccionados
    toggleAll = () => {
        const selectAll = !this.state.selectAll;
        let selection = [...this.state.selection];
        const currentRecords = this.state.users;
        if (selectAll) {
            currentRecords.forEach(item => {
                selection.push(item);
            });
        }
        else{
            currentRecords.map(user=>{
                const pos = selection.map((e)=> { return e.id; }).indexOf(user.id);
                if (pos >= 0) {
                    selection = [
                        ...selection.slice(0, pos),
                        ...selection.slice(pos + 1)
                    ];
                }
            })
        }
        this.handleCheckBox(currentRecords,selection);
        this.setState({ selectAll, selection, auxArr: selection });
    };

    //Agregar o eliminar un usuario de seleccionados
    toggleSelection = (user) => {
        let selection = [...this.state.selection];
        let auxArr = [...this.state.auxArr];
        const keyIndex = selection.map((e)=> { return e.id; }).indexOf(user.id);
        if (keyIndex >= 0) {
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
            auxArr = [
                ...auxArr.slice(0, keyIndex),
                ...auxArr.slice(keyIndex + 1)
            ];
        } else {
            selection.push(user);
            auxArr.push(user);
        }
        this.handleCheckBox(this.state.users, selection);
        this.setState({ selection, auxArr });
    };

    //Revisar si usuario existe en seleccionados
    isChecked = (id) => {
        if(this.state.selection.length>0){
            const pos = this.state.selection.map((e)=> { return e.id; }).indexOf(id);
            return pos !== -1
        }
    };

    //Remover usuario de seleccionados
    removeThis = (user) => {
        let selection = [...this.state.selection];
        const keyIndex = selection.map((e) => {
            return e.id;
        }).indexOf(user.id);
        selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
        ];
        if(selection.length <= 0 ){
            this.setState({actualEvent:{}})
        }
        this.handleCheckBox(this.state.users,selection);
        this.setState({ selection, auxArr: selection });
    };

    //Modal fn
    modalUser = () => {
        this.setState((prevState) => {
            return {addUser:!prevState.addUser,edit:false}
        });
    };

    addToList = (user) => {
        let users = this.state.users;
        users.push({name:user.properties.name,email:user.properties.email,id:user._id});
        this.setState({ users, auxArr:users });
    };

    async modalImport() {
        const {data} = await UsersApi.getAll(this.props.event._id);
        const users = this.handleUsers(data);
        this.setState((prevState) => {
            return {importUser:!prevState.importUser,users}
        });
    };

    handleChange = (event) => {
        this.setState({state: event.target.value});
        let queryFilter = (event.target.value!=='all') && [{"id":"state_id","value":event.target.value}];
        queryFilter = JSON.stringify(queryFilter);
        let query = `?filtered=${queryFilter}`;
        axios.get(`/api/user/event_users/${this.state.actualEvent._id}${query}`).then(({data})=>{
            const users = this.handleUsers(data.data);
            this.setState({users})
        });
    };

    searchResult = (data) => {
        !data ? this.setState({selection:this.state.auxArr}) : this.setState({selection:data})
    };

    searchUsers = (data) => {
        !data ? this.setState({users:this.state.userAux}) : this.setState({users:data})
    };

    showTicket = () => {
        this.setState((prevState)=>{
            return {ticket:!prevState.ticket}
        })
    }

    sendTicket = () => {
        const { event } = this.props;
        const { selection } = this.state;
        const url = '/api/eventUser/bookEventUsers/'+event._id;
        let users = [];
        selection.map(item=>{
            users.push(item.id)
        });
        Actions.post(url, {eventUsersIds:users})
            .then((res) => {
                console.log(res);
                this.setState({redirect:true,url_redirect:'/edit/'+event._id+'/users'})
            });

    }

    render() {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column is-3">
                        <div className="box">
                            <div>
                                <div className="field">
                                    <input className="is-checkradio is-link" id="thisEvent"
                                           type="checkbox" name="thisEvent" onClick={(e)=>{this.checkEvent(this.props.event)}}
                                           checked={this.state.actualEvent._id === this.props.event._id}/>
                                    <label htmlFor="thisEvent">{this.props.event.name}</label>
                                </div>
                                {
                                    this.state.actualEvent._id === this.props.event._id && (
                                        <React.Fragment>
                                            <div className="field control">
                                                <button className="button is-light is-rounded is-small" onClick={this.modalUser}>Agregar Usuario</button>
                                            </div>
                                            <div className="field control">
                                                <button className="button is-light is-rounded is-small" onClick={this.modalImport}>Importar Usuarios</button>
                                            </div>
                                        </React.Fragment>
                                    )
                                }
                            </div>
                            <div>
                                <p>Importar asistentes de eventos pasados</p>
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
                    </div>
                    <div className="column is-6">
                        <strong className="is-5">
                            {
                                this.state.actualEvent._id === this.props.event._id ?
                                    'Usuarios Evento Actual' : 'Usuarios Otro Evento'
                            }
                        </strong>
                        <div className="columns">
                            <div className="column is-8">
                                <SearchComponent  data={this.state.users} kind={'invitation'} searchResult={this.searchUsers}/>
                            </div>
                            {
                                this.state.actualEvent._id === this.props.event._id &&
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Estado</label>
                                        <div className="control">
                                            <div className="select">
                                                <select value={this.state.state} onChange={this.handleChange}>
                                                    <option value="all">TODOS</option>
                                                    <option value="5b0efc411d18160bce9bc706">DRAFT</option>
                                                    <option value="5b859ed02039276ce2b996f0">BOOKED</option>
                                                    <option value="5ba8d200aac5b12a5a8ce748">RESERVED</option>
                                                    <option value="5ba8d213aac5b12a5a8ce749">INVITED</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="field">
                            <input className="is-checkradio is-info is-small" id={"checkallUser"}
                                   type="checkbox" name={"checkallUser"} ref="checkbox" onClick={this.toggleAll}/>
                            <label htmlFor={"checkallUser"}>Seleccionar Todos</label>
                        </div>
                        {
                            this.state.users.map((item,key)=>{
                                return <div key={key} className="media">
                                    <div className="media-left">
                                        <input className="is-checkradio is-info is-small" id={"checkinUser"+item.id}
                                               type="checkbox" name={"checkinUser"+item.id} checked={this.isChecked(item.id)} onClick={(e)=>{this.toggleSelection(item)}}/>
                                        <label htmlFor={"checkinUser"+item.id}/>
                                    </div>
                                    <div className="media-content">
                                        <p className="subtitle is-6">{item.name}</p>
                                        <p className="title is-5">{item.email}</p>
                                    </div>
                                    <div className="media-right">
                                        <small>{item.state}</small>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="column is-3">
                        <div className="box">
                            <div className="field">
                                <strong>Seleccionados {this.state.selection.length}</strong>
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
                            <button className="button is-rounded is-primary is-small"
                                    disabled={this.state.selection.length<=0}
                                    onClick={this.showTicket}>
                                Enviar Tiquete
                            </button>
                            <button className="button is-rounded is-small"
                                    disabled={this.state.selection.length<=0}
                                    onClick={(e)=>{this.props.userTab(this.state.selection)}}>
                                Enviar Invitaicón
                            </button>
                        </div>
                    </div>
                </div>
                <AddUser handleModal={this.modalUser} modal={this.state.addUser} eventId={this.props.event._id}
                         value={this.state.selectedUser} addToList={this.addToList}
                         extraFields={this.props.event.user_properties} edit={false}/>
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser} eventId={this.props.event._id} extraFields={this.props.event.user_properties}/>
                <Dialog modal={this.state.ticket} title='Tiquetes' message={{class:'',content:''}}
                        content={<p>
                            Está seguro de enviar {this.state.selection.length} tiquetes
                        </p>}
                        first={{
                            title:'Enviar',
                            class:'is-info',action:this.sendTicket}}
                        second={{
                            title:<FormattedMessage id="global.cancel" defaultMessage="Sign In"/>,
                            class:'',action:this.showTicket}}/>
            </React.Fragment>
        );
    }
}

export default UsersRsvp;