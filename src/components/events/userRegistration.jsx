import React, { Component } from "react";
import { UsersApi } from "../../helpers/request";
import { Form, Input, InputNumber, Button, Card, Col, Row } from 'antd';


const card = {
    textAlign: "left"
};

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};


const validateMessages = {
    required: '${label} es requerido!',
    types: {
        email: '${label} no es valido!',
        number: '${label} no es valido!',
    },
    number: {
        range: '${label} debe estar en un rango de ${min} a ${max} numeros',
    },
};

class UserRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: {},
            user: {},
            emailError: false,
            valid: true
        };
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        let user = {};
        this.props.extraFields
            .map((obj) => (
                user[obj.name] = ''));
        this.setState({ user, edit: false });
    }

    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const snap = {
            properties: this.state.user
        };
        console.log(snap);
        let message = {};
        this.setState({ create: true });
        try {
            let resp = await UsersApi.createOne(snap, this.props.eventId);
            console.log(resp);
            if (resp.message === 'OK') {
                this.props.addToList(resp.data);
                message.class = (resp.status === 'CREATED') ? 'msg_success' : 'msg_warning';
                message.content = 'USER ' + resp.status;
            } else {
                message.class = 'msg_danger';
                message.content = 'User can`t be created';
            }
            setTimeout(() => {
                message.class = message.content = '';
                this.closeModal();
            }, 1000)
        } catch (err) {
            console.log(err.response);
            message.class = 'msg_error';
            message.content = 'ERROR...TRYING LATER';
        }
        this.setState({ message, create: false });
    }

    render() {
        const { extraFields } = this.props;
        return (
            <>
                <Col
                    xs={24}
                    sm={22}
                    md={18}
                    lg={18}
                    xl={18}
                    style={{ margin: "0 auto" }}>
                    <Card title="Registro de usuarios" bodyStyle={card}>

                        {extraFields.map((m, key) => {
                            <Form key={key} {...layout} name="nest-messages" validateMessages={validateMessages}>

                                <Form.Item name={m.name} label="Nombre" rules={[{ required: true }]}>
                                    <Input type={m.type} />
                                </Form.Item>
                                <Form.Item name={['user', 'email']} label="Email" rules={[{ required: true, type: 'email' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['user', 'identification']} label="Identificación" rules={[{ required: true, type: 'number', min: 10 }]}>
                                    <InputNumber />
                                </Form.Item>

                                <Form.Item name={['user', 'position']} label="Cargo">
                                    <Input />
                                </Form.Item>
                                <Row justify="center" >
                                    <Button type="primary" htmlType="submit" rules={[{ required: true }]}>
                                        Enviar
                                </Button>
                                </Row>
                            </Form>
                        })
                        }

                    </Card>
                </Col>
            </>
        );
    }
};


export default UserRegistration