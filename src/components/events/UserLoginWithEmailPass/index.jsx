import { Component } from 'react';
import { Card, Form, Input, Col, Row, Button, Spin } from 'antd';
import { injectIntl } from 'react-intl';

class UserLoginWithEmailPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formTexts: this.props.FormTags('login'),
    };
  }

  render() {
    const { handleLoginEmailPassword, onFinishFailed, errorLogin, loading, handleOpenRecoveryPass, intl } = this.props;
    return (
      <Card title={intl.formatMessage({ id: 'login.title' })}>
        <Form onFinish={handleLoginEmailPassword} onFinishFailed={onFinishFailed} layout='vertical'>
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <Form.Item
                label='E-Mail'
                name='email'
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.field.required' }),
                  },
                ]}>
                <Input style={{ width: '300px' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <Form.Item
                label='Contraseña'
                name='password'
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.field.required' }),
                  },
                ]}>
                <Input.Password style={{ width: '300px' }} />
              </Form.Item>
            </Col>
          </Row>
          {errorLogin && (
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <span style={{ color: 'red' }}>
                  {intl.formatMessage({ id: 'form.validate.message.email.password.error' })}
                </span>
              </Col>
            </Row>
          )}
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <Form.Item>
                {loading ? (
                  <Spin />
                ) : (
                  <Button type='primary' htmlType='submit'>
                    {intl.formatMessage({ id: 'button.login' })}
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <Button type='default' htmlType='button' onClick={handleOpenRecoveryPass}>
                {intl.formatMessage({ id: 'button.forget.password' })}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default injectIntl(UserLoginWithEmailPass);
