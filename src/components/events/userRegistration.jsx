import React, { Component } from "react";


import { EventsApi } from "../../helpers/request";
import { fieldNameEmailFirst } from "../../helpers/utils";
import { Form, Input, Button, Card, Col, Row } from 'antd';

const textLeft = {
    textAlign: "left"
};

const center = {
    margin: "0 auto"
}

// Grid para formulario
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};


class UserRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: {},
            user: {},
            emailError: false,
            valid: true,
            extraFields: []

        };
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    // Agrega el nombre del input 

    addDefaultLabels = extraFields => {
        extraFields = extraFields.map(field => {
            field["label"] = field["label"] ? field["label"] : field["name"];
            return field;
        });
        return extraFields;
    };

    orderFieldsByWeight = (extraFields) => {
        extraFields = extraFields.sort((a, b) =>
            (a.order_weight && !b.order_weight) ||
                (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
                ? -1
                : 1
        );
        return extraFields;
    };

    async componentDidMount() {

        // Trae la información del evento
        const event = await EventsApi.getOne(this.props.eventId);

        const properties = event.user_properties;

        // Trae la informacion para los input
        let extraFields = fieldNameEmailFirst(properties);
        extraFields = this.addDefaultLabels(extraFields);
        extraFields = this.orderFieldsByWeight(extraFields);
        this.setState({ extraFields });
        console.log("event", event);
        let user = {};
        this.props.extraFields
            .map(obj => (
                user[obj.name] = ''));
        this.setState({ user });
    }

    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

    }


    // Función que crea los input del componente

    renderForm = () => {
        const { extraFields } = this.state;
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
            />;

            return (

                <Form key={'g' + key} {...layout} name="nest-messages">
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





    render() {

        return (
            <>
                <Col
                    xs={24}
                    sm={22}
                    md={18}
                    lg={18}
                    xl={18}
                    style={center}>
                    <Card title="Formulario de registro" bodyStyle={textLeft}>

                        {/* //Renderiza el formulario */}
                        {this.renderForm()}

                        <Row justify="center" >
                            <Button
                                type="primary"
                                htmlType="submit"
                                rules={[{ required: true }]}
                            >
                                Registrarse
                            </Button>
                        </Row>

                    </Card>
                </Col>
            </>
        );
    }
};


export default UserRegistration