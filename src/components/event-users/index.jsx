import React, {Component} from 'react';
import {firestore} from "../../helpers/firebase";
import QrReader from "react-qr-reader";
import XLSX from "xlsx";
import UserModal from "../modal/modalUser";
import { FaCamera} from "react-icons/fa";
import LogOut from "../shared/logOut";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {roles, states} from "../../helpers/constants";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";

class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    [],
            pageOfItems:[],
            usersRef:   firestore.collection(`${props.event._id}_event_attendees`),
            total:      0,
            checkIn:    0,
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
            qrData:     {}
        };
    }

    componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        this.setState({ extraFields: properties });
        const {usersRef} = this.state;
        let newItems= [...this.state.userReq];
        usersRef.onSnapshot((snapshot)=> {
            let checkIn = 0;
            let user;
            snapshot.docChanges().forEach((change)=> {
                user = change.doc.data();
                checkIn += (user.checked_in);
                user._id = change.doc.id;
                user.state = states.find(x => x._id === user.state_id);
                user.rol = roles.find(x => x._id === user.rol_id);
                user.updated_at = user.updated_at.toDate();
                switch (change.type) {
                    case "added":
                        newItems.push(user);
                        break;
                    case "modified":
                        newItems[change.newIndex] = user;
                        break;
                    case "removed":
                        newItems.splice(change.newIndex, 1);
                        break;
                    default:
                        console.log('Ninguno');
                        break;
                }
            });
            this.setState({
                userReq: newItems, auxArr: newItems,
                loading: false,total: snapshot.size, checkIn
            });
        },(error => {
            console.log(error);
            this.setState({timeout:true});
        }));
    }

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
        this.setState((prevState) => {
            return {editUser:!prevState.editUser,edit:false}
        });
    };

    modalUser = () => {
        this.setState((prevState) => {
            return {editUser:!prevState.editUser,edit:undefined}
        });
    };

    checkIn = (user) => {
        const {userReq} = this.state;
        const { event } = this.props;
        const self = this;
        let pos = userReq.map((e) => { return e._id; }).indexOf(user._id);
        if(pos >= 0){
            user.checked_in = !user.checked_in;
            //users[pos] = user;
            const userRef = firestore.collection(`${event._id}_event_attendees`).doc(user._id);
            toast.success('CheckIn made successfully');
            self.setState((prevState) => {
                return {checkIn: prevState.checkIn+1}
            });
            userRef.update({
                updated_at: new Date(),
                checked_in: true
            })
                .then(()=> {
                    console.log("Document successfully updated!");
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                    toast.error('Something wrong. Try again later');
                });
        }
    };

    handleScan = (data) => {
        if (data) {
            let pos = this.state.userReq.map(e=>{return e._id}).indexOf(data);
            const qrData = {};
            if(pos>=0) {
                qrData.msg = 'User found';
                qrData.user = this.state.userReq[pos];
                console.log(qrData);
                this.setState({qrData});
            }else{
                qrData.msg = 'User not found';
                qrData.user = null;
                this.setState({qrData})
            }
        }
    }
    handleError = (err) => {
        console.error(err);
    }
    readQr = () => {
        let qrData = {
            user: null,
            msg: ''
        };
        this.setState({qrData})
    };

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    //Search records at third column
    searchResult = (data) => {
        !data ? this.setState({users:[]}) : this.setState({users:data})
    };

    render() {
        const {timeout, facingMode, qrData, userReq, users, total, checkIn} = this.state;
        return (
            <React.Fragment>
                <header>
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
                            <button className="button is-inverted" onClick={(e)=>{this.setState({qrModal:true})}}>Leer Código QR</button>
                        </div>
                        <div className="control">
                            <button className="button is-primary" onClick={this.addUser}>Agregar Usuario +</button>
                        </div>
                    </div>
                </header>
                <div className="main">
                    <div className="preview-list">
                        <div className="field is-grouped">
                            <div className="control">
                                <div className="tags has-addons">
                                    <span className="tag is-dark">Total</span>
                                    <span className="tag is-info">{total}</span>
                                </div>
                            </div>
                            <div className="control">
                                <div className="tags has-addons">
                                    <span className="tag is-dark">CheckIn</span>
                                    <span className="tag is-success">{checkIn}</span>
                                </div>
                            </div>
                            <SearchComponent  data={userReq} kind={'user'} searchResult={this.searchResult}/>
                        </div>
                        {
                            users.length>0&&
                            <React.Fragment>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th/>
                                        <th>Check</th>
                                        <th>Estado</th>
                                        <th>Correo</th>
                                        <th>Nombre</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.pageOfItems.map((item,key)=>{
                                            return <tr key={key}>
                                                <td>
                                                    <span className="icon has-text-info action_pointer"
                                                          onClick={(e)=>{this.setState({editUser:true,selectedUser:item,edit:true})}}><i className="fas fa-edit"/></span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <input className="is-checkradio is-info is-small" id={"checkinUser"+item._id} disabled={item.checked_in}
                                                               type="checkbox" name={"checkinUser"+item._id} checked={item.checked_in} onChange={(e)=>{this.checkIn(item)}}/>
                                                        <label htmlFor={"checkinUser"+item._id}/>
                                                    </div>
                                                </td>
                                                <td>{item.state.name}</td>
                                                <td>{item.properties.email}</td>
                                                <td>{item.properties.name}</td>
                                            </tr>
                                        })
                                    }
                                    </tbody>
                                </table>
                                <Pagination
                                    items={users}
                                    onChangePage={this.onChangePage}
                                />
                            </React.Fragment>
                        }
                    </div>
                </div>
                <UserModal handleModal={this.modalUser} modal={this.state.editUser} eventId={this.props.eventId}
                         value={this.state.selectedUser} checkIn={this.checkIn}
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
                                    <div>{
                                        Object.keys(qrData.user.properties).map((obj,key)=>{
                                            return <p key={key}>{obj}: {qrData.user.properties[obj]}</p>
                                        })
                                    }</div>:
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
                                        <QrReader
                                            delay={500}
                                            facingMode={facingMode}
                                            onError={this.handleError}
                                            onScan={this.handleScan}
                                            style={{ width: "60%" }}
                                        />
                                    </React.Fragment>
                            }
                            <p>{qrData.msg}</p>
                        </section>
                        <footer className="modal-card-foot">
                            {
                                qrData.user&&(
                                    <React.Fragment>
                                        {
                                            !qrData.user.checked_in &&
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
        info[key]['Actualizado'] = item.updated_at;
        return info
    });
    return info
};

export default ListEventUser;
