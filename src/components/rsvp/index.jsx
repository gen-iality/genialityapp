import React, {Component} from 'react';
import UsersRsvp from "./users";
import SendRsvp from "./send";

class RSVP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step : 0,
            selection : []
        }
    }

    userTab = (selection) => {
        this.setState((prevState)=>{
            return {selection,step:prevState.step+1}
        })
    };

    rsvpTab = (rsvp) => {
        this.setState((prevState) => {
            return {rsvp, step: prevState.step - 1}
        })
    };

    prevTab = () => {
        this.setState((prevState)=>{
            return {step:prevState.step-1}
        })
    };

    render() {
        const layout = [
            <UsersRsvp event={this.props.event} userTab={this.userTab} selection={this.state.selection}/>,
            <SendRsvp event={this.props.event} selection={this.state.selection} prevTab={this.prevTab} rsvpTab={this.rsvpTab}/>
        ];
        return (
            <React.Fragment>
                <div className="tabs is-fullwidth">
                    <ul>
                        <li className={`${this.state.step === 0 ? "is-active" : ""}`} onClick={(e)=>{this.setState({step:0})}}><a>Usuarios</a></li>
                        <li className={`${this.state.step === 1 ? "is-active" : ""}`} onClick={(e)=>{this.setState({step:1})}}><a>RSVP</a></li>
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