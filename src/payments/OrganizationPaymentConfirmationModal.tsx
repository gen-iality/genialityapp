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
      <p>
        Para acceder al contenido seleccionado debe suscribirse a ENDOCAMPUS ACE, esta
        suscripción tiene un costo de 50.000 COP o 15 USD y con ella tiene derecho a
        material académico desarrollado por la ACE (Congresos y simposios). Esta
        suscripción tiene vigencia de 1 año a partir de la fecha en que se realice el
        pago.
      </p>
    </Modal>
  )
}

export default OrganizationPaymentConfirmationModal
