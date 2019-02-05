import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {OrganizationApi, UsersApi} from "../../helpers/request";
import Loading from "../loaders/loading";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import ErrorServe from "../modal/serverError";
import ImportUsers from "../modal/importUser";
import UserOrg from "../modal/userOrg";
import XLSX from "xlsx";

class OrgUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    [],
            pageOfItems:[],
            extraFields:[],
            addUser:    false,
            editUser:   false,
            deleteUser: false,
            loading:    true,
            importUser: false,
            pages:      null,
            message:    {class:'', content:''},
            sorted:     [],
            clearSearch:false,
            errorData: {},
            serverError: false
        };
        this.modalImport = this.modalImport.bind(this);
    }

    async componentDidMount(){
        const {org} = this.props;
        console.log(org);
        try{
            const resp = await OrganizationApi.getUsers(org._id);
            this.setState((prevState) => {
                return {
                    userReq: resp.data, auxArr: resp.data, users: resp.data.slice(0,50),
                    extraFields:org.user_properties,loading: !prevState.loading, clearSearch: !prevState.clearSearch
                }
            });
        }
        catch (error) {
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
                }
                errorData.status = 708;
                this.setState({serverError:true,loader:false,errorData})
            }
            console.log(error.config);
        }
    }

    exportFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = parseData(this.state.userReq);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        XLSX.writeFile(wb, `usuarios_${this.props.org.name}.xls`);
    };

    modalUser = (modal) => {
        const {org} = this.props;
        const html = document.querySelector("html");
        html.classList.add('is-clipped');
        if(modal){
            this.setState({loading:true});
            OrganizationApi.getUsers(org._id)
                .then(resp=>{
                    this.setState((prevState) => {
                        return {
                            userReq: resp.data, auxArr: resp.data, users: resp.data.slice(0,50),
                            clearSearch: !prevState.clearSearch, loading:false
                        }
                    });

                })
                .catch (error => {
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
                    }
                    errorData.status = 708;
                    this.setState({serverError:true,loader:false,errorData})
                }
                console.log(error.config);
            })
        }
        this.setState((prevState) => {
            return {editUser:!prevState.editUser,edit:false}
        });
    };

    renderRows = () => {
        const items = [];
        const {extraFields} = this.state;
        const limit = extraFields.length;
        this.state.pageOfItems.map((item,key)=>{
            return items.push(<tr key={key}>
                <td>
                    <span className="icon has-text-primary action_pointer"
                          onClick={(e)=>{this.setState({editUser:true,selectedUser:item,edit:true})}}><i className="fas fa-edit"/></span>
                </td>
                {
                    extraFields.slice(0, limit).map((field,key)=>{
                        return <td key={`${item._id}_${field.name}`}>{item.properties[field.name]}</td>
                    })
                }
            </tr>)
        });
        return items
    };

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    //Modal import
    async modalImport() {
        try{
            const html = document.querySelector("html");
            const {data} = await OrganizationApi.getUsers(this.props.org._id);
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

    render() {
        const {timeout, userReq, users, total, extraFields, editUser, selectedUser, errorData, importUser} = this.state;
        const {org} = this.props;
        return (
            <React.Fragment>
                <div className="checkin">
                    <div className="columns checkin-header">
                        <div className="column">
                            <div>
                                {
                                    total>=1 && <SearchComponent  data={userReq} kind={'user'} filter={extraFields.slice(0,2)} searchResult={this.searchResult} clear={this.state.clearSearch}/>
                                }
                            </div>
                        </div>
                        <div className="column">
                            <div className="columns is-mobile is-multiline is-centered">
                                {
                                    userReq.length>0 && (
                                        <div className="column is-narrow has-text-centered">
                                            <button className="button" onClick={this.exportFile}>
                                                <span className="icon">
                                                    <i className="fas fa-download"/>
                                                </span>
                                                <span>Exportar</span>
                                            </button>
                                        </div>
                                    )
                                }
                                <div className="column is-narrow has-text-centered">
                                    <button className="button is-inverted" onClick={this.modalImport}>Importar</button>
                                </div>
                                <div className="column is-narrow has-text-centered">
                                    <button className="button is-primary" onClick={(e)=>{this.modalUser(false)}}>Agregar Usuario +</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns checkin-table">
                        <div className="column">
                            {this.state.loading ? <Loading/>:
                                <div className="table-wrapper">
                                    {
                                        users.length>0&&
                                        <React.Fragment>
                                            <div className="table">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th/>
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
                    <UserOrg handleModal={this.modalUser} modal={editUser} orgId={org._id}
                               value={selectedUser} extraFields={extraFields} edit={this.state.edit}/>
                }
                <ImportUsers handleModal={this.modalImport} modal={importUser} eventId={org._id} organization={true} extraFields={org.user_properties}/>
                {timeout&&(<ErrorServe errorData={errorData}/>)}
            </React.Fragment>
        );
    }
}

//Add only id, and the first two fields
const handleUsers = (list) => {
    let users = [];
    list.map((user,key)=>{
        users[key] = {};
        users[key]['id'] = user._id;
        return Object.keys(user.properties).slice(0,2).map(field=>{
            return users[key][field] = user.properties[field];
        })
    });
    return users;
};

const parseData = (data) => {
    let info = [];
    data.map((item,key) => {
        info[key] = {};
        Object.keys(item.properties).map((obj, i) => (
            info[key][obj] = item.properties[obj]
        ));
        return info
    });
    return info
};

const mapStateToProps = state => ({
    states: state.states.items,
    loading: state.states.loading,
    error: state.states.error
});

export default connect(mapStateToProps)(OrgUsers);