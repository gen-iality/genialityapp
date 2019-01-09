import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {UsersApi} from "../../helpers/request";
import Loading from "../loaders/loading";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import ErrorServe from "../modal/serverError";
import ImportUsers from "../modal/importUser";
import UserOrg from "../modal/userOrg";

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
            changeItem: false,
            errorData: {},
            serverError: false
        };
        this.modalImport = this.modalImport.bind(this);
    }

    async componentDidMount(){
        const {org} = this.props;
        this.setState({extraFields:org.user_properties,loading:false})
    }

    addUser = () => {
        const html = document.querySelector("html");
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {editUser:!prevState.editUser,edit:false}
        });
    };

    //Modal import
    async modalImport() {
        try{
            const html = document.querySelector("html");
            const {data} = await UsersApi.getAll(this.props.org._id);
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
        const {org,states} = this.props;
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
                                    <button className="button is-primary" onClick={this.addUser}>Agregar Usuario +</button>
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
                                                        <th className="is-capitalized">Check</th>
                                                        <th className="is-capitalized">Estado</th>
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
                    <UserOrg handleModal={this.modalUser} modal={editUser} eventId={org._id}
                               states={states} value={selectedUser} extraFields={extraFields} edit={this.state.edit}/>
                }
                <ImportUsers handleModal={this.modalImport} modal={this.state.importUser} eventId={org._id} extraFields={org.user_properties}/>
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
        users[key]['state'] = user.state.name;
        return Object.keys(user.properties).slice(0,2).map(field=>{
            return users[key][field] = user.properties[field];
        })
    });
    return users;
};

const mapStateToProps = state => ({
    states: state.states.items,
    loading: state.states.loading,
    error: state.states.error
});

export default connect(mapStateToProps)(OrgUsers);