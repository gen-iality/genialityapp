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

    componentWillUnmount() {
        this.setState({step:0})
    }

    render() {
        const layout = [
            <UsersRsvp event={this.props.event} userTab={this.userTab} selection={this.state.selection}/>,
            <SendRsvp event={this.props.event} selection={this.state.selection} prevTab={this.prevTab} rsvpTab={this.rsvpTab}/>
        ];
        return (
            <React.Fragment>
                {
                    layout[this.state.step]
                }
            </React.Fragment>
        );
    }
}

export default RSVP;