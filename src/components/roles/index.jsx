import React, {Component} from 'react';
import SearchComponent from "../shared/searchTable";
import Loading from "../loaders/loading";
import Pagination from "../shared/pagination";
import ErrorServe from "../modal/serverError";
import {firestore} from "../../helpers/firebase";

class AdminRol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users:      [],
            userReq:    [],
            pageOfItems:[],
            total:      0,
            checkIn:    0,
            estados:    {DRAFT:0,BOOKED:0,RESERVED:0,INVITED:0},
            extraFields:[]
        };
    }

    render() {
        const {timeout, userReq, users, total, checkIn, extraFields, estados} = this.state;
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
                                    <button className="button is-inverted" onClick={this.checkModal}>Leer Código QR</button>
                                </div>
                                <div className="column is-narrow has-text-centered">
                                    <button className="button is-primary" onClick={this.addUser}>Agregar Usuario +</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="checkin-tags-wrapper">
                        <div className="columns is-mobile is-multiline checkin-tags">
                            <div className="column is-narrow">
                                <div className="tags is-centered">
                                    <span className="tag is-primary">{checkIn}</span>
                                    <span className="tag is-white">Check In</span>
                                </div>
                            </div>
                        </div>
                        <div className="columns is-mobile is-multiline checkin-tags">
                            <div className="column is-narrow">
                                <div className="tags is-centered">
                                    <span className="tag is-light">{total}</span>
                                    <span className="tag is-white">Total</span>
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
                {timeout&&(<ErrorServe/>)}
            </React.Fragment>
        );
    }
}

export default AdminRol;