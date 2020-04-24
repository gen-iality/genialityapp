import React, { Component } from "react";
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

let UserRegistration = () => {
    const onFinish = values => {
        console.log(values);
    };

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

                    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                        <Form.Item name={['user', 'name']} label="Nombre" rules={[{ required: true }]}>
                            <Input />
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
                </Card>
            </Col>
        </>
    );
};


export default UserRegistration