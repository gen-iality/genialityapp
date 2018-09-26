import React, {Component} from 'react';
import {FormattedDate, FormattedTime} from 'react-intl';
import ReactTable from "react-table";
import { Actions, UsersApi } from "../../helpers/request";
import { resolve } from "react-resolver";
import AddUser from "../modal/addUser";
import ImportUsers from "../modal/importUser";
import SearchComponent from "../shared/searchTable";
import Dialog from "../modal/twoAction";
import "react-table/react-table.css";
import axios from "axios";

class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    props.userReq,
            extraFields:[],
            addUser:    false,
            deleteUser: false,
            loading:    true,
            importUser: false,
            pages:      null,
            pageSize:   Math.ceil(props.userReq.meta.total/5),
            message:    {class:'', content:''},
            columns:    columns
        };
        this.modalImport = this.modalImport.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    async componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        const columns = this.state.columns;
        properties.map((extra,key)=>{
            return columns.push(
                {
                    Header: `${extra.name}`,
                    id: `${extra.name}`,
                    accessor: d => d.properties[extra.name]
                }
            )
        });
        columns.unshift(
            {
                Header: "Check",
                id: "checked_in",
                accessor: d => d,
                Cell: props => <div>
                    <input className="is-checkradio is-info is-small" id={"checkinUser"+props.value._id} disabled={props.value.checked_in}
                           type="checkbox" name={"checkinUser"+props.value._id} checked={props.value.checked_in} onClick={(e)=>{this.checkIn(props.value)}}/>
                    <label htmlFor={"checkinUser"+props.value._id}/>
                </div>,
                width: 80,
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
        )
        this.setState({ extraFields: properties });
    }

    addToList = (user) => {
        let users = this.state.users;
        let pos = users.map(function(e) { return e._id; }).indexOf(user._id);
        if(pos >= 0){
              users[pos] = user;
        }else users.push(user);
        this.setState({ users, auxArr:users });
    };

    searchResult = (data) => {
        !data ? this.setState({users:this.state.auxArr}) : this.setState({users:data})
    };

    modalUser = () => {
        this.setState((prevState) => {
            return {addUser:!prevState.addUser,edit:false}
        });
    };

    async modalImport() {
        const {data} = await UsersApi.getAll(this.props.eventId);
        this.setState((prevState) => {
            return {importUser:!prevState.importUser,users:data}
        });
    };

    closeModal = () => {
        this.setState({modal:false})
    };

    checkIn = (user,position) => {
        const users = this.state.users;
        user.checked_in = !user.checked_in;
        users[position] = user;
        Actions.edit('/api/eventUser/' + user._id + '/checkin','','')
            .then((response)=>{
                console.log(response);
            });
        this.setState((prevState) => {
            return {data:users,change:!prevState.change}
        })
    };

    fetchData(state, instance) {
        this.setState({ loading: true });

        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        requestData(
            this.state.userReq,
            this.props.eventId,
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
            console.log(res);
            const pageSize = Math.ceil(res.total/5);
            const page = Math.ceil(res.total/pageSize);
            this.setState({
                users: res.rows,
                pages: page,
                pageSize: pageSize,
                loading: false
            });
        });
    }

    enableDelete = () => {
        const cols = this.state.columns.map((col, i) => 2===i? {...col, show: !col.show}: col);
        this.setState((prevState) => {
            return {columns: cols, deleteUser: !prevState.deleteUser}
        })
    };

    render() {
        const {users, pages, pageSize, loading, columns} = this.state;
        return (
            <React.Fragment>
                <nav className="navbar is-transparent">
                    <div className="navbar-menu">
                        <div className="navbar-start">
                            <div className="navbar-item">
                                <SearchComponent  data={this.state.users} kind={'user'} searchResult={this.searchResult}/>
                            </div>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button className={`button is-rounded ${this.state.deleteUser?'is-danger':''}`} onClick={this.enableDelete}>
                                            <span className="icon is-small">
                                              <i className="far fa-trash-alt"/>
                                            </span>
                                        </button>
                                    </div>
                                    <p className="control">
                                        <button className="button is-inverted is-rounded">Leer Código QR</button>
                                    </p>
                                    <p className="control">
                                        <button className="button is-primary is-rounded" onClick={this.modalUser}>Agregar Usuario +</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="main">
                    <div className="preview-list">
                        <ReactTable
                            columns={columns}
                            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                            data={users}
                            pages={pages} // Display the total number of pages
                            loading={loading} // Display the loading overlay when we need it
                            onFetchData={this.fetchData} // Request new data when things change
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                            pageSize={pageSize}
                            className="-highlight"
                        />
                        {/*<table className="table is-fullwidth is-striped">
                                        <thead>
                                        <tr>
                                            <th>Check</th>
                                            <th/>
                                            {this.state.deleteUser&&(<th/>)}
                                            <th>
                                                <div className="navbar-item has-dropdown is-hoverable">
                                                    <a className="navbar-link">Estado</a>
                                                    <div className="navbar-dropdown is-boxed">
                                                        <a className="navbar-item">DRAFT</a>
                                                        <a className="navbar-item">CONFIRMED</a>
                                                        <a className="navbar-item">INVITED</a>
                                                        <a className="navbar-item">TODOS</a>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Rol</th>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            {
                                                this.state.extraFields.map((extra,key)=>{
                                                    return <th key={key}>{extra.name}</th>
                                                })
                                            }
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.users.map((item,key)=>{
                                                return <tr key={key}>
                                                    <td width="5%">
                                                        <input className="is-checkradio is-info is-small" id={"checkinUser"+item._id} disabled={item.checked_in}
                                                               type="checkbox" name={"checkinUser"+item._id} checked={item.checked_in} onClick={(e)=>{this.checkIn(item,key)}}/>
                                                        <label htmlFor={"checkinUser"+item._id}/>
                                                    </td>
                                                    <td width="5%">
                                                <span className="icon has-text-info action_pointer tooltip" data-tooltip="Edit User" onClick={(e)=>{this.setState({addUser:true,selectedUser:item,edit:true})}}>
                                                    <i className="fas fa-edit"/>
                                                </span>
                                                    </td>
                                                    {this.state.deleteUser&&(
                                                        <td width="5%">
                                                    <span className="icon has-text-danger action_pointer tooltip" data-tooltip="Delete User" onClick={(e)=>{this.setState({modal:true})}}>
                                                        <i className="fas fa-trash"/>
                                                    </span>
                                                        </td>
                                                    )}
                                                    <td>{item.state?item.state.name:''}</td>
                                                    <td><FormattedDate value={item.updated_at}/></td>
                                                    <td><FormattedTime value={item.updated_at}/></td>
                                                    <td>{item.rol?item.rol.name:''}</td>
                                                    <td>{item.properties.name}</td>
                                                    <td>{item.properties.email}</td>
                                                    {
                                                        this.state.extraFields.map((extra,key)=>{
                                                            return <td key={key}>{item.properties[extra.name]}</td>
                                                        })
                                                    }
                                                </tr>
                                            })
                                        }
                                        </tbody>
                                    </table>*/}
                    </div>
                </div>
                <AddUser handleModal={this.modalUser} modal={this.state.addUser} eventId={this.props.eventId}
                         value={this.state.selectedUser} addToList={this.addToList}
                         extraFields={this.state.extraFields} edit={this.state.edit}/>
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser} eventId={this.props.eventId} extraFields={this.state.extraFields}/>
                <Dialog modal={this.state.modal} title={'Borrar Usuario'}
                        content={<p>Seguro de borrar este usuario?</p>}
                        first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteEvent}}
                        message={this.state.message}
                        second={{title:'Cancelar',class:'',action:this.closeModal}}/>
            </React.Fragment>
        );
    }
}

