import React, {Component} from 'react';

class ErrorServe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:true
        }
    }

    render() {
        return (
            <div className={`modal ${this.state.modal?'is-active':''}`}>
                <div className="modal-background"/>
                <div className="modal-content">
                    <p className="image is-4by3">
                        <img src="https://thealmostdone.com/wp-content/uploads/2018/02/Identify-and-fix-the-500-internal-server-error-in-WordPress.png" alt=""/>
                    </p>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={(e)=>{this.setState({modal:false})}}/>
            </div>
        );
    }
}

export default ErrorServe;