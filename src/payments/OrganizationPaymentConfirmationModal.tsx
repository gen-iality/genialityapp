import { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Modal } from 'antd'
import OrganizationPaymentContext from './OrganizationPaymentContext'

interface IOrganizationPaymentConfirmationModalProps {
  organization: any
}

const OrganizationPaymentConfirmationModal: FunctionComponent<
  IOrganizationPaymentConfirmationModalProps
> = (props) => {
  const { organization } = props
  const { paymentStep, dispatch } = useContext(OrganizationPaymentContext)
  const [money, setMoney] = useState(5000)

  useEffect(() => {
    if (organization?.access_settings?.price) {
      setMoney(organization.access_settings.price)
    }
  }, [organization])

  return (
    <Modal
      title="Confirmación Pago"
      open={paymentStep === 'REQUIRING_PAYMENT'}
      okText="Pagar"
      onOk={() => dispatch({ type: 'DISPLAY_PAYMENT' })}
      onCancel={() => dispatch({ type: 'ABORT' })}
    >
      <p>Para ingresar a este contenido debes tener una cuenta con un plan pago</p>
      <p>
        El costo del plan es: <b>${money}</b>
      </p>
    </Modal>
  )
}

export default OrganizationPaymentConfirmationModal
