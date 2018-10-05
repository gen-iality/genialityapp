import React, {Component} from 'react';
import Async from "async";
import {Actions} from "../../helpers/request";

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            imported: [],
            total: 0,
            saved: 0,
            fails: 0,
            updated: 0,
        }
    }

    componentDidMount() {
        const { list } = this.props;
        this.setState({list,total:list.length});
        this.uploadByOne(list)
    }

     uploadByOne = (users) => {
        const self = this;
        let imported = [];
        Async.forEachOf(users,(user,key,cb)=>{
            Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${this.props.eventId}`,user)
                .then((resp)=>{
                    console.log(resp);
                    if(resp.message === 'OK'){
                        imported[key] = {name:user.name,email:user.email,status:resp.status};
                        if(resp.status === 'UPDATED'){
                            self.setState((prevState) => {
                                return {updated:prevState.updated+1}
                            });
                        }
                        else{
                            self.setState((prevState) => {
                                return {saved:prevState.saved+1}
                            });
                        }
                    }
                })
                .catch(err => {
                    const {data} = err.response;
                    const msgE = data.email ? data.email[0] : '';
                    const msgN = data.name ? data.name[0] : '';
                    imported[key] = {name:user.name,email:user.email,status:'ERROR '+msgE + ' ' + msgN};
                    self.setState((prevState) => {
                        return {fails:prevState.fails+1}
                    });
                });
            cb()
        }, (err)=> {
            self.setState({imported});
            if( err ) console.log('Error en la consulta de información');
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Total</span>
                            <span className="tag">{this.state.total}</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Importados</span>
                            <span className="tag is-primary">{this.state.saved}</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Fallidos</span>
                            <span className="tag is-danger">{this.state.fails}</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Actualizados</span>
                            <span className="tag is-warning">{this.state.updated}</span>
                        </div>
                    </div>
                </div>
                {
                    this.state.imported.length>0 &&
                        <table className="table is-fullwidth is-striped">
                            <thead>
                                <tr>
                                    <th>Correo</th>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.imported.map((item,key)=>{
                                    return <tr key={key}>
                                        <td>{item.email}</td>
                                        <td>{item.name}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                }
            </React.Fragment>
        );
    }
}

export default Result;