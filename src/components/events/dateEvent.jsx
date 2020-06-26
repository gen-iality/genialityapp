
import React from 'react'
import Calendar from 'react-calendar-multiday'
import { omit } from 'ramda'
import moment from 'moment'
import { EventsApi } from "../../helpers/request";
import { Button, notification } from 'antd';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const container = {
    width: '375px',
    float: 'left',
    marginRight: '50px',
    marginBottom: '50px',
    fontFamily: 'system-ui',
}

const buttonStyle = {
    border: 'none',
    fontSize: '.75em',
    outline: 'none',
    marginLeft: '10px',
    cursor: 'pointer',
}

const reactToChange = (ob) => {
    console.log(ob)
}

class DateEvent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentChannel: 0,
            dates: [],
            properties: {}
        }
        this.handleDayClick = this.handleDayClick.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        this.getDates()
    }

    async getDates() {
        const info = await EventsApi.getOne(this.props.eventId)

        let dates = info.dates
        let date = []
        if (dates !== undefined) {
            for (let i = 0; i < dates.length; i++) {
                let dateUTC = Date.parse(dates[i])
                var dateUtc = new Date(dateUTC)
                var utc = new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
                console.log(utc)

                date.push(utc)
            }

            this.setState({
                currentChannel: dates.length,
                dates: date
            })
        }



        console.log(await this.state.dates)
    }

    handleDayClick(day, { selected }) {
        const { dates } = this.state;
        if (selected) {
            const selectedIndex = dates.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay, day)
            );
            dates.splice(selectedIndex, 1);
        } else {
            dates.push(day);
        }

        dates.sort(function (a, b) {
            let dateA = new Date(a)
            let dateB = new Date(b)
            return dateA - dateB;
        });

        this.setState({
            properties: {
                dates
            }, dates
        });
    }

    async save() {
        const info = await EventsApi.editOne(this.state.properties, this.props.eventId)
        console.log(info)

        notification.open({
            message: 'Datos guardados',
            description:
                'Las fechas especificas fueron guardadas',
        });
    }
    render() {
        return (
            <div>
                <div style={{ marginTop: "3%" }}>
                    <DayPicker
                        selectedDays={this.state.dates}
                        onDayClick={this.handleDayClick}
                    />
                </div>
                <Button style={{ marginTop: "3%" }} type="primary" onClick={this.save}>Guardar</Button>
            </div>
        )
    }
}

export default (DateEvent)