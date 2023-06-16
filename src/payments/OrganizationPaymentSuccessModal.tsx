import { useEffect, FunctionComponent, useContext } from 'react'
import { Modal } from 'antd'
import { OrganizationApi } from '@helpers/request'
import { OrganizationUserType } from '@Utilities/types/OrganizationUserType'
import OrganizationPaymentContext from './OrganizationPaymentContext'
import dayjs from 'dayjs'

interface IOrganizationPaymentSuccessModalProps {
  organizationUser: OrganizationUserType
  organization: any
}

const OrganizationPaymentSuccessModal: FunctionComponent<
  IOrganizationPaymentSuccessModalProps
> = (props) => {
  const { organizationUser, organization } = props

  const { paymentStep, result, dispatch } = useContext(OrganizationPaymentContext)

  const makeUserAsPaidPlan = async () => {
    const data = {
      payment_plan: {
        price: organization.access_settings?.price ?? 0,
        date_until: dayjs(Date.now()).add(organization.access_settings?.days ?? 0, 'day'),
      },
    }
    await OrganizationApi.editUser(
      organizationUser.organization_id,
      organizationUser._id,
      data,
    )
  }

  useEffect(() => {
    if (!organizationUser) return

    // makeUserAsPaidPlan()
  }, [organizationUser])

  return (
    <>
      <Modal
        title="Pago exitoso"
        open={paymentStep == 'DISPLAYING_SUCCESS'}
        onOk={() => {
          dispatch({ type: 'ABORT' })
          window.location.reload() // This does not make sense
        }}
        onCancel={() => dispatch({ type: 'ABORT' })}
      >
        <p> Referencia {result && result.reference}</p>
        <p> Estado: {result && result.status}</p>
        <p> Nombre {result && result.customerData && result.customerData.fullName}</p>
      </Modal>
    </>
  )
}

export default OrganizationPaymentSuccessModal
