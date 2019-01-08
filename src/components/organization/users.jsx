import React, {Component} from 'react';
import SearchComponent from "../shared/searchTable";
import Loading from "../loaders/loading";
import Pagination from "../shared/pagination";
import UserModal from "../modal/modalUser";
import ErrorServe from "../modal/serverError";

class OrgUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    [],
            pageOfItems:[],
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
            clearSearch:false,
            changeItem: false,
            errorData: {},
            serverError: false
        }
    }

    async componentDidMount(){

    }

    render() {
        const {timeout, userReq, users, total, extraFields, editUser} = this.state;
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
                                    <button className="button is-inverted" onClick={this.checkModal}>Importar</button>
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
                <UserModal handleModal={this.modalUser} modal={editUser} eventId={this.props.eventId}
                           states={this.props.states}
                           value={this.state.selectedUser} checkIn={this.checkIn} statesCounter={this.statesCounter}
                           extraFields={this.state.extraFields} edit={this.state.edit}/>
                }
                {timeout&&(<ErrorServe errorData={this.state.errorData}/>)}
            </React.Fragment>
        );
    }
}

export default OrgUsers;