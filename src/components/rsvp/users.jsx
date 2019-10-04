import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {EventsApi, UsersApi} from "../../helpers/request";
import ImportUsers from "../modal/importUser";
import SearchComponent from "../shared/searchTable";
import { FormattedMessage } from "react-intl";
import Dialog from "../modal/twoAction";
import API from "../../helpers/request"
import Table from "../shared/table";
import { FaSortUp, FaSortDown, FaSort} from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUser from "../modal/addUser";
import ErrorServe from "../modal/serverError";
import connect from "react-redux/es/connect/connect";
import LogOut from "../shared/logOut";

class UsersRsvp extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            actualEvent:{},
            events: [],
            users: [],
            totalUsers: [],
            selection: [],
            auxArr: [],
            items: [],
            state: 'all',
            preselection: [],
            importUser: false,
            addUser:    false,
            checked: false,
            ticket: false,
            indeterminate: false,
            loading:    true,
            pages:      null,
            pageSize:   10,
            message:    {class:'', content:''},
            columns:    columns,
            sorted:     [],
            clearSearch: false,
            errorData: {},
            serverError: false
        };
        this.checkEvent = this.checkEvent.bind(this);
        this.modalImport = this.modalImport.bind(this);
        this.addToList = this.addToList.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
    }

    async componentDidMount() {
        this.myRef.current.addEventListener("scroll", () => {
            if (this.myRef.current.scrollTop + this.myRef.current.clientHeight >= this.myRef.current.scrollHeight - 20){
                this.loadMoreItems();
            }
        });
        try {
            const listEvents = await EventsApi.mine();
            const eventId = this.props.event._id;
            const properties = this.props.event.user_properties.slice(0,2);
            const resp = await UsersApi.getAll(eventId);
            const users = handleUsers(resp.data);
            const pos = listEvents.map((e)=> { return e._id; }).indexOf(eventId);
            listEvents.splice(pos,1);
            if(this.props.selection.length>0) this.setState({selection:this.props.selection,auxArr:this.props.selection});
            const columns = this.state.columns;
            let index = columns.map((e) => { return e.id; }).indexOf(`${properties[0].name}`);
            if(index<=-1) columns.push({
                ...this.genericHeaderArrows(),
                headerText: `${properties[0].name}`,
                id: `${properties[0].name}`,
                accessor: d => d[`${properties[0].name}`]
            },{
                ...this.genericHeaderArrows(),
                headerText: `${properties[1].name}`,
                id: `${properties[1].name}`,
                accessor: d => d[`${properties[1].name}`],
                width: 200
            });
            columns.splice(0, 1);
            columns.unshift(
                {
                    Header: (
                        <div className="field">
                            <input className="event-inv-check is-checkradio is-small" id={"checkallUser"}
                                   type="checkbox" name={"checkallUser"} onClick={this.toggleAll}/>
                            <label htmlFor={"checkallUser"}/>
                        </div>
                    ),
                    id: "checked_in",
                    accessor: d => d,
                    Cell: props => <div>
                        <input className="event-inv-check is-checkradio is-small" id={"checkinUser"+props.value.id}
                               type="checkbox" name={"checkinUser"+props.value.id} checked={this.isChecked(props.value.id)} onChange={(e)=>{this.toggleSelection(props.value)}}/>
                        <label htmlFor={"checkinUser"+props.value.id}/>
                    </div>,
                    width: 80,
                    sortable: false,
                    filterable: false,
                }
            );
            this.setState({events:listEvents,users,userReq:resp,userAux:users,loading:false,actualEvent:this.props.event});
            this.handleCheckBox(users,this.state.selection)
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                const {status} = error.response;
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false})
            } else {
                console.log('Error', error.message);
                if(error.request) console.log(error.request);
                this.setState({serverError:true,loader:false})
            }
            console.log(error.config);
        }
    }

    //Fetch user of selected event
    async checkEvent(event) {
        if(this.state.actualEvent._id !== event._id){
            try{
                const resp = await UsersApi.getAll(event._id);
                const users = handleUsers(resp.data);
                const columns = this.state.columns;
                let index = columns.map((e) => { return e.id; }).indexOf('state_id');
                if(index>=0) columns.splice(index,1);
                this.setState({ actualEvent:event, users, userAux:users });
                this.handleCheckBox(users,this.state.selection)
            }
            catch (error) {
                if (error.response) {
                    console.log(error.response);
                    const {status} = error.response;
                    if(status === 401) this.setState({timeout:true,loader:false});
                    else this.setState({serverError:true,loader:false})
                } else {
                    console.log('Error', error.message);
                    if(error.request) console.log(error.request);
                    this.setState({serverError:true,loader:false})
                }
                console.log(error.config);
            }
        }
    };

    handleCheckBox = (users, selection) => {
        let exist = 0,
            unexist = 0;
        const checkbox = document.getElementById("checkallUser");
        if(checkbox){
            for(let i=0;i<users.length;i++){
                const pos = selection.map((e)=> { return e.id; }).indexOf(users[i].id);
                (pos < 0) ?  unexist++ : exist++;
            }
            if(exist === users.length){
                checkbox.indeterminate = false;
                checkbox.checked = true;
            }
            else if(unexist === users.length){
                checkbox.indeterminate = false;
                checkbox.checked = false;
            }
            else {
                checkbox.indeterminate = true;
                checkbox.checked = false;
            }
        }
    };

    //Add all of users to selection state
    async toggleAll() {
        const selectAll = !this.state.selectAll;
        let selection = [...this.state.selection];
        const currentRecords = this.state.totalUsers;
        if (selectAll) {
            this.setState({loading:true});
            await asyncForEach(currentRecords, async (item) => {
                const pos = selection.map((e)=> { return e.id; }).indexOf(item.id);
                if(pos<=-1) await selection.push(item);
            });
            console.log('Done');
            this.setState({loading:false,items:selection.slice(0,10),scrollNow:10});
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
            });
            this.setState({loading:false,items:[],scrollNow:10});
        }
        this.setState({ selectAll, selection, auxArr: selection });
        this.handleCheckBox(currentRecords,selection);
    };

    //Add or remove user to selection state
    toggleSelection = (user) => {
        let selection = [...this.state.selection];
        let items = [...this.state.items];
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
            items = [
                ...items.slice(0, keyIndex),
                ...items.slice(keyIndex + 1)
            ];
        } else {
            selection.push(user);
            auxArr.push(user);
            items.push(user);
        }
        this.handleCheckBox(this.state.users, selection);
        this.setState({ selection, auxArr, items });
    };

    //Check if user exist at selection state
    isChecked = (id) => {
        if(this.state.selection.length>0){
            const pos = this.state.selection.map((e)=> { return e.id; }).indexOf(id);
            return pos !== -1
        }else return false
    };

    //Remove user at selection state
    removeThis = (user) => {
        let selection = [...this.state.auxArr];
        let items = [...this.state.items];
        const keyIndex = selection.map((e) => {
            return e.id;
        }).indexOf(user.id);
        selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
        ];
        items = [
            ...items.slice(0, keyIndex),
            ...items.slice(keyIndex + 1)
        ];
        this.handleCheckBox(this.state.users,selection);
        this.setState({ selection, auxArr: selection, items, clearSearch:true });
    };

    //Modal add single User
    modalUser = () => {
        const html = document.querySelector("html");
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {addUser:!prevState.addUser,edit:false}
        });
    };
    closeModal = () => {
        const html = document.querySelector("html");
        html.classList.remove('is-clipped');
        this.setState((prevState) => {
            return {addUser:!prevState.addUser,edit:undefined}
        });
    };

    //Add user to current list at middle column
    async addToList(user){
        console.log(user);
        try{
            const {data} = await UsersApi.getAll(this.props.event._id);
            const users = handleUsers(data);
            toast.success((<FormattedMessage id="toast.user_saved" defaultMessage="Ok!"/>));
            this.setState({ users });
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                const {status} = error.response;
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false})
            } else {
                console.log('Error', error.message);
                if(error.request) console.log(error.request);
                this.setState({serverError:true,loader:false})
            }
            console.log(error.config);
        }
    };

    //Modal import
    async modalImport() {
        try{
            const html = document.querySelector("html");
            const {data} = await UsersApi.getAll(this.props.event._id);
            const users = handleUsers(data);
            this.setState((prevState) => {
                !prevState.importUser ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
                return {importUser:!prevState.importUser,users}
            });
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                const {status} = error.response;
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false})
            } else {
                console.log('Error', error.message);
                if(error.request) console.log(error.request);
                this.setState({serverError:true,loader:false})
            }
            console.log(error.config);
        }
    };

    //Search records at third column
    searchResult = (data) => {
        !data ? this.setState({items:this.state.auxArr.slice(0,10)}) : this.setState({items:data})
    };
    displayItems = () => {
        const list = [], {items} = this.state;
        for (let i = 0; i < items.length; i++) {
            list.push(
                <div key={i} className="media">
                    <div className="media-content">
                        <p className="title is-6">{items[i].email}</p>
                        {/*<p className="subtitle is-7">{items[i]}</p>*/}
                    </div>
                    <div className="media-right">
                        <span className="icon has-text-danger is-small" onClick={(e)=>{this.removeThis(items[i])}}>
                            <i className="fa fa-times-circle"/>
                        </span>
                    </div>
                </div>
            );
        }
        return list;
    }
    loadMoreItems = () => {
        if(this.state.loadingState){
            return;
        }
        const moreItems = [...this.state.selection].slice(this.state.scrollNow,this.state.scrollNow+10);
        const newItems = [...this.state.items];
        moreItems.map(item=>{
            return newItems.push(item)
        })
        this.setState({ loadingState: true });
        setTimeout(() => {
            this.setState(prevState=>{
                return { items: newItems, loadingState: false, scrollNow:prevState.scrollNow+10 }
            });
        }, 1000);
    }

    //Button Ticket Logic
    showTicket = () => {
        const html = document.querySelector("html");
        this.setState((prevState)=>{
            !prevState.ticket ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
            return {ticket:!prevState.ticket}
        })
    };
    sendTicket = () => {
        const { event } = this.props;
        const { selection } = this.state;
        const url = '/api/eventUsers/bookEventUsers/'+event._id;
        const html = document.querySelector("html");
        let users = [];
        selection.map(item=>{
            return users.push(item.id)
        });
        this.setState({disabled:true});
        API.post(url, {eventUsersIds:users})
            .then((res) => {
                console.log(res);
                toast.success((<FormattedMessage id="toast.ticket_sent" defaultMessage="Ok!"/>));
                html.classList.remove('is-clipped');
                this.setState({redirect:true,url_redirect:'/event/'+event._id+'/messages',disabled:false})
            })
            .catch(e=>{
                console.log(e.response);
                toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
                this.setState({timeout:true,loader:false});
            });

    };

    //Table
    fetchData(state, instance) {
        this.setState({ loading: true });
        this.requestData(
            this.state.userReq,
            this.state.actualEvent._id,
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
            console.log(res);
            const pageSize = res.total;
            const page = Math.ceil(res.total / 10);
            //const page = Math.ceil(res.total/res.perPage);
            const pager = this.getPager(page, res.total, state.page, 10);
            let pageOfItems = (res.rows.length > 0) ? res.rows.slice(pager.startIndex, pager.endIndex + 1):[];
            this.setState({
                users: (res.rows.length <=0) ? [{id:'',name:'',email:''}]:pageOfItems,
                totalUsers: res.rows,
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
    requestData = (users, eventId, pageSize, page, sorted, filtered) => {
        return new Promise((resolve, reject) => {
            let filteredData = users;
            let res = {rows: filteredData.data, pages: filteredData.meta.total};
            let query = '?';
            if (filtered.length) {
                let queryFilter = [];
                filtered.map(filter=>{
                    if(filter.value!=='all') return queryFilter.push({"id":filter.id,"value":filter.value,"comparator":"like"})
                });
                queryFilter = JSON.stringify(queryFilter);
                query = query+`filtered=${queryFilter}`;
            }
            if (sorted.length) {
                let querySort = [];
                sorted.map(sort=>{
                    return querySort.push({"id":sort.id,"order":sort.desc?"desc":"asc"})
                });
                querySort = JSON.stringify(querySort);
                query = query+`&orderBy=${querySort}`;
            }
            API.get(`/api/events/${eventId}/eventUsers${query}&page=1&pageSize=10000`)
                .then(({data})=>{
                    filteredData = data;
                    const users = handleUsers(filteredData.data);
                    res = {rows: users, total: filteredData.meta.total, perPage: filteredData.meta.per_page};
                    resolve(res)
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response);
                        const {status,data} = error.response;
                        console.log('STATUS',status,status === 401);
                        if(status === 401) this.setState({timeout:true,loader:false});
                        else this.setState({serverError:true,loader:false,errorData:data})
                    } else {
                        let errorData = error.message;
                        console.log('Error', error.message);
                        if(error.request) {
                            console.log(error.request);
                            errorData = error.request
                        };
                        errorData.status = 708;
                        this.setState({serverError:true,loader:false,errorData})
                    }
                    console.log(error.config);
                });

        });
    };
    getPager = (totalPages, totalItems, currentPage, pageSize) => {
        const startIndex = currentPage * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startIndex: startIndex,
            endIndex: endIndex
        };
    }

    render() {
        if(this.state.redirect) return (<Redirect to={{pathname: this.state.url_redirect}} />);
        const {users, pages, pageSize, loading, columns, timeout, disabled, events, serverError, errorData} = this.state;
        return (
            <React.Fragment>
                <div className="columns is-multiline event-inv-send">
                    <div className="column is-12 title-col">
                        <h2 className="subtitle has-text-weight-bold">Invitar asistentes a {this.props.event.name}</h2>
                    </div>
                    <div className="column is-12 big-col">
                        <div className="columns">
                            <div className="column is-3">
                                <div className="">
                                    <div className="event-inv-users">
                                        <h3 className="event-inv-subtitle">Asistentes a este evento</h3>
                                        <div className="field event-inv-option">
                                            <input className="is-checkradio" id="thisEvent"
                                                type="radio" name="thisEvent" onChange={(e)=>{this.checkEvent(this.props.event)}}
                                                checked={this.state.actualEvent._id === this.props.event._id}/>
                                            <label htmlFor="thisEvent">{this.props.event.name}</label>
                                        </div>
                                        {
                                            this.state.actualEvent._id === this.props.event._id && (
                                                <React.Fragment>
                                                    <div className="field control">
                                                        <button className="btn-list button is-small" onClick={this.modalUser}>
                                                            <span>Agregar Usuario Nuevo</span>
                                                            <span className="icon is-small">
                                                                <i className="fa fa-plus"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div className="field control">
                                                        <button className="btn-list button is-small" onClick={this.modalImport}>
                                                            <span>Importar Usuarios de Excel</span>
                                                            <span className="icon is-small">
                                                                <i className="fa fa-plus"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </React.Fragment>
                                            )
                                        }
                                    </div>
                                    {
                                        events.length>=1&&
                                        <div className="event-inv-users">
                                            <h3 className="event-inv-subtitle">Importar asistentes de eventos pasados</h3>
                                            {
                                                events.map((event,key)=>{
                                                    return <div className="field event-inv-option" key={key}>
                                                        <input className="is-checkradio" id={`event${event._id}`}
                                                            type="radio" name={`event${event._id}`} onChange={(e)=>{this.checkEvent(event)}}
                                                            checked={this.state.actualEvent._id === event._id}/>
                                                        <label htmlFor={`event${event._id}`} className="has-text-weight-bold has-text-grey">{event.name}</label>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="column is-9 event-inv-table">
                                <h3 className="event-inv-subtitle">
                                    {
                                        this.state.actualEvent._id === this.props.event._id ?
                                            `Usuarios de ${this.props.event.name?this.props.event.name:''}` : `Usuarios de ${this.state.actualEvent.name?this.state.actualEvent.name:''}`
                                    }
                                </h3>
                                {users.length>=1?
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
                                        defaultPageSize={pageSize}
                                        showPageSizeOptions={false}
                                        className="-highlight"/>
                                    :<p>Aun no hay usuarios. Intenta crear uno o importarlo desde un excel</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns event-inv-selected">
                    <div className="column is-3 is-offset-9 inv-selected-wrapper">
                        <div className="dropdown is-up is-hoverable inv-selected-drop">
                            <div className="dropdown-trigger">
                                <button className="button is-text" aria-haspopup="true" aria-controls="dropdown-selected">
                                    <strong>Seleccionados: {this.state.auxArr.length}</strong>
                                </button>
                            </div>
                            <div className="dropdown-menu" id="dropdown-selected" role="menu">
                                <div className="dropdown-content inv-selected-content">
                                    {
                                        this.state.auxArr.length === 0 &&
                                        <div className="has-text-centered">
                                            <span className="has-text-weight-bold has-text-grey-dark">Aun no has seleccionado asistentes</span>
                                        </div>
                                    }
                                    {
                                        this.state.auxArr.length > 0 &&
                                        <SearchComponent  data={this.state.selection} kind={'invitation'} searchResult={this.searchResult} clear={this.state.clearSearch}/>
                                    }
                                    <div className="inv-selected-list" ref={this.myRef}>
                                        {this.displayItems()}
                                        {this.state.loadingState && <p>Loading...</p>}
                                    </div>
                                    {
                                        this.state.auxArr.length > 0 &&
                                        <div className="btn-wrapper">
                                            <div className="control">
                                                <button className="button is-primary tooltip"
                                                        data-tooltip="Se envía correo con Tiquete"
                                                        disabled={this.state.auxArr.length<=0}
                                                        onClick={this.showTicket}>
                                                    Enviar Tiquete
                                                </button>
                                            </div>
                                            <div className="control">
                                                <button className="button is-primary is-outlined tooltip"
                                                        data-tooltip="Se envía correo con Invitación"
                                                        disabled={this.state.selection.length<=0}
                                                        onClick={(e)=>{this.props.userTab(this.state.selection)}}>
                                                    Enviar Invitación
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {(!this.props.loading && this.state.addUser) &&
                <AddUser handleModal={this.closeModal} modal={this.state.addUser} eventId={this.props.event._id}
                         value={this.state.selectedUser} addToList={this.addToList}
                         extraFields={this.props.event.user_properties} edit={this.state.edit}/>}
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser} eventId={this.props.event._id} extraFields={this.props.event.user_properties}/>
                <Dialog modal={this.state.ticket} title='Tiquetes' message={{class:'',content:''}}
                        content={<p>
                            Está seguro de enviar {this.state.selection.length} tiquetes
                        </p>}
                        first={{
                            title:'Enviar',disabled:disabled,
                            class:'is-info',action:this.sendTicket}}
                        second={{
                            title:<FormattedMessage id="global.cancel" defaultMessage="Sign In"/>,
                            class:'',action:this.showTicket}}/>
                {timeout&&(<LogOut/>)}
                {serverError&&(<ErrorServe errorData={errorData}/>)}
            </React.Fragment>
        );
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

//Add only id, and the first two fields
const handleUsers = (list) => {
        let users = [];
        list.map((user,key)=>{
            users[key] = {};
            users[key]['id'] = user._id;
            users[key]['state'] = user.state.name;
            return Object.keys(user.properties).slice(0,2).map(field=>{
                return users[key][field] = user.properties[field];
            })
        });
        return users;
};

const columns = [
    {},
    {
        Header: "Estado",
        id: "state_id",
        accessor: d => d.state,
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
    }
];

export default UsersRsvp;

export default connect(mapStateToProps)(UsersRsvp);