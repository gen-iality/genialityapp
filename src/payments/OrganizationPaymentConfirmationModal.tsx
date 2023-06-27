import { FunctionComponent, useContext } from 'react'
import { Modal } from 'antd'
import OrganizationPaymentContext from './OrganizationPaymentContext'

const OrganizationPaymentConfirmationModal: FunctionComponent = () => {
  const { paymentStep, dispatch } = useContext(OrganizationPaymentContext)

  return (
    <Modal
      title="Confirmación Pago"
      open={paymentStep === 'REQUIRING_PAYMENT'}
      okText={'Pagar'}
      onOk={() => dispatch({ type: 'DISPLAY_PAYMENT' })}
      onCancel={() => dispatch({ type: 'ABORT' })}
    >
      <p>Para ingresar a este contenido debes tener una cuenta con un plan pago</p>
      <p>El costo del plan es: $20.000</p>
    </Modal>
  )
}

export default OrganizationPaymentConfirmationModal
