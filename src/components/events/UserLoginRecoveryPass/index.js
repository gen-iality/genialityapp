import React, { Component } from 'react'
import { Card, Form, Input, Col, Row, Button } from "antd";

export default class UserLoginRecoveryPass extends Component {
    render() {
        const { handleCloseRecoveryPass } = this.props
        return (
            <Card title='Restablecimiento de contraseña'>
                <Form>
                    <Row>
                        <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
                            <Form.Item
                            label='E-mail'
                            rules={[{ required: true, message: 'Ingrese su correo electrónico' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
                            <Button 
                            onClick={handleCloseRecoveryPass}
                            type="default"
                            style={{marginRight: '15px'}}>Cancelar</Button>
                            <Button type="primary" htmlType="button">Solicitar una contraseña</Button>
                        </Col>
                    </Row>                 
                </Form>
            </Card>
        )
    }
}
