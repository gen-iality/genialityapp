import React, {Component} from 'react';

class ConfirmRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        console.log(this.props);
        return (
            <div>Envió !!!</div>
        );
    }
}

export default ConfirmRsvp;