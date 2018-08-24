import React, {Component} from 'react';

class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {first,second} = this.props;
        return (
            <div className={`modal ${this.props.modal ? "is-active" : ""}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{this.props.title}</p>
                    </header>
                    <section className="modal-card-body">
                        {this.props.content}
                    </section>
                    <footer className="modal-card-foot">
                        <button className={`button ${first.class}`} onClick={first.action}>{first.title}</button>
                        <button className={`button ${second.class}`}  onClick={second.action}>{second.title}</button>
                    </footer>
                </div>
            </div>
        );
    }
}

export default Dialog;