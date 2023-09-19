import { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react'
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

  const preAccessMessage = useMemo(() => {
    const baseMessage: string =
      organization?.access_settings?.pre_access_message ??
      '<Este mensaje debe ser definido por el administrador>'
    return baseMessage.replace('{price}', `${money}`)
  }, [organization?.access_settings?.pre_access_message, money])

  return (
    <Modal
      title="Confirmación Pago"
      open={paymentStep === 'REQUIRING_PAYMENT'}
      okText="Pagar"
      onOk={() => dispatch({ type: 'DISPLAY_PAYMENT' })}
      onCancel={() => dispatch({ type: 'ABORT' })}
    >
      <p>{preAccessMessage}</p>
    </Modal>
  )
}

export default OrganizationPaymentConfirmationModal