const requestData = (users, eventId, pageSize, page, sorted, filtered) => {
    return new Promise((resolve, reject) => {
        console.log(users);
        console.log(filtered);
        console.log(page);
        console.log(sorted);
        console.log(pageSize);
        let filteredData = users;
        let res = {
            rows: filteredData.data,
            pages: filteredData.meta.total
        };
        // You can use the filters in your request, but you are responsible for applying them.
        if (filtered.length) {
            axios.get(`/api/user/event_users/${eventId}?filtered=[{"id":"${filtered[0].id}","value":"${filtered[0].value}"}]&pageSize=5`).then(({data})=>{
                filteredData = data;
                resolve({
                    rows: filteredData.data,
                    total: filteredData.meta.total
                })
            });
        }else{
            resolve(res)
        }
        /*
        // You can also use the sorting in your request, but again, you are responsible for applying it.
        const sortedData = _.orderBy(
            filteredData,
            sorted.map(sort => {
                return row => {
                    if (row[sort.id] === null || row[sort.id] === undefined) {
                        return -Infinity;
                    }
                    return typeof row[sort.id] === "string"
                        ? row[sort.id].toLowerCase()
                        : row[sort.id];
                };
            }),
            sorted.map(d => (d.desc ? "desc" : "asc"))
        );*/

    });
};

const columns = [
    {
        Header: "Estado",
        id: "state_id",
        accessor: d => d.state.name,
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
        Header: "Fecha",
        id: "updated_at",
        accessor: d => d.updated_at,
        Cell: props => <FormattedDate value={props.value}/>,
        sortable: false,
        filterable: false,
        width: 90
    },
    {
        Header: "Hora",
        id: "updated_at",
        accessor: d => d.updated_at,
        Cell: props => <FormattedTime value={props.value}/>,
        sortable: false,
        filterable: false,
        width: 80
    },
    {
        Header: "Rol",
        id: "rol_id",
        accessor: d => d.rol.name,
        Filter: ({ filter, onChange }) =>
            <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "all"}
            >
                <option value="all">TODOS</option>
                <option value="5af21f366ccde22b0776929d">Admin</option>
                <option value="5afaf657500a7104f77189ce">CheckIn</option>
                <option value="5afaf644500a7104f77189cd">Attendee</option>
            </select>
    },
    {
        Header: "Name",
        id: "properties.name",
        accessor: d => d.properties.name
    },
    {
        Header: "Email",
        id: "properties.email",
        accessor: d => d.properties.email,
        width: 200
    }
];

export default resolve("userReq", function(props) {
    let eventId = props.eventId;
    const url = `/api/user/event_users/${eventId}`;
    return axios.get(url).then(({data})=> data)
})(ListEventUser);
