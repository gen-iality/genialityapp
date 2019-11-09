import React, {Component, Fragment} from 'react';
import {FormattedDate, FormattedMessage, FormattedTime} from "react-intl";
import XLSX from "xlsx";
import { toast } from 'react-toastify';
import {firestore} from "../../helpers/firebase";
import {BadgeApi, RolAttApi} from "../../helpers/request";
import UserModal from "../modal/modalUser";
import ErrorServe from "../modal/serverError";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import Loading from "../loaders/loading";
import 'react-toastify/dist/ReactToastify.css';
import {connect} from "react-redux";
import CheckSpace from "./checkSpace";
import QrModal from "./qrModal";
import {fieldNameEmailFirst, handleRequestError, sweetAlert} from "../../helpers/utils";

const html = document.querySelector("html");
class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    [],
            pageOfItems:[],
            listTickets:[],
            usersRef:   firestore.collection(`${props.event._id}_event_attendees`),
            pilaRef:    firestore.collection('pila'),
            total:      0,
            checkIn:    0,
            extraFields:[],
            spacesEvents:[],
            addUser:    false,
            editUser:   false,
            deleteUser: false,
            loading:    true,
            importUser: false,
            modalPoints: false,
            pages:      null,
            message:    {class:'', content:''},
            sorted:     [],
            rolesList:     [],
            facingMode: 'user',
            qrData:     {},
            clearSearch:false,
            changeItem: false,
            errorData: {},
            badgeEvent: {},
            serverError: false,
            stage: '',
            ticket: '',
            tabActive: 'camera',
            ticketsOptions: []
        };
    }

    async componentDidMount() {
        try{
            const { event } = this.props;
            const properties = event.user_properties;
            const rolesList = await RolAttApi.byEvent(this.props.event._id);
            const badgeEvent = await BadgeApi.get(this.props.event._id);
            const extraFields = fieldNameEmailFirst(properties);
            const listTickets = event.tickets ? [...event.tickets] : [];
            let {checkIn,changeItem} = this.state;
            this.setState({ extraFields, rolesList, badgeEvent });
            const { usersRef, ticket, stage } = this.state;
            let newItems= [...this.state.userReq];
            this.userListener = usersRef.orderBy("updated_at","desc").onSnapshot((snapshot)=> {
                let user,acompanates = 0;
                snapshot.docChanges().forEach((change)=> {
                    user = change.doc.data();
                    user._id = change.doc.id;
                    user.created_at = (typeof user.created_at === "object")?user.created_at.toDate():'sinfecha';
                    user.updated_at = (user.updated_at.toDate)? user.updated_at.toDate(): new Date();
                    user.tiquete = listTickets.find(ticket=>ticket._id === user.ticket_id);
                    if (change.type === 'added'){
                        if(user.checked_in) checkIn += 1;
                        change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
                        if(user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/)) acompanates += parseInt(user.properties.acompanates,10);
                    }
                    if (change.type === 'modified'){
                        if(user.checked_in) checkIn += 1;
                        newItems.unshift(user);
                        newItems.splice(change.oldIndex+1, 1);
                        changeItem = !changeItem;
                    }
                    if (change.type === 'removed'){
                        if(user.checked_in) checkIn -= 1;
                        newItems.splice(change.oldIndex, 1);
                    }
                });
                this.setState((prevState) => {
                    const usersToShow = (ticket.length <= 0 || stage.length <= 0) ?  [...newItems].slice(0,50) : [...prevState.users];
                    return {
                        userReq: newItems, auxArr: newItems, users: usersToShow, changeItem, listTickets,
                        loading: false,total: newItems.length + acompanates, checkIn, clearSearch: !prevState.clearSearch
                    }
                });
            },(error => {
                console.log(error);
                this.setState({timeout:true,errorData:{message:error,status:708}});
            }));
        }catch (error) {
            const errorData = handleRequestError(error);
            this.setState({timeout:true,errorData});
        }
    }

    componentWillUnmount() {
        this.userListener();
        //this.pilaListener()
    }

    exportFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const attendees = [...this.state.userReq].sort((a, b) => b.created_at - a.created_at);
        const data = parseData(attendees);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        XLSX.writeFile(wb, `usuarios_${this.props.event.name}.xls`);
    };

    addUser = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {editUser:!prevState.editUser,edit:false}
        });
    };

    modalUser = () => {
        html.classList.remove('is-clipped');
        this.setState((prevState) => {
            return {editUser:!prevState.editUser,edit:undefined}
        });
    };

    checkModal = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {qrModal:!prevState.qrModal}
        });
    };
    closeQRModal = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {qrModal:!prevState.qrModal}
        });
    };

    spaceQModal = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {spaceModal:!prevState.spaceModal}
        });
    };
    closeSpaceModal = () => {
        html.classList.remove('is-clipped');
        this.setState((prevState) => {
            return {spaceModal:!prevState.spaceModal}
        });
    };

    checkIn = (user) => {
        const {userReq,qrData} = this.state;
        const newUser = user;
        const { event } = this.props;
        qrData.another = true;
        const self = this;
        let pos = userReq.map((e) => { return e._id; }).indexOf(newUser._id);
        if(pos >= 0){
            //users[pos] = user;
            const userRef = firestore.collection(`${event._id}_event_attendees`).doc(newUser._id);
            if(!userReq[pos].checked_in){
                self.setState((prevState) => {
                    return {checkIn: prevState.checkIn+1, qrData}
                });
                userRef.update({
                    updated_at: new Date(),
                    checked_in: true,
                    checked_at: new Date()
                })
                    .then(()=> {
                        console.log("Document successfully updated!");
                        toast.success("Usuario Chequeado");
                    })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                        toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
                    });
            }
        }
    };

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    showMetaData = (value) => {
        html.classList.add('is-clipped');
        let content = "";
        Object.keys(value).map(key=>content+=`<p><b>${key}:</b> ${value[key]}</p>`);
        sweetAlert.simple("Información", content, "Cerrar", "#1CDCB7", ()=>{
            html.classList.remove('is-clipped');
        })
    };

    renderRows = () => {
        const items = [];
        const {extraFields, spacesEvent} = this.state;
        const limit = extraFields.length;
        this.state.pageOfItems.map((item,key)=>{
            return items.push(<tr key={key}>
                <td>
                    <span className="icon has-text-grey action_pointer" data-tooltip={"Editar"}
                          onClick={(e)=>{this.openEditModalUser(item)}}><i className="fas fa-edit"/></span>
                </td>
                <td>
                    {
                        (item.checked_in && item.checked_at) ? <p><FormattedDate value={item.checked_at.toDate()}/> <FormattedTime value={item.checked_at.toDate()}/></p>
                            :<div>
                                <input className="is-checkradio is-primary is-small" id={"checkinUser"+item._id} disabled={item.checked_in}
                                       type="checkbox" name={"checkinUser"+item._id} checked={item.checked_in} onChange={(e)=>{this.checkIn(item)}}/>
                                <label htmlFor={"checkinUser"+item._id}/>
                            </div>
                    }
                </td>
                {
                    extraFields.slice(0, limit).map((field,key)=>{
                        let value;
                        switch (field.type) {
                            case "boolean":
                                value = item.properties[field.name] ? 'SI' : 'NO';
                                break;
                            case "complex":
                                value = <span className="icon has-text-grey action_pointer" data-tooltip={"Detalle"}
                                      onClick={()=>this.showMetaData(item.properties[field.name])}><i className="fas fa-eye"/></span>;
                                break;
                            default:
                                value = item.properties[field.name]
                        }
                        return <td key={`${item._id}_${field.name}`}><span className="is-hidden-desktop">{field.label}:</span> {value}</td>
                    })
                }
                <td>{item.tiquete?item.tiquete.title:'SIN TIQUETE'}</td>
            </tr>)
        })
        return items
    };

    openEditModalUser = (item) => {
        html.classList.add('is-clipped');
        this.setState({editUser:true,selectedUser:item,edit:true})
    }

    changeStage = (e) => {
        const {value} = e.target;
        const {event:{tickets}} = this.props;
        if(value === '') {
            let check = 0, acompanates = 0;
            this.setState({checkIn:0,total:0},()=> {
                const list = this.state.userReq;
                list.forEach(user => {
                    if (user.checked_in) check += 1;
                    if(user.properties.acompanates && /^\d+$/.test(user.properties.acompanates))  acompanates += parseInt(user.properties.acompanates,10);
                });
                this.setState((state) => {
                    return {users: state.auxArr.slice(0, 50), ticket: '', stage: value, total: list.length+acompanates, checkIn: check}
                });
            })
        }
        else {
            const options = tickets.filter(ticket => ticket.stage_id === value);
            this.setState({stage: value, ticketsOptions: options});
        }
    };
    changeTicket = (e) => {
        const {value} = e.target;
        let check = 0, acompanates = 0;
        this.setState({checkIn:0,total:0},()=> {
            const list = value === '' ? this.state.userReq : [...this.state.userReq].filter(user=>user.ticket_id === value);
            list.forEach(user=>{
                if(user.checked_in) check += 1;
                if(user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/)) acompanates += parseInt(user.properties.acompanates,10);
            });
            const users = value === '' ? [...this.state.auxArr].slice(0,50) : list;
            this.setState({users,ticket:value,checkIn:check,total:list.length+acompanates});
        })
    };

    //Search records at third column
    searchResult = (data) => {
        !data ? this.setState({users:[]}) : this.setState({users:data})
    };

    render() {
        const {timeout, userReq, users, total, checkIn, extraFields, spacesEvent, editUser, stage, ticket, ticketsOptions} = this.state;
        const {event:{event_stages},permissions} = this.props;
        return (
            <React.Fragment>
                <div className="checkin" style={ { maxWidth: '1000px'} } >
                    <h2 className="title-section">Check In</h2>
                    <div className="columns">
                        <div className="search column is-8">
                            <SearchComponent  data={userReq} kind={'user'} event={this.props.event._id} searchResult={this.searchResult} clear={this.state.clearSearch}/>
                        </div>
                        <div className="checkin-tags-wrapper column is-4">
                            <div className="columns is-mobile is-multiline checkin-tags">
                                <div className="column is-narrow">
                                    <div className="tags is-centered">
                                        <span className="tag is-primary">{checkIn}</span>
                                        <span className="tag is-white">Ingresados</span>
                                    </div>
                                </div>
                                <div className="column is-narrow">
                                    <div className="tags is-centered">
                                        <span className="tag is-light">{total}</span>
                                        <span className="tag is-white">Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns is-mobile buttons-g">
                        {
                            userReq.length>0 && (
                                <div className="column is-narrow has-text-centered export button-c">
                                    <button className="button" onClick={this.exportFile}>
                                                <span className="icon">
                                                    <i className="fas fa-download"/>
                                                </span>
                                        <span className="text-button">Exportar</span>
                                    </button>
                                </div>
                            )
                        }
                        {
                            permissions.data.space ?
                                <div className="column is-narrow has-text-centered button-c">
                                    <button className="button is-inverted" onClick={this.spaceQModal}>
                                        <span className="icon"><i className="fas fa-qrcode"></i></span>
                                        <span className="text-button">CheckIn Espacio</span>
                                    </button>
                                </div>:
                                <div className="column is-narrow has-text-centered button-c">
                                    <button className="button is-inverted" onClick={this.checkModal}>
                                                <span className="icon">
                                                    <i className="fas fa-qrcode"></i>
                                                </span>
                                        <span className="text-button">Leer Código QR</span>
                                    </button>
                                </div>
                        }
                        <div className="column is-narrow has-text-centered button-c">
                            <button className="button is-primary" onClick={this.addUser}>
                                        <span className="icon">
                                            <i className="fas fa-user-plus"></i>
                                        </span>
                                        <span className="text-button">Agregar Usuario</span>
                                    </button>
                        </div>
                    </div>
                    {
                        (event_stages && event_stages.length > 0) &&
                        <div className='filter'>
                            <button className="button icon-filter">
                                <span className="icon">
                                    <i className="fas fa-filter"></i>
                                </span>
                                <span className="text-button">Filtrar</span>
                            </button>
                            <div className='filter-menu'>
                                <p className='filter-help'>Filtra Usuarios por Tiquete</p>
                                <div className="columns">
                                    <div className="column field">
                                        <div className="control">
                                            <label className="label">Etapa</label>
                                            <div className="control">
                                                <div className="select">
                                                    <select value={stage} onChange={this.changeStage} name={'stage'}>
                                                        <option value={''}>Escoge la etapa...</option>
                                                        {
                                                            event_stages.map((item,key)=>{
                                                                return <option key={key} value={item.stage_id}>{item.title}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column field">
                                        <div className="control">
                                            <label className="label">Tiquete</label>
                                            <div className="control">
                                                <div className="select">
                                                    <select value={ticket} onChange={this.changeTicket} name={'stage'}>
                                                        <option value={''}>Escoge el tiquete...</option>
                                                        {
                                                            ticketsOptions.map((item,key)=>{
                                                                return <option key={key} value={item._id}>{item.title}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="checkin-table">
                        {this.state.loading ? <Fragment>
                                <Loading/>
                                <h2 className="has-text-centered">Cargando...</h2>
                            </Fragment>:
                            <div className="table-wrapper">
                                <div className="table">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th/>
                                            <th className="is-capitalized">Check</th>
                                            {
                                                extraFields.map((field,key)=>{
                                                    return <th key={key} className="is-capitalized">{field.label}</th>
                                                })
                                            }
                                            <th>Tiquete</th>
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
                            </div>}
                    </div>
                    <div className="checkin-warning">
                        <p className="is-size-7 has-text-right has-text-centered-mobile">Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una búsqueda.</p>
                    </div>
                </div>
                {(!this.props.loading && editUser) &&
                    <UserModal handleModal={this.modalUser} modal={editUser} eventId={this.props.eventId}
                           ticket={ticket} tickets={this.state.listTickets} rolesList={this.state.rolesList}
                           value={this.state.selectedUser} checkIn={this.checkIn} badgeEvent={this.state.badgeEvent}
                           extraFields={this.state.extraFields} spacesEvent={spacesEvent} edit={this.state.edit}/>
                }
                {this.state.qrModal && <QrModal fields={extraFields} userReq={userReq} checkIn={this.checkIn} eventID={this.props.event._id}
                                                closeModal={this.closeQRModal} openEditModalUser={this.openEditModalUser}/>}
                {this.state.spaceModal && <CheckSpace space={permissions.data.space} userReq={userReq} spacesEvent={spacesEvent}
                                                      openEditModalUser={this.openEditModalUser} closeModal={this.closeSpaceModal} eventID={this.props.event._id}/>}
                {timeout&&(<ErrorServe errorData={this.state.errorData}/>)}
            </React.Fragment>
        );
    }
}

const parseData = (data) => {
    let info = [];
    data.map((item,key) => {
        info[key] = {};
        Object.keys(item.properties).map((obj, i) => {
            let str = item.properties[obj];
            if(typeof str === "number") str = str.toString();
            if(typeof str === "object") str = JSON.stringify(str);
            if(typeof str === "boolean") str = str ? "TRUE" : "FALSE";
            if (str && /[^a-z]/i.test(str)) str = str.toUpperCase();
            return info[key][obj] = str
        });
        if(item.rol) info[key]['rol'] = item.rol.label ? item.rol.label.toUpperCase() : item.rol.toUpperCase();
        info[key]['checkIn'] = item.checked_in?item.checked_in:'FALSE';
        info[key]['Hora checkIn'] = item.checked_at?item.checked_at.toDate():'';
        info[key]['Actualizado'] = item.updated_at;
        info[key]['Creado'] = item.created_at;
        info[key]['Tiquete'] = item.tiquete?item.tiquete.title.toUpperCase():'SIN TIQUETE';
        return info
    });
    return info
};

const mapStateToProps = state => ({
    permissions: state.permissions
});

export default connect(mapStateToProps)(ListEventUser);
