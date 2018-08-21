import React, {Component} from 'react';
import Importacion from "../../import-users/importacion";
import Preview from "../../import-users/preview";
import Result from "../../import-users/result";

class ImportUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step : 0,
            list : []
        }
    }

    nextStep = (i) => {
        this.setState({step:i})
    };

    handleXls = (list) => {
        console.log(list);
        this.setState((prevState) => {
            return {list,step:prevState.step+1}
        });
    };

    importUsers = () => {
        this.setState((prevState) => {
            return {step:prevState.step+1}
        });

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modal !== this.props.modal) {
            this.setState({modal:nextProps.modal});
        }
    }

    render() {
        const layout = [
            <Importacion handleXls={this.handleXls}/>,
            <Preview list={this.state.list} importUsers={this.importUsers}/>,
            <Result/>];
        return (
            <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Importar Usuarios</p>
                        <button className="delete" aria-label="close" onClick={this.props.handleModal}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="tabs is-fullwidth">
                            <ul>
                                <li className={`${this.state.step === 0 ? "is-active" : ""}`}><a onClick={(e)=>{this.nextStep(0)}}>1. Importación</a></li>
                                <li className={`${this.state.step === 1 ? "is-active" : ""}`}><a onClick={(e)=>{this.nextStep(1)}}>2. Previsualización</a></li>
                                <li className={`${this.state.step === 2 ? "is-active" : ""}`}><a onClick={(e)=>{this.nextStep(2)}}>3. Resultado</a></li>
                            </ul>
                        </div>
                        {
                            layout[this.state.step]
                        }
                    </section>
                </div>
            </div>
        );
    }
}

export default ImportUsers;