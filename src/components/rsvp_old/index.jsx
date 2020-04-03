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

    userTab = (selection) => {
        this.setState((prevState)=>{
            return {selection,step:prevState.step+1}
        })
    };

    rsvpTab = (rsvp) => {
        this.setState((prevState)=>{
            return {rsvp,step:prevState.step+1}
        })
    };

    prevTab = () => {
        this.setState((prevState)=>{
            return {step:prevState.step-1}
        })
    };

    render() {
        const layout = [
            <UsersRsvp event={this.props.event} userTab={this.userTab}/>,
            <SendRsvp event={this.props.event} selection={this.state.selection} prevTab={this.prevTab} rsvpTab={this.rsvpTab}/>,
            <ConfirmRsvp rsvp={this.state.rsvp} list={this.state.selection} eventId={this.props.event._id} />
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