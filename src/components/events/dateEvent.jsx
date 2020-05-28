import React, { Component } from "react"
import { withRouter } from "react-router"
import moment from 'moment';
import { EventsApi } from "../../helpers/request";
import { Form, Input, Button, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

class DateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: moment(new Date()),
            selectedValue: moment('2017-01-25'),
            dateEvent: [],
            dates: []
        }
        this.onFinish = this.onFinish.bind(this)
    }

    async componentDidMount() {
        const dateEvent = await EventsApi.getOne(this.props.eventId)
        this.setState({ dateEvent: dateEvent.dates })
    }

    remove(date) {
        console.log(this.state.dateEvent)
        console.log(date)
        var i = this.state.dateEvent.indexOf(date);
        if (i !== -1) {
            this.state.dateEvent.splice(i, 1);
        }
        console.log(this.state.dateEvent)
    }

    async onFinish(values) {
        const dateEvent = []
        for (let i = 0; i < values.names.length; i++) {
            dateEvent.push(moment(values.names[i]).format("DD-MM-YYYY"));
        };

        let dateEventUnique = Array.from(new Set(dateEvent))
        dateEventUnique.sort()

        await this.setState({
            dates: { dates: dateEventUnique.sort() },
            dateEvent: dateEventUnique,
        })

        const info = await EventsApi.editOne(await this.state.dates, this.props.eventId)
        console.log(info)
    };
    render() {

        const dateFormat = 'DD-MM-YYYY';
        const { dateEvent } = this.state;
        return (
            <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={this.onFinish}>
                <Form.List name="names">
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                        label={index === 0 ? 'Agregar fecha' : ''}
                                        required={false}
                                        key={index}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            noStyle
                                        >
                                            {console.log(field)}
                                            <DatePicker style={{ width: '60%' }} />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                style={{ margin: '0 8px' }}
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add();
                                        }}
                                        style={{ width: '60%' }}
                                    >
                                        <PlusOutlined /> Add field
                                    </Button>
                                </Form.Item>
                            </div>
                        );
                    }}
                </Form.List>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default withRouter(DateEvent)