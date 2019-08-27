import React, {Component} from "react";
import {withRouter} from "react-router-dom";

class Certificado extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <p className="subtitle is-5">
                                <strong>{this.props.data.name}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button is-info">Tags disponibles</button>
                        </div>
                        <div className="level-item">
                            <button className="button is-primary">Preview</button>
                        </div>
                        <div className="level-item">
                            <button className="button">Cancelar</button>
                        </div>
                        <div className="level-item">
                            <button className="button is-success">Guardar</button>
                        </div>
                    </div>
                </nav>
                <div>
                    Certificado
                </div>
            </div>
        )
    }
}

export default withRouter(Certificado)
