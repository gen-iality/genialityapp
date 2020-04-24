import React, { Component } from "react";
import { UsersApi } from "../../helpers/request";
import { Form, Input, InputNumber, Button, Card, Col, Row } from 'antd';
import EventModal from "../events/shared/eventModal";


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
            .map(obj => (
                user[obj.name] = ''));
        this.setState({ user });
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

    renderForm = () => {
        const { extraFields } = this.props;
        let formUI = extraFields.map((m, key) => {
            let type = m.type || "text";
            let props = m.props || {};
            let name = m.name;
            let mandatory = m.mandatory;
            let target = name;
            let value = this.state.user[target];
            let input = <Input {...props}
                type={type}
                key={key}
                name={name}
                value={value}
                onChange={(e) => { this.onChange(e, type) }}
            />;

            return (

                <Form key={'g' + key} {...layout} name="nest-messages" validateMessages={validateMessages}>
                    {m.type !== "boolean" &&
                        <Form.Item label={name} name={name} rules={[` required: ${mandatory ? 'required' : ''}`]}
                            key={"l" + key}
                            htmlFor={key}>
                            {input}

                        </Form.Item>}

                </Form>
            );
        });
        return formUI;
    };

    onChange = (e, type) => {
        const { value, name } = e.target;
        (type === "boolean") ?
            this.setState(prevState => { return { user: { ...this.state.user, [name]: !prevState.user[name] } } }, this.validForm)
            : this.setState({ user: { ...this.state.user, [name]: value } }, this.validForm);
    };

    validForm = () => {
        const EMAIL_REGEX = new RegExp('[^@]+@[^@]+\\.[^@]+');
        const { extraFields } = this.props, { user } = this.state,
            mandatories = extraFields.filter(field => field.mandatory), validations = [];
        mandatories.map((field, key) => {
            let valid;
            if (field.type === 'email') valid = user[field.name].length > 5 && user[field.name].length < 61 && EMAIL_REGEX.test(user[field.name]);
            if (field.type === 'text' || field.type === 'list') valid = user[field.name] && user[field.name].length > 0 && user[field.name] !== "";
            if (field.type === 'number') valid = user[field.name] && user[field.name] >= 0;
            if (field.type === 'boolean') valid = (typeof user[field.name] === "boolean");
            return validations[key] = valid;
        });
        const valid = validations.reduce((sum, next) => sum && next, true);
        this.setState({ valid: !valid })
    };


    render() {
        const { addUser } = this.props;
        return (
            <>

                <EventModal modal={this.props.modal} title={"Registrar Usuario"} closeModal={this.props.handleModal}>
                    <section className="modal-card-body">

                        {
                            Object.keys(this.state.user).length > 0 && this.renderForm()
                        }

                        <Row justify="center" >
                            <Button type="primary" htmlType="submit" rules={[{ required: true }]} onClick={() => this.handleSubmit}>
                                Enviar
                            </Button>
                        </Row>
                    </section>
                </EventModal>

                <Row justify="center" >
                    <Button type="primary" htmlType="submit" rules={[{ required: true }]} onClick={() => addUser}>
                        Agregar usuario
                    </Button>
                </Row>

            </>
        );
    }
};


export default UserRegistration