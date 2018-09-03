import React, {Component} from 'react';

class UsersRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="columns">
                <div className="column">Eventos</div>
                <div className="column is-8">Usuarios</div>
                <div className="column">Para Enviar</div>
            </div>
        );
    }
}

export default UsersRsvp;