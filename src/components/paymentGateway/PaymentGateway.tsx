import Header from '@antdComponents/Header'
import { Col, Form, Row, Input, Switch, Space, Button, Divider } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { KindOfKey, usePaymentManager } from '@/hooks/paymentGateways/usePaymentManager'
import { FunctionComponent, useEffect } from 'react'

interface IPaymentGatewayProps {
  org: any
}

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const PaymentGateway: FunctionComponent<IPaymentGatewayProps> = (props) => {
  const { org } = props

  useEffect(() => {
    console.log('PaymentGateway:', org)
  }, [org])

  const {
    isEnabled,
    isEnabledTest,
    publicKey,
    privateKey,
    publicTestKey,
    privateTestKey,
    onEnableChange,
    onEnableTestChange,
    updatePaymentGateway,
    repairPaymentGateway,
  } = usePaymentManager(org)

  return (
    <>
      <Header
        title="Pasarela de pago"
        back
        description="(Podrás guardar la configuración de tu pasarela de pago en la parte inferior)"
      />
      <Space direction="horizontal">
        <Switch
          checked={isEnabled}
          onChange={(checked) => {
            onEnableChange(checked)
            repairPaymentGateway(KindOfKey.PRODUCTION, checked)
          }}
          checkedChildren="Habilitada"
          unCheckedChildren="Deshabilitada"
        />
        Pasarela de pago
      </Space>
      <Form
        {...formLayout}
        disabled={!isEnabled}
        size="small"
        onFinish={updatePaymentGateway}
      >
        <Row justify="center" gutter={[8, 8]} wrap>
          <Col span={12}>
            <Form.Item
              name={['paymentGateway', 'publicKeyProd']}
              label="Llave pública (Producción)"
              initialValue={publicKey}
              rules={[{ required: true, message: 'Este valor es necesario' }]}
            >
              <Input placeholder="Llave pública aquí" />
            </Form.Item>
            <Form.Item
              name={['paymentGateway', 'privateKeyProd']}
              label="Llave privada (Producción)"
              initialValue={privateKey}
              rules={[{ required: true, message: 'Este valor es necesario' }]}
            >
              <Input.Password
                placeholder="Llave privada aquí"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" type="primary" size="middle">
                Guardar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider />

      {/* Formulario de Pruebas*/}
      <Space direction="horizontal">
        <Switch
          checked={isEnabledTest}
          onChange={(checked) => {
            onEnableTestChange(checked)
            repairPaymentGateway(KindOfKey.TESTING, checked)
          }}
          checkedChildren="Habilitada"
          unCheckedChildren="Deshabilitada"
        />
        Pasarela de pago (en modo de prueba)
      </Space>
      <Form
        {...formLayout}
        disabled={!isEnabledTest}
        size="small"
        onFinish={updatePaymentGateway}
      >
        <Row justify="center" gutter={[8, 8]} wrap>
          <Col span={12}>
            <Form.Item
              name={['paymentGatewayTest', 'publicKeyTest']}
              label="Llave pública (Modo de Prueba)"
              initialValue={publicTestKey}
              rules={[{ required: true, message: 'Este valor es necesario' }]}
            >
              <Input placeholder="Llave pública aquí" />
            </Form.Item>
            <Form.Item
              name={['paymentGatewayTest', 'privateKeyTest']}
              label="Llave privada (Modo de Prueba)"
              initialValue={privateTestKey}
              rules={[{ required: true, message: 'Este valor es necesario' }]}
            >
              <Input.Password
                type="password"
                placeholder="Llave privada aquí"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" type="primary" size="middle">
                Guardar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default PaymentGateway
