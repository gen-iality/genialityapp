import React, {Component} from 'react';
import {Actions} from "../../helpers/request";

class ConfirmRsvp extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    submit = () => {
        const { eventId, list, rsvp} = this.props;
        const url = '/api/rsvp/sendeventrsvp/'+eventId;
        let users = [];
        list.map(item=>{
            users.push(item.id)
        });
        this.setState({dataMail:users});
        Actions.post(url, {subject:rsvp.subject,message:rsvp.message,image:rsvp.image,usersIds:users})
            .then((res) => {
                console.log(res);
            });
    };

    render() {
        console.log(this.props);
        return (
            <button className="button" onClick={this.submit}>Envio ?</button>
        );
    }
}

export default ConfirmRsvp;