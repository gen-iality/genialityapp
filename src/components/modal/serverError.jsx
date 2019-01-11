import React, {Component} from 'react';

class ErrorServe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:true
        }
    }

    componentDidMount() {
        const html = document.querySelector("html");
        html.classList.add('is-clipped');
    }

    closeModal = () => {
        const html = document.querySelector("html");
        html.classList.remove('is-clipped');
        this.setState({modal:false})
    };

    render() {
        const {errorData} = this.props;
        return (
            <div className={`modal ${this.state.modal?'is-active':''}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">ERROR: {errorData.status}</p>
                        <button className="delete" aria-label="close" onClick={this.closeModal}/>
                    </header>
                    <section className="modal-card-body">
                        <p>{errorData.message}</p>
                    </section>
                </div>
            </div>
        );
    }
}

export default ErrorServe;