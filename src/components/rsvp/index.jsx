import React, {Component} from 'react';
import UsersRsvp from "./users";
import SendRsvp from "./send";
import ConfirmRsvp from "./confirm";

class RSVP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step : 0
        }
    }

    render() {
        const layout = [
            <UsersRsvp event={this.props.event}/>,
            <SendRsvp/>,
            <ConfirmRsvp/>
        ];
        return (
            <React.Fragment>
                <div className="tabs is-fullwidth">
                    <ul>
                        <li className={`${this.state.step === 0 ? "is-active" : ""}`}><a>Usuarios</a></li>
                        <li className={`${this.state.step === 1 ? "is-active" : ""}`}><a>RSVP</a></li>
                        <li className={`${this.state.step === 2 ? "is-active" : ""}`}><a>Confirmar</a></li>
                    </ul>
                </div>
                {
                    layout[this.state.step]
                }
            </React.Fragment>
        );
    }
}

export default RSVP;