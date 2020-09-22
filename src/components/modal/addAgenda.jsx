import React, {Component} from 'react';

class AddAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modal !== this.props.modal) {
            this.setState({modal:nextProps.modal});
        }
    }

    render() {
        return (
            <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Agenda</p>
                        <button className="delete" aria-label="close" onClick={this.props.handleModal}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Nombre</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input is-rounded" type="text" name={"name"} onChange={this.props.handleChange} placeholder="Evius.co"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        {
                            this.state.create?<div>Creando...</div>:
                                <div>
                                    <button className="button is-success" onClick={this.props.createAgenda} disabled={this.state.valid}>Crear</button>
                                    <button className="button" onClick={this.props.handleModal}>Cancel</button>
                                </div>
                        }
                        <p className="help is-danger">{this.state.msg}</p>
                    </footer>
                </div>
            </div>
        );
    }
}

export default AddAgenda;