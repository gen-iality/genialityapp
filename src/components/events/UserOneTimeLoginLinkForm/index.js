import React, { Component } from 'react';
import { Card, Form, Input, Col, Row, Button, Spin } from 'antd';

export default class UserOneTimeLoginLinkForm extends Component {
  render() {
    const {
      title,
      successMsg,
      actionMsg,
      handleCloseRecoveryPass,
      handleRecoveryPass,
      loading,
      errorRecovery,
      successRecovery
    } = this.props;
    return (
      <Card title={title}>
        {successRecovery ? (
          <>
            <Row>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <h3>{successMsg}</h3>
              </Col>
            </Row>
            <Row style={{ marginTop: '30px', marginBottom: '30px' }}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Button onClick={handleCloseRecoveryPass} type='primary' style={{ marginRight: '15px' }}>
                  Volver
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <Form onFinish={handleRecoveryPass}>
            <Row>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Form.Item
                  name='email'
                  label='E-mail'
                  rules={[
                    {
                      required: true,
                      message: 'Ingrese su correo electrónico'
                    }
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            {errorRecovery && (
              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <span style={{ color: 'red' }}>Verifique el correo ingresado</span>
                </Col>
              </Row>
            )}
            <Row style={{ marginTop: '30px', marginBottom: '30px' }}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                {loading ? (
                  <Spin />
                ) : (
                  <>
                    <Button onClick={handleCloseRecoveryPass} type='default' style={{ marginRight: '15px' }}>
                      Cancelar
                    </Button>
                    <Button type='primary' htmlType='submit'>
                      {actionMsg}
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    );
  }
}
