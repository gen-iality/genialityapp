import React, { Component, Fragment } from "react"

class MySection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            event: {}
        }
    }

    componentDidMount() {
        this.setState({
            eventId: this.props.eventId,
            event: this.props.event
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.eventId !== prevProps.eventId) {
            this.setState({
                eventId: this.props.eventId,
                event: this.props.event
            })
        }
    }

    render() {
        const { event } = this.state
        return (
            <Fragment>
                <div dangerouslySetInnerHTML={{ __html: event.initial_page }} />
            </Fragment>
        )
    }
}

export default MySection