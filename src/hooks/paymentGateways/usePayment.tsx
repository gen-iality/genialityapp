import { useState } from 'react'

export const usePayment = ({ org }: any) => {
  const [checked, setChecked] = useState(!true)
  const [checkedTest, setCheckedTest] = useState(!true)
  const [publicKey, setPublicKey] = useState(org?.paymentGateway?.publicKey)
  const [privateKey, setPrivateKey] = useState(org?.paymentGateway?.privateKey)
  const [testPublicKey, setTestPublicKey] = useState(org?.paymentGateway?.testPublicKey)
  const [testPrivateKey, setTestPrivateKey] = useState(
    org?.paymentGateway?.testPrivateKey,
  )

  const updatePaymentGateway = async (values: any) => {
    const { paymentGateway } = values
    console.log(paymentGateway)
  }
  const updatePaymentGatewayTest = async (values: any) => {
    const { paymentGateway } = values
    console.log(paymentGateway)
  }

  const label = checked
    ? 'Habilitar pasarela de pagos personalizada.'
    : 'Deshabilitar pasarela de pagos personalizada.'

  const labelTest = checkedTest
    ? 'Habilitar pasarela de pagos. (en modo de pruebas)'
    : 'Deshabilitar pasarela de pagos. (en modo de pruebas)'

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  }

  return {
    checked,
    checkedTest,
    label,
    labelTest,
    publicKey,
    privateKey,
    testPublicKey,
    testPrivateKey,
    formLayout,
    setPublicKey,
    setPrivateKey,
    setTestPublicKey,
    setTestPrivateKey,
    setChecked,
    setCheckedTest,
    updatePaymentGateway,
    updatePaymentGatewayTest,
  }
}
