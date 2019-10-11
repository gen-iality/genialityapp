import React, {Component, Fragment} from 'react';
import {FormattedDate, FormattedMessage, FormattedTime} from "react-intl";
import QrReader from "react-qr-reader";
import XLSX from "xlsx";
import { toast } from 'react-toastify';
import { FaCamera} from "react-icons/fa";
import { IoIosQrScanner, IoIosCamera } from "react-icons/io";
import {firestore} from "../../helpers/firebase";
import {BadgeApi, RolAttApi, SpacesApi} from "../../helpers/request";
import UserModal from "../modal/modalUser";
import ErrorServe from "../modal/serverError";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import Loading from "../loaders/loading";
import 'react-toastify/dist/ReactToastify.css';
import {connect} from "react-redux";
import CheckSpace from "./checkSpace";

const html = document.querySelector("html");
class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    [],
            pageOfItems:[],
            usersRef:   firestore.collection(`${props.event._id}_event_attendees`),
            pilaRef:    firestore.collection('pila'),
            total:      0,
            checkIn:    0,
            extraFields:[],
            spacesEvent:[],
            addUser:    false,
            editUser:   false,
            deleteUser: false,
            loading:    true,
            importUser: false,
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
            const {data} = await SpacesApi.byEvent(this.props.event._id);
            const listTickets = [...event.tickets];
            let {checkIn,changeItem} = this.state;
            this.setState({ extraFields: properties, rolesList, badgeEvent, spacesEvent: data });
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
                    switch (change.type) {
                        case "added":
                            if(user.checked_in) checkIn += 1;
                            change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
                            if(user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/)) acompanates += parseInt(user.properties.acompanates,10);
                            break;
                        case "modified":
                            if(user.checked_in) checkIn += 1;
                            newItems.unshift(user);
                            newItems.splice(change.oldIndex+1, 1);
                            changeItem = !changeItem;
                            break;
                        case "removed":
                            if(user.checked_in) checkIn -= 1;
                            newItems.splice(change.oldIndex, 1);
                            break;
                        default:
                            break;
                    }
                    user = {};
                });
                this.setState((prevState) => {
                    const usersToShow = (ticket.length <= 0 || stage.length <= 0) ?  [...newItems].slice(0,50) : [...prevState.users];
                    return {
                        userReq: newItems, auxArr: newItems, users: usersToShow, changeItem,
                        loading: false,total: newItems.length + acompanates, checkIn, clearSearch: !prevState.clearSearch
                    }
                });
            },(error => {
                console.log(error);
                this.setState({timeout:true,errorData:{message:error,status:708}});
            }));
        }catch (error) {
            this.setState({timeout:true,errorData:{message:error,status:710}});
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
        const html = document.querySelector("html");
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
                    })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                        toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
                    });
            }
        }
    };

    handleScan = (data) => {
        if (data) {
            let pos = this.state.userReq.map(e=>{return e._id}).indexOf(data);
            const qrData = {};
            if(pos>=0) {
                qrData.msg = 'User found';
                qrData.user = this.state.userReq[pos];
                qrData.another = !!qrData.user.checked_in;
                this.setState({qrData});
            }else{
                qrData.msg = 'User not found';
                qrData.another = true;
                qrData.user = null;
                this.setState({qrData})
            }
        }
    }
    handleError = (err) => {
        console.error(err);
    }
    readQr = () => {
        const {qrData} = this.state;
        if(qrData.user && !qrData.user.checked_in) this.checkIn(qrData.user);
        this.setState({qrData:{...this.state.qrData,msg:'',user:null}})
    };
    closeQr = () => {
        this.setState({qrData:{...this.state.qrData,msg:'',user:null},qrModal:false,newCC:'',tabActive:"camera"});
        html.classList.remove('is-clipped');
    };
    searchCC = () => {
        const usersRef = firestore.collection(`${this.props.eventId}_event_attendees`);
        let value = this.state.newCC;
        usersRef.where('_id','==',`${value}`)
            .get()
            .then((querySnapshot)=> {
                const qrData = {};
                if(querySnapshot.empty){
                    qrData.msg = 'User not found';
                    qrData.another = true;
                    qrData.user = null;
                    this.setState({qrData})
                }
                else{
                    querySnapshot.forEach((doc)=> {
                        qrData.msg = 'User found';
                        qrData.user = doc.data();
                        qrData.another = !!qrData.user.checked_in;
                        this.setState({qrData});
                    });
                }
            })
            .catch(error => {
                this.setState({found:0})
                console.log("Error getting documents: ", error);
            });
    };
    changeCC = (e) => {
        const {value} = e.target;
        this.setState({newCC:value})
    };

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    renderRows = () => {
        const items = [];
        const {extraFields, spacesEvent} = this.state;
        const limit = extraFields.length;
        this.state.pageOfItems.map((item,key)=>{
            return items.push(<tr key={key}>
                <td>
                    <span className="icon has-text-primary action_pointer"
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
                        const value = field.type !== 'boolean' ? item.properties[field.name] :
                            item.properties[field.name] ? 'SI' : 'NO';
                        return <td key={`${item._id}_${field.name}`}>{field.label}: {value}</td>
                    })
                }
                {
                    spacesEvent.map((space,key)=><td key={`space${key}`}>{space.name}: {(item.spaces&&item.spaces[space._id]) ? 'SI' : 'NO'}</td>)
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

    editQRUser = (user) => {
        this.setState({qrModal:false},()=>{
            this.openEditModalUser(user)
        });
    };

    render() {
        const {timeout, facingMode, qrData, userReq, users, total, checkIn, extraFields, spacesEvent, editUser, stage, ticket, ticketsOptions} = this.state;
        const {event:{event_stages},permissions} = this.props;
        return (
            <React.Fragment>
                <div className="checkin">
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
                    <div className="columns checkin-table">
                        <div className="column">
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
                                                        return <th key={key} className="is-capitalized">{field.name}</th>
                                                    })
                                                }
                                                {
                                                    spacesEvent.map((space,key)=><th key={key}>{space.name}</th>)
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
                    </div>
                    <div className="checkin-warning">
                        <p className="is-size-7 has-text-right has-text-centered-mobile">Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una búsqueda.</p>
                    </div>
                </div>
                {(!this.props.loading && editUser) &&
                    <UserModal handleModal={this.modalUser} modal={editUser} eventId={this.props.eventId}
                           ticket={ticket} tickets={this.props.event.tickets} rolesList={this.state.rolesList}
                           value={this.state.selectedUser} checkIn={this.checkIn} badgeEvent={this.state.badgeEvent}
                           extraFields={this.state.extraFields} spacesEvent={spacesEvent} edit={this.state.edit}/>
                }
                {/*<div className={`modal ${this.state.qrModal ? "is-active" : ""}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Lector QR</p>
                            <button className="delete is-large" aria-label="close" onClick={this.closeQr}/>
                        </header>
                        <section className="modal-card-body">
                            {
                                qrData.user ?
                                    <div>
                                        {qrData.user.checked_in && (<div>
                                            <h1 className="title">Usuario Chequeado</h1>
                                            <h2 className="subtitle">Fecha: <FormattedDate value={qrData.user.checked_at.toDate()}/> - <FormattedTime value={qrData.user.checked_at.toDate()}/></h2>
                                        </div>)}
                                        {extraFields.map((obj,key)=>{
                                            let val = qrData.user.properties[obj.name];
                                            if(obj.type === "boolean") val = qrData.user.properties[obj.name] ? "SI" : "NO";
                                            return <p key={key}>{obj.label}: {val}</p>})}
                                    </div>:
                                    <React.Fragment>
                                        <div className="tabs is-centered tab-qr">
                                            <ul>
                                                <li className={`${this.state.tabActive === 'camera' ? 'is-active' : ''}`}
                                                    onClick={e=>this.setState({tabActive:'camera'})}>
                                                    <a>
                                                        <div className="icon is-medium"><IoIosCamera/></div>
                                                        <span>Cámara</span>
                                                    </a>
                                                </li>
                                                <li className={`${this.state.tabActive === 'qr' ? 'is-active' : ''}`}
                                                    onClick={e=>this.setState({tabActive:'qr'})}>
                                                    <a>
                                                        <div className="icon is-medium"><IoIosQrScanner/></div>
                                                        <span>Pistola</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            {this.state.tabActive === 'camera' ?
                                                <React.Fragment>
                                                    <div className="field">
                                                        <div className="control has-icons-left">
                                                            <div className="select">
                                                                <select value={facingMode} onChange={e => this.setState({ facingMode: e.target.value })}>
                                                                    <option value="user">Selfie</option>
                                                                    <option value="environment">Rear</option>
                                                                </select>
                                                            </div>
                                                            <div className="icon is-small is-left"><FaCamera/></div>
                                                        </div>
                                                    </div>
                                                    <div className="columns is-mobile is-centered qr">
                                                        <QrReader
                                                            delay={500}
                                                            facingMode={facingMode}
                                                            onError={this.handleError}
                                                            onScan={this.handleScan}
                                                            style={{ width: "60%" }}
                                                            className={"column is-half is-offset-one-quarter"}
                                                        />
                                                    </div>
                                                </React.Fragment>:
                                                <React.Fragment>
                                                    <div className="field">
                                                        <div className="control">
                                                            <label className={`label has-text-grey-light is-capitalized required`}>Cédula</label>
                                                            <input className="input" name={'searchCC'} value={this.state.newCC} onChange={this.changeCC} autoFocus={true}/>
                                                        </div>
                                                    </div>
                                                    <button className="button is-info" onClick={this.searchCC}>Buscar</button>
                                                </React.Fragment>
                                            }
                                        </div>
                                    </React.Fragment>
                            }
                            <p>{qrData.msg}</p>
                        </section>
                        <footer className="modal-card-foot">
                            {
                                qrData.user&&(
                                    <React.Fragment>
                                        {
                                            !qrData.another &&
                                            <button className="button is-success is-outlined" onClick={e=>{this.checkIn(qrData.user)}}>Check User</button>
                                        }
                                        <button className="button is-info" onClick={e=>{this.editQRUser(qrData.user)}}>Edit User</button>
                                        <button className="button" onClick={this.readQr}>Read Other</button>
                                    </React.Fragment>
                                )
                            }
                        </footer>
                    </div>
                </div>*/}
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
            if (str && /[^a-z]/i.test(str)) str = str.toUpperCase();
            return info[key][obj] = str
        });
        if(item.rol) info[key]['rol'] = item.rol.label.toUpperCase();
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
