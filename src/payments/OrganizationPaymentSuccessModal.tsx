import { useEffect, FunctionComponent, useContext } from 'react'
import { Modal } from 'antd'
import { EventsApi, OrganizationApi } from '@helpers/request'
import { OrganizationUserType } from '@Utilities/types/OrganizationUserType'
import OrganizationPaymentContext from './OrganizationPaymentContext'
import dayjs from 'dayjs'
import { StateMessage } from '@context/MessageService'

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
    StateMessage.show('presend', 'info', 'Espera...')
    console.log(
      'payment initresult ',
      { organizationUser },
      { email: organizationUser?.email },
      { prop: organizationUser?.properties },
    )

    if (!organizationUser?.user?.email) {
      //if (!organizationUser.properties?.email) {
      StateMessage.destroy('presend')
      StateMessage.show(
        null,
        'error',
        `El miembro "${organizationUser.user.names}" no tiene correo`,
      )
      // Anybody knows, this can happen (?
      return
    }

    console.log('payment initresult progress')
    const data = {
      payment_plan: {
        price: organization.access_settings?.price ?? 0,
        date_until: dayjs(Date.now()).add(organization.access_settings?.days ?? 0, 'day'),
      },
    }
    console.log('payment initresult data', data)
    const result = await OrganizationApi.editUser(
      organizationUser.organization_id,
      organizationUser._id,
      data,
    )
    console.log('payment result fin', data, result)
    // Do request to send email
    await EventsApi.sendGenericMail(
      organizationUser?.user?.email,
      `http://${window.location.host}/organization/${organization._id}`,
      `Has sido inscrito a como miembro pago a la organización "${organization.name}". Puedes acceder también desde el enlace proporcionado`,
      'Ir a la organización',
      'Inscripción cursos pagos',
    )

    StateMessage.destroy('presend')
    StateMessage.show(
      null,
      'success',
      'todo bonito, todo contento, inscripción en progreso',
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
          makeUserAsPaidPlan().then(() => false)
          dispatch({ type: 'ABORT' })
        }}
        onCancel={() => {
          dispatch({ type: 'ABORT' })
          makeUserAsPaidPlan().then(() => false) //window.location.reload())
        }}
      >
        <p> Referencia {result && result.reference}</p>
        <p> Estado: {result && result.status}</p>
        <p> Nombre {result && result.customerData && result.customerData.fullName}</p>
      </Modal>
    </>
  )
}

export default OrganizationPaymentSuccessModal
