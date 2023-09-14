import Header from '@antdComponents/Header'
import { Checkbox, Col, Form, Row, Input } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { usePayment } from '@/hooks/paymentGateways/usePayment'

const PaymentGateway = ({ org }: any) => {
  const {
    checked,
    checkedTest,
    label,
    labelTest,
    formLayout,
    publicKey,
    privateKey,
    testPublicKey,
    testPrivateKey,
    setChecked,
    setCheckedTest,
    updatePaymentGatewayOrganization,
    updatePaymentGatewayByCheckbox,
  } = usePayment(org)

  return (
    <>
      <Header
        title={`Pasarela de pago`}
        back
        description="(Podrás guardar la configuración de tu pasarela de pago en la parte inferior)"
      />
      {/* Formulario de Producción*/}

      <Checkbox
        checked={checked}
        onChange={() => {
          setChecked(!checked)
          updatePaymentGatewayByCheckbox(0, !checked)
        }}
      >
        {label}
      </Checkbox>
      <Form
        disabled={checked}
        {...formLayout}
        size="small"
        onFinish={updatePaymentGatewayOrganization}
      >
        <Header title={``} description="" save form />
        <Row justify="center" gutter={[8, 8]} wrap>
          <Col span={12}>
            <Form.Item
              name={['paymentGateway', 'publicKeyProd']}
              label="Llave pública (Producción)"
              initialValue={publicKey}
              required
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name={['paymentGateway', 'privateKeyProd']}
              label="Llave privada (Producción)"
              initialValue={privateKey}
              required
            >
              <Input.Password
                type="password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Checkbox
        checked={checkedTest}
        onChange={() => {
          setCheckedTest(!checkedTest)
          updatePaymentGatewayByCheckbox(1, !checkedTest)
        }}
      >
        {labelTest}
      </Checkbox>

      {/* Formulario de Pruebas*/}

      <Form
        disabled={checkedTest}
        {...formLayout}
        size="small"
        onFinish={updatePaymentGatewayOrganization}
      >
        <Header title={``} description="" save form />
        <Row justify="center" gutter={[8, 8]} wrap>
          <Col span={12}>
            <Form.Item
              name={['paymentGatewayTest', 'publicKeyTest']}
              label="Llave pública (Modo de Prueba)"
              initialValue={testPublicKey}
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['paymentGatewayTest', 'privateKeyTest']}
              label="Llave privada (Modo de Prueba)"
              initialValue={testPrivateKey}
              required
            >
              <Input.Password
                type="password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default PaymentGateway
