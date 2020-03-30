import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';

class InvitedUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        return (
            <div className={"invitations"}>
                <h1 style={{color:"red"}}> ***TODO Esta sección falta hacerla. los usuarios invitados deben quedar en su propio modelo de personas invitadas. 
                    Cuando confirmen inscribiendose si es un evento gratis, 
                    o pagando si es un evento pago pasan a asistentes(eventUsers)
                </h1>
            </div>
        );
    }
}

export default withRouter(InvitedUsers);