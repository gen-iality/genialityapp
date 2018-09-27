import React, {Component} from 'react';
import {FormattedDate, FormattedTime} from 'react-intl';
import ReactTable from "react-table";
import { resolve } from "react-resolver";
import axios from "axios";
import { Actions, UsersApi } from "../../helpers/request";
import AddUser from "../modal/addUser";
import ImportUsers from "../modal/importUser";
import SearchComponent from "../shared/searchTable";
import Dialog from "../modal/twoAction";
import "react-table/react-table.css";
import { FaSortUp, FaSortDown, FaSort} from "react-icons/fa";

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
            columns:    columns,
            sorted:     []
        };
        this.modalImport = this.modalImport.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        const columns = this.state.columns;
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
                        id: `${extra.name}`,
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
                           type="checkbox" name={"checkinUser"+props.value._id} checked={props.value.checked_in} onClick={(e)=>{this.checkIn(props.value)}}/>
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

    checkIn = (user) => {
        const users = this.state.users;
        let pos = users.map((e) => { return e._id; }).indexOf(user._id);
        if(pos >= 0){
            user.checked_in = !user.checked_in;
            users[pos] = user;
            Actions.edit('/api/eventUser/' + user._id + '/checkin','','')
                .then((response)=>{
                    console.log(response);
                });
            this.setState((prevState) => {
                return {data:users,change:!prevState.change}
            })
        }
    };

    //Table
    fetchData(state, instance) {
        this.setState({ loading: true });
        requestData(
            this.state.userReq,
            this.props.eventId,
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
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

    render() {
        const {users, pages, pageSize, loading, columns, sorted} = this.state;
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
                            manual
                            data={users}
                            pages={pages}
                            loading={loading}
                            onFetchData={this.fetchData}
                            filterable
                            onSortedChange={sorted => this.setState({ sorted })}
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                            pageSize={pageSize}
                            className="-highlight"
                        />
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
        let filteredData = users;
        let res = {rows: filteredData.data, pages: filteredData.meta.total};
        let query = '?';
        if (filtered.length) {
            let queryFilter = [];
            filtered.map(filter=>{
                if(filter.value!=='all') queryFilter.push({"id":filter.id,"value":filter.value,"comparator":"like"})
            });
            queryFilter = JSON.stringify(queryFilter);
            query = query+`filtered=${queryFilter}`;
        }
        if (sorted.length) {
            let querySort = [];
            sorted.map(sort=>{
                querySort.push({"id":sort.id,"order":sort.desc?"desc":"asc"})
            });
            querySort = JSON.stringify(querySort);
            query = query+`&orderBy=${querySort}`;
        }
        axios.get(`/api/user/event_users/${eventId}${query}&pageSize=5`).then(({data})=>{
            filteredData = data;
            res = {rows: filteredData.data, total: filteredData.meta.total};
            resolve(res)
        });

    });
};

const columns = [
    {},{},{},
    {
        Header: "Estado",
        id: "state_id",
        accessor: d => d.state.name,
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
        sortable: false,
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
    }
];

export default resolve("userReq", function(props) {
    let eventId = props.eventId;
    const url = `/api/user/event_users/${eventId}`;
    return axios.get(url).then(({data})=> data)
})(ListEventUser);
