import React, {Component} from 'react';
import {FormattedDate, FormattedTime} from 'react-intl';
import {firestore} from "../../helpers/firebase";
import QrReader from "react-qr-reader";
import _ from "lodash";
import XLSX from "xlsx";
import AddUser from "../modal/addUser";
import Dialog from "../modal/twoAction";
import { FaSortUp, FaSortDown, FaSort, FaCamera} from "react-icons/fa";
import Table from "../shared/table";
import LogOut from "../shared/logOut";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {roles, states} from "../../helpers/constants";

class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    [],
            usersRef:   firestore.collection(`${props.event._id}_event_attendees`),
            total:      0,
            checkIn:    0,
            extraFields:[],
            addUser:    false,
            deleteUser: false,
            loading:    true,
            importUser: false,
            pages:      null,
            message:    {class:'', content:''},
            columns:    columns,
            sorted:     [],
            facingMode: 'user',
            qrData:     {}
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        const {columns, usersRef, userReq} = this.state;
        let pos = columns.map((e) => { return e.id; }).indexOf('properties.name');
        if(pos<=0) columns.push({
            ...this.genericHeaderArrows(),
            headerText: "Name",
            id: "properties.name",
            accessor: d => d.properties.name
        },{
            ...this.genericHeaderArrows(),
            headerText: "Email",
            id: "properties.email",
            accessor: d => d.properties.email,
            width: 200
        });
        properties.map((extra,key)=>{
            let pos = columns.map((e) => { return e.id; }).indexOf(extra.name);
            if(pos<=0){
                return columns.push(
                    {
                        ...this.genericHeaderArrows(),
                        headerText: `${extra.name}`,
                        id: `properties.${extra.name}`,
                        accessor: d => d.properties[extra.name]
                    }
                )
            }
        });
        columns.splice(0, 3);
        columns.unshift(
            {
                Header: "Check",
                id: "checked_in",
                accessor: d => d,
                Cell: props => <div>
                    <input className="is-checkradio is-info is-small" id={"checkinUser"+props.value._id} disabled={props.value.checked_in}
                           type="checkbox" name={"checkinUser"+props.value._id} checked={props.value.checked_in} onChange={(e)=>{this.checkIn(props.value)}}/>
                    <label htmlFor={"checkinUser"+props.value._id}/>
                </div>,
                width: 80,
                sortable: false,
                filterable: false,
            },
            {
                Header: "",
                id: "edit",
                accessor: d => d,
                Cell: props => <span className="icon has-text-info action_pointer"
                                     onClick={(e)=>{this.setState({addUser:true,selectedUser:props.value,edit:true})}}><i className="fas fa-edit"/></span>,
                sortable: false,
                filterable: false,
                width:50
            },
            {
                Header: "",
                id: "delete",
                accessor: d => d._id,
                Cell: props => <span className="icon has-text-danger action_pointer tooltip" data-tooltip="Delete User"
                                     onClick={(e)=>{this.setState({modal:true})}}><i className="fas fa-trash"/></span>,
                sortable: false,
                filterable: false,
                width:50,
                show:false
            }
        );
        this.setState({ extraFields: properties });
        usersRef.onSnapshot((listUsers)=> {
            let users = [];
            let checkIn = 0;
            let user;
            listUsers.forEach((doc)=> {
                user = doc.data();
                const state = states.find(x => x._id === user.state_id);
                const rol = roles.find(x => x._id === user.rol_id);
                checkIn += (user.checked_in);
                user._id = doc.id;
                user.state = state;
                user.rol = rol;
                user.updated_at = user.updated_at.toDate();
                users.push(user);
            });
            this.setState({ userReq:users, total: listUsers.size, checkIn });
        },(error => {
            console.log(error);
            this.setState({timeout:true});
        }));
    }

    addToList = () => {
        const self = this;
        this.state.usersRef.get().then(function(listUsers) {
            let user;
            let users = [];
            listUsers.forEach((doc)=> {
                user = doc.data();
                const state = states.find(x => x._id === user.state_id);
                const rol = roles.find(x => x._id === user.rol_id);
                user._id = doc.id;
                user.state = state;
                user.rol = rol;
                user.updated_at = user.updated_at.toDate();
                users.push(user);
            });
            self.setState({ userReq:users, users });
            toast.success('User created successfully');
        }).catch (e => {
            console.log(e);
            toast.error("User can't be created");
            this.setState({timeout:true,loader:false});
        });
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

    modalUser = () => {
        this.setState((prevState) => {
            return {addUser:!prevState.addUser,edit:false}
        });
    };

    closeModal = () => {
        this.setState({modal:false})
    };

    checkIn = (user) => {
        const {users} = this.state;
        const { event } = this.props;
        const self = this;
        let pos = users.map((e) => { return e._id; }).indexOf(user._id);
        if(pos >= 0){
            user.checked_in = !user.checked_in;
            users[pos] = user;
            const userRef = firestore.collection(`${event._id}_event_attendees`).doc(user._id);
            toast.success('CheckIn made successfully');
            self.setState((prevState) => {
                return {users, checkIn: prevState.checkIn+1}
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
    }

    //Table
    fetchData(state, instance) {
        this.setState({ loading: true });
        this.requestData(
            this.state.userReq,
            this.props.eventId,
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
            console.log(res);
            this.setState({
                users: res.rows,
                pages: res.pages,
                loading: false
            });
        });
    }
    getSortedComponent = (id) => {
        // console.log('getSortedComponent sorted:',this.state.sorted);
        let sortInfo = this.state.sorted.filter(item => item.id === id);
        if (sortInfo.length) {
            // console.log('getSortedComponent sortInfo:',sortInfo[0].desc);
            if (sortInfo[0].desc === true) return <FaSortDown />;
            if (sortInfo[0].desc === false) return <FaSortUp />;
        }
        return <FaSort />;
    };
    genericHeaderArrows = () => {
        return {
            Header: props => {
                const Sorted = this.getSortedComponent(props.column.id);
                return (<span>{props.column.headerText} {Sorted}</span>);
            },
            headerStyle: { boxShadow: "none" }
        };
    };
    enableDelete = () => {
        const cols = this.state.columns.map((col, i) => 2===i? {...col, show: !col.show}: col);
        this.setState((prevState) => {
            return {columns: cols, deleteUser: !prevState.deleteUser}
        })
    };
    requestData = (users, eventId, pageSize, page, sorted, filtered) => {
        return new Promise((resolve, reject) => {
            let filteredData = users;
            if (filtered.length) {
                filtered.map(filter=>{
                    if(filter.value!=='all') {
                        if(filter.id==='state_id'){
                            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                                return filteredSoFar.filter(row => {
                                    return (row[nextFilter.id] + "").includes(nextFilter.value);
                                });
                            }, filteredData);
                        }else{
                            const id = filter.id.split('.')[1];
                            filteredData = filteredData.filter((item) =>{
                                return (item.properties[id].search(new RegExp(filter.value, 'i')) >= 0);
                            });
                        }
                    }
                    //if(filter.value!=='all') queryFilter.push({"id":filter.id,"value":filter.value,"comparator":"like"})
                });
            }
            const sortedData = _.orderBy(
                filteredData,
                sorted.map(sort => {
                    return row => {
                        const value = sort.id.split('.')[1];
                        return (row.properties[value] === null || row.properties[value] === undefined)
                            ? -Infinity: row.properties[value].toLowerCase();
                    };
                }),
                sorted.map(d => (d.desc ? "desc" : "asc"))
            );
            const res = {
                rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
                pages: Math.ceil(filteredData.length / pageSize)
            };
            setTimeout(() => resolve(res), 500);
        });
    };

    render() {
        const {users, pages, loading, columns, timeout, facingMode, qrData, userReq, total, checkIn} = this.state;
        return (
            <React.Fragment>
                <header>
                    <div className="field is-grouped is-pulled-right">
                        <div className="control">
                            <button className={`button ${this.state.deleteUser?'is-danger':''}`} onClick={this.enableDelete}>
                                <span className="icon is-small">
                                  <i className="far fa-trash-alt"/>
                                </span>
                            </button>
                        </div>
                        {
                            this.state.users.length>0 && (
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
                            <button className="button is-primary" onClick={this.modalUser}>Agregar Usuario +</button>
                        </div>
                    </div>
                </header>
                <div className="main">
                    {
                        userReq.length>0&&
                        <div className="preview-list">
                            <div className="field is-grouped is-grouped-multiline">
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
                            </div>
                            <Table
                                columns={columns}
                                manual
                                data={users}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.fetchData}
                                filterable
                                onSortedChange={sorted => this.setState({ sorted })}
                                defaultFilterMethod={(filter, row) =>
                                    String(row[filter.id]) === filter.value}
                                defaultPageSize={25}
                                className="-highlight"/>
                        </div>
                    }
                </div>
                <AddUser handleModal={this.modalUser} modal={this.state.addUser} eventId={this.props.eventId}
                         value={this.state.selectedUser} addToList={this.addToList} checkIn={this.checkIn}
                         extraFields={this.state.extraFields} edit={this.state.edit}/>
                <Dialog modal={this.state.modal} title={'Borrar Usuario'}
                        content={<p>Seguro de borrar este usuario?</p>}
                        first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteEvent}}
                        message={this.state.message}
                        second={{title:'Cancelar',class:'',action:this.closeModal}}/>
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

const columns = [
    {},{},{},
    {
        Header: "Estado",
        id: "state_id",
        accessor: d => d.state.name,
        width: 120,
        sortable: false,
        Filter: ({ filter, onChange }) =>
            <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "all"}
            >
                <option value="all">TODOS</option>
                <option value="5b0efc411d18160bce9bc706">DRAFT</option>
                <option value="5b859ed02039276ce2b996f0">BOOKED</option>
                <option value="5ba8d200aac5b12a5a8ce748">RESERVED</option>
                <option value="5ba8d213aac5b12a5a8ce749">INVITED</option>
            </select>
    },
    {
        Header: "Actualizado",
        id: "updated_at",
        accessor: d => d.updated_at,
        Cell: props => <span>
            <FormattedDate value={props.value}/> <FormattedTime value={props.value}/>
        </span>,
        sortable: false,
        filterable: false,
        width: 180
    }
];

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
