import React, {Component} from 'react';
import Importacion from "../import-users/importacion";
import Preview from "../import-users/preview";
import Result from "../import-users/result";
import Async from "async";

class ImportUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step : 0,
            list : [],
            toImport: []
        }
    }

    handleXls = (list) => {
        if(list.length>=2) {
            this.setState((prevState) => {
                return {list,step:prevState.step+1}
            });
        }
    };

    importUsers = () => {
        const users = this.state.list;
        const self = this;
        Async.waterfall([
            function (cb) {
                let newUsers =  users.filter(function(user) {
                    return user.used;
                });
                cb(null, newUsers)
            },
            function (newUsers, cb) {
                let long = newUsers[0].list.length;
                let itemsecondwaterfall = [];
                let initwaterfallcounter = 0;
                for(;initwaterfallcounter < long;){
                    itemsecondwaterfall[initwaterfallcounter] = {};
                    initwaterfallcounter ++
                }
                if(initwaterfallcounter === long){
                    cb(null,itemsecondwaterfall,newUsers)
                }
            },
            function(items,newUsers,cb){
                let len = newUsers.length;
                for(let i=0;i<items.length;i++){
                    for(let j=0;j<len;j++){
                        items[i][newUsers[j].key] = newUsers[j].list[i];
                    }
                }
                cb(items)
            }
        ],function (result) {
            console.log(result);
            self.setState((prevState) => {
                return {step:prevState.step+1,toImport:result}
            });
        });
    };

    closeModal = () => {
        this.setState({step:0,list:[]});
        this.props.handleModal()
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.modal !== this.props.modal) {
            this.setState({modal:nextProps.modal});
        }
    }

    render() {
        const layout = [
            <Importacion handleXls={this.handleXls}/>,
            <Preview list={this.state.list} eventId={this.props.eventId} importUsers={this.importUsers}/>,
            <Result list={this.state.toImport} eventId={this.props.eventId}/>];
        return (
            <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Importar Usuarios</p>
                        <button className="delete" aria-label="close" onClick={this.closeModal}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="tabs is-fullwidth">
                            <ul>
                                <li className={`${this.state.step === 0 ? "is-active" : ""}`}><a>1. Importación</a></li>
                                <li className={`${this.state.step === 1 ? "is-active" : ""}`}><a>2. Previsualización</a></li>
                                <li className={`${this.state.step === 2 ? "is-active" : ""}`}><a>3. Resultado</a></li>
                            </ul>
                        </div>
                        {
                            layout[this.state.step]
                        }
                    </section>
                    {
                        this.state.step === 2 && (
                            <footer className="modal-card-foot">
                                <button className="button is-success" onClick={this.closeModal}>Finalizar</button>
                                <button className="button" onClick={(e)=>{this.setState({step:0,list:[]});}}>Importar más</button>
                            </footer>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default ImportUsers;