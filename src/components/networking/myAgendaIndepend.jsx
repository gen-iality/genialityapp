import React, { Component, Fragment } from "react"
import { withRouter } from "react-router-dom"
import MyAgenda from "./myAgenda"
import { getCurrentUser, getCurrentEventUser,userRequest } from "./services";
import * as Cookie from "js-cookie";

class AgendaIndepent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            eventUserId: null,
        }
    }

    async componentDidMount() {
        const {event} = this.props
        let currentUser = Cookie.get("evius_token");

        if (currentUser) {
            let eventUserList = await userRequest.getEventUserList(event._id, Cookie.get("evius_token"));
            let user = await getCurrentUser(currentUser);
            const eventUser = await getCurrentEventUser(event._id, user._id);

            this.setState({users: eventUserList, eventUser, eventUserId: eventUser._id, currentUserName: eventUser.names || eventUser.email });
        }
    }

    render() {
        const { event } = this.props
        const { eventUserId, users } = this.state
        return (
            <Fragment>
                <MyAgenda
                    event={event}
                    currentEventUserId={eventUserId}
                    eventUsers={users}
                />
            </Fragment>
        )
    }
}

export default withRouter(AgendaIndepent)