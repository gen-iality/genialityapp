import React, { Component } from "react"
import { withRouter } from "react-router"
import { Calendar } from 'antd';
import moment from 'moment';
import { EventsApi } from "../../helpers/request";

class DateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: moment(new Date()),
            selectedValue: moment('2017-01-25'),
            dateEvent: [],
            dates: []
        }
        this.onSelect = this.onSelect.bind(this)
    }

    async componentDidMount() {
        const dateEvent = await EventsApi.getOne(this.props.eventId)
        this.setState({ dateEvent: dateEvent.dates })
    }

    async onSelect(value) {
        const dateEvent = this.state.dateEvent
        dateEvent.push(value.format('DD-MM-YYYY'))

        let dateEventUnique = Array.from(new Set(dateEvent))
        dateEventUnique.sort()

        await this.setState({
            dates: { dates: dateEventUnique.sort() },
            value,
            selectedValue: value,
            dateEvent: dateEventUnique,
        });

        const info = await EventsApi.editOne(await this.state.dates, this.props.eventId)
        console.log(info)
    };

    onPanelChange = value => {
        this.setState({ value });
    };

    render() {
        const { dateEvent, value } = this.state;
        return (
            <div>
                <Calendar value={value} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
                {
                    dateEvent.map((data, key) => (
                        <div key={key} style={{ float: "left", marginRight: "2%", marginBottom: "3%" }}>
                            <p>{data}</p>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default withRouter(DateEvent)