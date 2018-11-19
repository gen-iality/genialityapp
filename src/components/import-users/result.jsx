import React, {Component} from 'react';
import Async from "async";
import {Actions} from "../../helpers/request";

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            ok: [],
            notok: [],
            imported: [],
            total: 0,
            saved: 0,
            fails: 0,
            updated: 0,
            step: 0,
        }
    }

    componentDidMount() {
        const { list } = this.props;
        this.setState({list});
        this.uploadByOne(list)
    }

     uploadByOne = (users) => {
        const self = this;
        let imported = [], ok = [], notok = [];
        const toImport = users.filter(user =>!this.isEmptyObject(user));
         Async.eachOfSeries(toImport,(user,key,cb)=>{
             if(!this.isEmptyObject(user)){
                 Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${this.props.eventId}`,user)
                     .then((resp)=>{
                         console.log(resp);
                         if(resp.message === 'OK'){
                             imported[key] = {name:user.name,email:user.email,status:resp.status};
                             ok[key] = {name:user.name,email:user.email,status:resp.status};
                             if(resp.status === 'UPDATED'){
                                 self.setState((prevState) => {
                                     return {updated:prevState.updated+1,total:prevState.total+1}
                                 });
                             }
                             else{
                                 self.setState((prevState) => {
                                     return {saved:prevState.saved+1,total:prevState.total+1}
                                 });
                             }
                         }
                         cb()
                     })
                     .catch(err => {
                         console.log(err);
                         if(err.response){
                             const {data} = err.response;
                             const msgE = data.email ? data.email[0] : '';
                             const msgN = data.name ? data.name[0] : '';
                             imported[key] = {name:user.name,email:user.email,status:'ERROR '+msgE + ' ' + msgN};
                             notok[key] = {name:user.name,email:user.email,status:'ERROR '+msgE + ' ' + msgN};
                         }else{
                             imported[key] = {name:user.name,email:user.email,status:'ERROR '};
                             notok[key] = {name:user.name,email:user.email,status:'ERROR '};
                         }
                         self.setState((prevState) => {
                             return {fails:prevState.fails+1,total:prevState.total+1}
                         });
                         cb()
                     });
             }
         }, (err)=> {
             self.setState({imported,ok,notok});
             if( err ) console.log('Error en la consulta de información');
         });
    };

    isEmptyObject = (o) => {
        return Object.keys(o).every(function(x) {
            return !o[x] || o[x]===null;
        });
    }

    render() {
        const {imported,total,saved,fails,updated,step,ok,notok} = this.state;
        const data = [this.state.notok,this.state.ok];
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Total</span>
                            <span className="tag">{total}</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Importados</span>
                            <span className="tag is-primary">{saved}</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Fallidos</span>
                            <span className="tag is-danger">{fails}</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Actualizados</span>
                            <span className="tag is-warning">{updated}</span>
                        </div>
                    </div>
                </div>
                {
                    imported.length>0 &&
                        <React.Fragment>
                            <div className="tabs is-fullwidth">
                                <ul>
                                    <li className={`${step === 0 ? "is-active" : ""}`} onClick={(e)=>{this.setState({step:0})}}><a>Incorrectos</a></li>
                                    <li className={`${step === 1 ? "is-active" : ""}`} onClick={(e)=>{this.setState({step:1})}}><a>Correctos</a></li>
                                </ul>
                            </div>
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
                                    data[step].map((item,key)=>{
                                        return <tr key={key}>
                                            <td>{item.email}</td>
                                            <td>{item.name}</td>
                                            <td>{item.status}</td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                        </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

export default Result;