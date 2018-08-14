import React, {Component} from 'react';

class TimeoutSession extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className={`modal ${this.props.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-content">
                    <div className="box">
                        <p>Sesión Expiró</p>
                        <button className="button is-outlined" onClick={this.props.logout}>Iniciar Sesión</button>
                        {/*<button>Revisar eventos</button>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default TimeoutSession;