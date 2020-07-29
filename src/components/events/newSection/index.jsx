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
        if (this.props.event !== prevProps.event) {
            this.setState({
                eventId: this.props.eventId,
                event: this.props.event
            })
        }
    }

    createMarkup(html) {
        return { __html: html };
    }

    render() {
        const { event } = this.state
        return (
            <Fragment>
                <div dangerouslySetInnerHTML={this.createMarkup(event.initial_page)} />
            </Fragment>
        )
    }
}

export default MySection