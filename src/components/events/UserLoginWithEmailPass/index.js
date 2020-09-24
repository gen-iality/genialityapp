import React, { Component } from 'react'
import { Card, Form, Input, Col, Row, Button, Spin } from "antd";

class UserLoginWithEmailPass extends Component {

  constructor(props){
    super(props)
    this.state={
      formTexts: this.props.FormTags('login')
    }
  }
  
  render(){
    const {formTexts} = this.state
    const {
      handleLoginEmailPassword,
      onFinishFailed,
      errorLogin,
      loading,
      handleOpenRecoveryPass
    } = this.props
    return (
      <Card title={formTexts.titleForm}>
        <Form onFinish={handleLoginEmailPassword} onFinishFailed={onFinishFailed}>
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
              <Form.Item
                label="E-Mail"
                name="email"
                rules={[
                    {
                    required: true,
                    message: 'Ingrese E-Mail',
                    },
                ]}
                >
                  <Input style={{ width: "300px" }} />
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
                <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                    {
                    required: true,
                    message: 'Ingrese su contraseña',
                    
                    },
                ]}
                >
                  <Input type='password' style={{ width: "300px" }}/>
                </Form.Item>
              </Col>
          </Row>  
          {errorLogin && (
          <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
              <span style={{color: 'red'}}>{formTexts.errorLoginEmailPassword}</span>
              </Col>
          </Row> 
          )}    
          <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
                <Form.Item>
                {loading ?  <Spin /> : (
                <Button type="primary" htmlType="submit">
                Ingresar
                </Button>
                )}
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
              <Button type="default" htmlType="button" onClick={handleOpenRecoveryPass}>Olvidé mi contraseña</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}

export default UserLoginWithEmailPass;
