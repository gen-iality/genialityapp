import React, {Component} from 'react';
import {firestore} from "../../helpers/firebase";
import Moment from "moment"
import {Actions} from "../../helpers/request";
import QrReader from "react-qr-reader";
import { FaCamera} from "react-icons/fa";
import XLSX from "xlsx";
import UserModal from "../modal/modalUser";
import LogOut from "../shared/logOut";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {roles, states} from "../../helpers/constants";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import {FormattedDate, FormattedMessage, FormattedTime} from "react-intl";
import Loading from "../loaders/loading";

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
            pages:      null,
            message:    {class:'', content:''},
            sorted:     [],
            facingMode: 'user',
            qrData:     {},
            clearSearch:false,
            changeItem: false
        };
    }

    componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        let {checkIn,changeItem} = this.state;
        this.setState({ extraFields: properties });
        const { usersRef, pilaRef } = this.state;
        let newItems= [...this.state.userReq];
        this.userListener = usersRef.orderBy("updated_at","desc").onSnapshot((snapshot)=> {
            let user;
            snapshot.docChanges().forEach((change)=> {
                user = change.doc.data();
                user._id = change.doc.id;
                user.state = states.find(x => x._id === user.state_id);
                if(user.checked_in) checkIn = checkIn + 1;
                user.rol = roles.find(x => x._id === user.rol_id);
                user.updated_at = user.updated_at.toDate();
                if (change.type === 'added'){
                    change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
                    this.statesCounter(user.state._id);
                    if(change.doc._hasPendingWrites){
                        console.log('en pilando ==>',change.doc.data());
                        pilaRef.doc(change.doc.id).set(change.doc.data());
                    }
                }
                if (change.type === 'modified'){
                    newItems.unshift(user);
                    newItems.splice(change.oldIndex+1, 1);
                    changeItem = !changeItem;
                    if(change.doc._hasPendingWrites){
                        console.log('en pilando ==>',change.doc.data());
                        pilaRef.doc(change.doc.id).set(change.doc.data());
                    }
                }
                if (change.type === 'removed'){
                    newItems.splice(change.oldIndex, 1);
                }
            });
            this.setState((prevState) => {
                return {
                    userReq: newItems, auxArr: newItems, users: newItems.slice(0,50), changeItem,
                    loading: false,total: snapshot.size, checkIn, clearSearch: !prevState.clearSearch
                }
            });
        },(error => {
            console.log(error);
            this.setState({timeout:true});
        }));
        this.pilaListener = pilaRef.onSnapshot({
            includeMetadataChanges: true
        },querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                console.log('from cache ==>> ',querySnapshot.metadata.fromCache, '===>> _hasPendingWrites ',change.doc._hasPendingWrites);
                const data = change.doc.data();
                data.created_at = Moment(data.created_at.toDate()).format('YYYY-MM-DD HH:mm');
                data.updated_at = Moment(data.updated_at.toDate()).format('YYYY-MM-DD HH:mm');
                if(data.checked_at) data.checked_at= Moment(data.checked_at.toDate()).format('YYYY-MM-DD HH:mm');
                /*if (change.type === 'added') {
                    pilaRef.doc(change.doc.id)
                        .onSnapshot({
                            includeMetadataChanges: true
                        }, (doc) => {
                            if(!doc._hasPendingWrites){
                                Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${event._id}`,data)
                                    .then((response)=>{
                                        console.log(response);
                                        console.log('desenpilando ==>',change.doc.data());
                                        pilaRef.doc(change.doc.id).delete();
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
                }*/
            });
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
    }

    componentWillUnmount() {
        this.userListener();
        this.pilaListener()
    }

    statesCounter = (state,old) => {
        const item = states.find(x => x._id === state);
        const old_item = states.find(x => x._id === old);
        if(state && !old){
            this.setState(prevState=>{
                return {estados:{...this.state.estados,[item.name]:prevState.estados[item.name]+1}}
            });
        }
        if(old){
            this.setState(prevState=>{
                return {estados:{...this.state.estados,[old_item.name]:prevState.estados[old_item.name]-1,[item.name]:prevState.estados[item.name]+1}}
            })
        }
    };

    exportFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = parseData(this.state.userReq);
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
        const html = document.querySelector("html");
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
                toast.success(<FormattedMessage id="toast.checkin" defaultMessage="Ok!"/>);
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
                console.log(qrData);
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

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    renderRows = () => {
        const items = [];
        const {extraFields} = this.state;
        const limit = this.exportFile.length;
        this.state.pageOfItems.map((item,key)=>{
            return items.push(<tr key={key}>
                <td>
                    <span className="icon has-text-primary action_pointer"
                          onClick={(e)=>{this.setState({editUser:true,selectedUser:item,edit:true})}}><i className="fas fa-edit"/></span>
                </td>
                <td>
                    <div>
                        <input className="is-checkradio is-primary is-small" id={"checkinUser"+item._id} disabled={item.checked_in}
                               type="checkbox" name={"checkinUser"+item._id} checked={item.checked_in} onChange={(e)=>{this.checkIn(item)}}/>
                        <label htmlFor={"checkinUser"+item._id}/>
                    </div>
                </td>
                <td>{item.state.name}</td>
                <td>{item.properties.email}</td>
                <td>{item.properties.name}</td>
                {
                    extraFields.slice(0, limit).map((field,key)=>{
                        return <td key={item._id}>{item.properties[field.name]}</td>
                    })
                }
            </tr>)
        })
        return items
    };

    //Search records at third column
    searchResult = (data) => {
        !data ? this.setState({users:[]}) : this.setState({users:data})
    };

    render() {
        const {timeout, facingMode, qrData, userReq, users, total, checkIn, extraFields, estados} = this.state;
        return (
            <React.Fragment>
                <div className="checkin">
                    <div className="columns checkin-header">
                        <div className="column">
                            <div>
                                {
                                    total>=1 && <SearchComponent  data={userReq} kind={'user'} searchResult={this.searchResult} clear={this.state.clearSearch}/>
                                }
                            </div>
                        </div>
                        <div className="column">
                            <div className="field is-grouped is-pulled-right">
                                {
                                    userReq.length>0 && (
                                        <div className="control">
                                            <button className="button" onClick={this.exportFile}>
                                                <span className="icon">
                                                    <i className="fas fa-download"/>
                                                </span>
                                                <span>Exportar</span>
                                            </button>
                                        </div>
                                    )
                                }
                                <div className="control">
                                    <button className="button is-inverted" onClick={this.checkModal}>Leer Código QR</button>
                                </div>
                                <div className="control">
                                    <button className="button is-primary" onClick={this.addUser}>Agregar Usuario +</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="columns checkin-tags">
                        <div className="column">
                            <div className="field is-grouped">
                                <div className="control">
                                    <div className="tags">
                                        <span className="tag is-light">{total}</span>
                                        <span className="tag is-white">Total</span>
                                    </div>
                                </div>
                                <div className="control">
                                    <div className="tags">
                                        <span className="tag is-primary">{checkIn}</span>
                                        <span className="tag is-white">Check In</span>
                                    </div>
                                </div>
                                {
                                    Object.keys(estados).map(item=>{
                                        return <div className="control" key={item}>
                                            <div className="tags">
                                                <span className={'tag '+item}>{estados[item]}</span>
                                                <span className="tag is-white">{item}</span>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <p>Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una búsqueda.</p>

                    <div className="columns checkin-table">
                        <div className="column">
                            {this.state.loading ? <Loading/>:
                                <div className="table-wrapper">
                                    {
                                        users.length>0&&
                                        <React.Fragment>
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th/>
                                                    <th className="is-capitalized">Check</th>
                                                    <th className="is-capitalized">Estado</th>
                                                    <th className="is-capitalized">Correo</th>
                                                    <th className="is-capitalized">Nombre</th>
                                                    {
                                                        extraFields.map((field,key)=>{
                                                            return <th key={key} className="is-capitalized">{field.name}</th>
                                                        })
                                                    }
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.renderRows()
                                                }
                                                </tbody>
                                            </table>
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
                </div>
                <UserModal handleModal={this.modalUser} modal={this.state.editUser} eventId={this.props.eventId}
                         value={this.state.selectedUser} checkIn={this.checkIn} statesCounter={this.statesCounter}
                         extraFields={this.state.extraFields} edit={this.state.edit}/>
                <div className={`modal ${this.state.qrModal ? "is-active" : ""}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">QR Reader</p>
                            <button className="delete" aria-label="close" onClick={(e)=>{this.setState({qrModal:false})}}/>
                        </header>
                        <section className="modal-card-body">
                            {
                                qrData.user ?
                                    <div>
                                        {Object.keys(qrData.user.properties).map((obj,key)=>{
                                            return <p key={key}>{obj}: {qrData.user.properties[obj]}</p>})}
                                        {qrData.user.checked_in && (<p>Checked: <FormattedDate value={qrData.user.checked_at.toDate()}/> - <FormattedTime value={qrData.user.checked_at.toDate()}/></p>)}
                                    </div>:
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
                                        <div className="columns is-centered">
                                            <QrReader
                                                delay={500}
                                                facingMode={facingMode}
                                                onError={this.handleError}
                                                onScan={this.handleScan}
                                                style={{ width: "60%" }}
                                                className={"column is-half"}
                                            />
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
                                        <button className="button" onClick={this.readQr}>Read Other</button>
                                    </React.Fragment>
                                )
                            }
                        </footer>
                    </div>
                </div>
                {timeout&&(<LogOut/>)}
            </React.Fragment>
        );
    }
}

const parseData = (data) => {
    let info = [];
    data.map((item,key) => {
        info[key] = {};
        Object.keys(item.properties).map((obj, i) => (
            info[key][obj] = item.properties[obj]
        ));
        info[key]['estado'] = item.state.name;
        info[key]['rol'] = item.rol.name;
        info[key]['checkIn'] = item.checked_in?item.checked_in:'';
        info[key]['Hora checkIn'] = item.checked_at?item.checked_at:'';
        info[key]['Actualizado'] = item.updated_at;
        return info
    });
    return info
};

export default ListEventUser;
