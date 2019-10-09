import React, {Component} from 'react';
import {firestore} from "../../helpers/firebase";
import QrReader from "react-qr-reader";
import { FaCamera} from "react-icons/fa";
import { IoIosQrScanner, IoIosCamera } from "react-icons/io";
import XLSX from "xlsx";
import UserModal from "../modal/modalUser";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import {FormattedDate, FormattedMessage, FormattedTime} from "react-intl";
import Loading from "../loaders/loading";
import connect from "react-redux/es/connect/connect";
import ErrorServe from "../modal/serverError";
import Select from 'react-select';
import PointCheckin from "../modal/pointCheckin";

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
            estados:    {DRAFT:0,BOOKED:0,RESERVED:0,INVITED:0},
            extraFields:[],
            addUser:    false,
            editUser:   false,
            deleteUser: false,
            loading:    true,
            importUser: false,
            modalPoints: false,
            pages:      null,
            message:    {class:'', content:''},
            sorted:     [],
            facingMode: 'user',
            qrData:     {},
            clearSearch:false,
            changeItem: false,
            errorData: {},
            serverError: false,
            stage: '',
            ticket: '',
            tabActive: 'camera',
            ticketsOptions: []
        };
    }

    componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        const listTickets = [...event.tickets];
        const {states} = this.props;
        let {checkIn,changeItem} = this.state;
        this.setState({ extraFields: properties });
        const { usersRef, ticket, stage } = this.state;
        let newItems= [...this.state.userReq];
        this.userListener = usersRef.orderBy("updated_at","desc").onSnapshot((snapshot)=> {
            let user,acompanates = 0;
            snapshot.docChanges().forEach((change)=> {
                user = change.doc.data();
                user._id = change.doc.id;
                user.state = states.find(x => x.value === user.state_id);
                user.created_at = (typeof user.created_at === "object")?user.created_at.toDate():'sinfecha';
                user.updated_at = (user.updated_at.toDate)? user.updated_at.toDate(): new Date();
                user.tiquete = listTickets.find(ticket=>ticket._id === user.ticket_id);
                if (change.type === 'added'){
                    if(user.checked_in) checkIn += 1;
                    change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
                    if(user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/)) acompanates += parseInt(user.properties.acompanates,10);
                    this.statesCounter(user.state.value);
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
                    userReq: newItems, auxArr: newItems, users: usersToShow, changeItem,
                    loading: false,total: newItems.length, checkIn, clearSearch: !prevState.clearSearch
                }
            });
        },(error => {
            console.log(error);
            this.setState({timeout:true,errorData:{message:error,status:708}});
        }));
        /*this.pilaListener = pilaRef.onSnapshot({
            includeMetadataChanges: true
        },querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                console.log('from cache ==>> ',querySnapshot.metadata.fromCache, '===>> _hasPendingWrites ',change.doc._hasPendingWrites);
                const data = change.doc.data();
                data.created_at = Moment(data.created_at.toDate()).format('YYYY-MM-DD HH:mm');
                data.updated_at = Moment(data.updated_at.toDate()).format('YYYY-MM-DD HH:mm');
                if(data.checked_at) data.checked_at= Moment(data.checked_at.toDate()).format('YYYY-MM-DD HH:mm');
                /!*if (change.type === 'added') {
                    pilaRef.doc(change.doc.id)
                        .onSnapshot({
                            includeMetadataChanges: true
                        }, (doc) => {
                            if(!doc._hasPendingWrites){
                                console.log('this is data: ', data)
                                Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${event._id}`,{"properties":data.properties,"role_id":data.role_id,"state_id":data.state_id,"checked_in": data.checked_in,"role_id": data.rol_id,    "state_id": data.state_id })
                                    .then((response)=>{
                                        console.log(response);
                                        pilaRef.doc(change.doc.id).delete();
                                        if(response.status == "CREATED"){
                                            usersRef.doc(change.doc.id).delete();
                                        }
                                    })
                            }
                        });
                }
                if (change.type === 'modified') {
                    pilaRef.doc(change.doc.id)
                        .onSnapshot({
                            includeMetadataChanges: true
                        }, (doc) => {
                            if(!doc._hasPendingWrites){
                                Actions.put(`/api/eventUsers/${event._id}`,data)
                                    .then((response) => {
                                        console.log('desenpilando ==>',change.doc.data());
                                        pilaRef.doc(change.doc.id).delete();
                                        console.log(response);
                                    })
                            }
                        });
                }
                if (change.type === 'removed') {
                }*!/
            });
        }, err => {
            console.log(`Encountered error: ${err}`);
        });*/
    }

    componentWillUnmount() {
        this.userListener();
        //this.pilaListener()
    }

    statesCounter = (state,old) => {
        const {states} = this.props;
        const item = states.find(x => x.value === state);
        const old_item = states.find(x => x.value === old);
        if(state && !old){
            this.setState(prevState=>{
                return {estados:{...this.state.estados,[item.label]:prevState.estados[item.label]+1}}
            });
        }
        if(old && state){
            this.setState(prevState=>{
                return {estados:{...this.state.estados,[old_item.label]:prevState.estados[old_item.label]-1,[item.label]:prevState.estados[item.label]+1}}
            })
        }
        if(old && !state){
            this.setState(prevState=>{
                return {estados:{...this.state.estados,[old_item.label]:prevState.estados[old_item.label]-1}}
            })
        }
    };

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
        const html = document.querySelector("html");
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {qrModal:!prevState.qrModal}
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
        if(qrData.user && !qrData.user.checked_in){
            this.checkIn(qrData.user)
        }
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
        const {extraFields} = this.state;
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
                <td>{item.state.label}</td>
                {
                    extraFields.slice(0, limit).map((field,key)=>{
                        const value = field.type !== 'boolean' ? item.properties[field.name] :
                            item.properties[field.name] ? 'SI' : 'NO';
                        return <td key={`${item._id}_${field.name}`}>{field.label}: {value}</td>
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
            this.setState({estados:{...this.state.estados,DRAFT:0,BOOKED:0,RESERVED:0,INVITED:0},checkIn:0,total:0},()=> {
                const list = this.state.userReq;
                list.forEach(user => {
                    if (user.checked_in) check += 1;
                    if(user.properties.acompanates && /^\d+$/.test(user.properties.acompanates))  acompanates += parseInt(user.properties.acompanates,10);
                    this.statesCounter(user.state.value);
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
        this.setState({estados:{...this.state.estados,DRAFT:0,BOOKED:0,RESERVED:0,INVITED:0},checkIn:0,total:0},()=> {
            const list = value === '' ? this.state.userReq : [...this.state.userReq].filter(user=>user.ticket_id === value);
            list.forEach(user=>{
                if(user.checked_in) check += 1;
                if(user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/)) acompanates += parseInt(user.properties.acompanates,10);
                this.statesCounter(user.state.value);
            });
            const users = value === '' ? [...this.state.auxArr].slice(0,50) : list;
            this.setState({users,ticket:value,checkIn:check,total:list.length+acompanates});
        })
    };

    //Search records at third column
    searchResult = (data) => {
        !data ? this.setState({users:[]}) : this.setState({users:data})
    };

    handlePoints = (flag) => {
        flag ? html.classList.add('is-clipped') : html.classList.remove('is-clipped')
        this.setState({modalPoints:flag})
    };

    editQRUser = (user) => {
        this.setState({qrModal:false},()=>{
            this.openEditModalUser(user)
        });
    };

    render() {
        const {timeout, facingMode, qrData, userReq, users, total, checkIn, extraFields, estados, editUser, stage, ticket, ticketsOptions} = this.state;
        const {event:{event_stages}} = this.props;
        // Dropdown para movil
        const options = [{ value:'1', label:
            <div className="checkin-tags-wrapper" >
              <div className="columns is-mobile is-multiline checkin-tags">
                <div className="column is-narrow">
                    <div className="tags is-centered">
                        <span className="tag is-primary">{checkIn}</span>
                        <span className="tag is-white">Check In</span>
                    </div>
                </div>
                {
                    Object.keys(estados).map(item=>{
                        return <div className="column is-narrow" key={item}>
                                    <div className="tags is-centered">
                                        <span className={'tag '+item}>{estados[item]}</span>
                                        <span className="tag is-white">{item}</span>
                                    </div>
                                </div>
                    })
                }
                <div className="column is-narrow">
                    <div className="tags is-centered">
                        <span className="tag is-light">{total}</span>
                        <span className="tag is-white">Total</span>
                    </div>
                </div>
            </div>
        </div>,disabled: 'yes'}
          ];
        return (
            <React.Fragment>
                <div className="checkin">
                    <div className="columns checkin-header">
                        <div className="column">
                            <div className="search">
                                {
                                    total>=1 && <SearchComponent  data={userReq} kind={'user'} event={this.props.event._id} searchResult={this.searchResult} clear={this.state.clearSearch}/>
                                }

                            </div>
                        </div>
                        <div className="column buttons-row">
                            <div className="columns is-mobile is-centered buttons-g">
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
                                <div className="column is-narrow has-text-centered button-c">
                                    <button className="button is-inverted" onClick={this.checkModal}>
                                        <span className="icon">
                                            <i className="fas fa-qrcode"></i>
                                        </span>
                                        <span className="text-button">Leer Código QR</span>
                                    </button>
                                </div>
                                <div className="column is-narrow has-text-centered button-c">
                                    <button className="button is-primary" onClick={this.addUser}>
                                        <span className="icon">
                                            <i className="fas fa-user-plus"></i>
                                        </span>
                                        <span className="text-button">Agregar Usuario</span>
                                    </button>
                                </div>
                                <div className="column is-narrow has-text-centered button-c">
                                    <button className="button" onClick={e=>{this.handlePoints(true)}}>
                                        <span className="text-button">Roles Asistentes</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="menu-p">
                        <Select isSearchable={false} options={options} placeholder="Totales"  isOptionDisabled={(option) => option.disabled === 'yes'}/>
                    </div>
                    <div className="checkin-tags-wrapper menu-g">
                        <div className="columns is-mobile is-multiline checkin-tags">
                            <div className="column is-narrow">
                                <div className="tags is-centered">
                                    <span className="tag is-primary">{checkIn}</span>
                                    <span className="tag is-white">Check In</span>
                                </div>
                            </div>
                            {
                                Object.keys(estados).map(item=>{
                                    return <div className="column is-narrow" key={item}>
                                                <div className="tags is-centered">
                                                    <span className={'tag '+item}>{estados[item]}</span>
                                                    <span className="tag is-white">{item}</span>
                                                </div>
                                            </div>
                                })
                            }
                            <div className="column is-narrow">
                                <div className="tags is-centered">
                                    <span className="tag is-light">{total}</span>
                                    <span className="tag is-white">Total</span>
                                </div>
                            </div>
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
                                    {
                                        users.length>0&&
                                        <React.Fragment>
                                            <div className="table">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th/>
                                                        <th className="is-capitalized">Check</th>
                                                        <th className="is-capitalized">Estado</th>
                                                        {
                                                            extraFields.map((field,key)=>{
                                                                return <th key={key} className="is-capitalized">{field.name}</th>
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
                                        </React.Fragment>
                                    }
                                </div>}
                        </div>
                    </div>
                    <div className="checkin-warning">
                        <p className="is-size-7 has-text-right has-text-centered-mobile">Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una búsqueda.</p>
                    </div>
                </div>
                {(!this.props.loading && editUser) &&
                    <UserModal handleModal={this.modalUser} modal={editUser} eventId={this.props.eventId}
                           states={this.props.states} ticket={ticket} tickets={this.props.event.tickets}
                           value={this.state.selectedUser} checkIn={this.checkIn} statesCounter={this.statesCounter}
                           extraFields={this.state.extraFields} edit={this.state.edit}/>
                }
                <div className={`modal ${this.state.qrModal ? "is-active" : ""}`}>
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
                </div>
                {this.state.modalPoints && <PointCheckin visible={this.state.modalPoints} eventID={this.props.event._id} close={this.handlePoints} />}
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
        if(item.state) info[key]['estado'] = item.state.label.toUpperCase();
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
    states: state.states.items,
    loading: state.states.loading,
    error: state.states.error
});

export default connect(mapStateToProps)(ListEventUser);
