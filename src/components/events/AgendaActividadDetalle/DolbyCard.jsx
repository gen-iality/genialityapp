import { Card, Form } from 'antd'
import React from 'react'

export const DolbyCard = () => {
    return (
        <Card title="Ingresa tus datos para entrar a la transmisión">
            <Form
                style={{ padding: "16px 8px" }}
            // onFinish={handleSignInForm}
            // {...layout}
            >
                <Form.Item
                    name="names"
                    label="Nombre"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "Ingrese un email valido",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Entrar
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
