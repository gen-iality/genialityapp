import { useEffect, FunctionComponent, useState, useContext } from 'react'
import { Modal, Result } from 'antd'
import { EventsApi, OrganizationApi } from '@helpers/request'
import { OrganizationUserType } from '@Utilities/types/OrganizationUserType'
import OrganizationPaymentContext from './OrganizationPaymentContext'
import dayjs from 'dayjs'
import { StateMessage } from '@context/MessageService'
import { LoadingOutlined } from '@ant-design/icons'
import { usePayment } from '@/hooks/paymentGateways/usePayment'

interface IOrganizationPaymentSuccessModalProps {
  organizationUser: OrganizationUserType
  organization: any
}

const OrganizationPaymentSuccessModal: FunctionComponent<
  IOrganizationPaymentSuccessModalProps
> = (props) => {
  const { organizationUser, organization } = props

  const { paymentStep, result, dispatch } = useContext(OrganizationPaymentContext)
  const [isLoading, setIsLoading] = useState(true)
  const { getStatusPayment } = usePayment(organization ?? {})
  const [stateTransaction, setStateTransaction] = useState<any>(null)

  const SendId = async () => {
    const resp = await getStatusPayment(result.id)
    setStateTransaction(resp)
  }

  useEffect(() => {
    if (result) {
      console.log('id: ', result.id)
      const timeoutId = setTimeout(() => {
        SendId() // Realiza la consulta después de un tiempo determinado
      }, 8000) // Espera 5 segundos (puedes ajustar el tiempo según tus necesidades)

      return () => {
        // Limpia el timeout si el componente se desmonta antes de que se cumpla
        clearTimeout(timeoutId)
      }
    }
  }, [result])

  const makeUserAsPaidPlan = async () => {
    StateMessage.show('presend', 'loading', 'Espera...')
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
        date_until: dayjs(Date.now()).add(
          organization.access_settings?.days ?? 30,
          'day',
        ),
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

    try {
      await EventsApi.sendGenericMail(
        organizationUser?.user?.email,
        `http://${window.location.host}/organization/${organization._id}`,
        `<p>Bienvenida/o, has sido inscrita/o de manera satisfactoria  a "${organization.name}".</p> 
      <p>Plataforma de educación médica virtual de la Asociación Colombiana de Endocrinología, Diabetes y Metabolismo - ACE</p>
      <p>Nos complace darle la más cordial bienvenida a nuestra plataforma educativa.</p>
      <p>
      En Endocampus encontrará una amplia variedad de Simposios, Congresos, Cursos y Materiales educativos de alta calidad, desarrollado por líderes de opinión en diferentes patologías de la Endocrinología. Nuestro objetivo es brindarle una experiencia de aprendizaje enriquecedora.
      Le invitamos a explorar nuestra plataforma</p>`,
        'Ir a ' + organization.name,
        `Has sido inscrita/o de manera satisfactoria a  ${organization.name}.`,
      )

      StateMessage.destroy('presend')
      StateMessage.show(null, 'success', 'Inscripción en progreso')
    } catch (err) {
      console.error(err)
      StateMessage.destroy('presend')
      StateMessage.show(null, 'error', 'Correo de actualización no se pudo enviar')
    }
  }

  useEffect(() => {
    if (!organizationUser) return

    // makeUserAsPaidPlan()
  }, [organizationUser])

  useEffect(() => {
    if (!organizationUser) return
    if (!organization) return
    if (!isLoading) return
    console.log('paymentStep', paymentStep)
    if (paymentStep !== 'DISPLAYING_SUCCESS') return

    makeUserAsPaidPlan()
      .finally(() => {
        setIsLoading(false)
      })
      .catch((err) => {
        StateMessage.show(null, 'error', err.toString())
      })
  }, [organizationUser, organization, isLoading, paymentStep])

  if (!stateTransaction) {
    return (
      <Modal
        title="Espere, se está procesando el pago"
        open={paymentStep == 'DISPLAYING_SUCCESS'}
        okButtonProps={{ disabled: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
        onOk={() => {
          if (!isLoading) {
            window.location.reload()
            dispatch({ type: 'ABORT' })
          }
        }}
        onCancel={() => {
          dispatch({ type: 'ABORT' })
          window.location.reload()
        }}
      >
        {isLoading ? (
          <Result
            title="Transación en progreso..."
            subTitle="Espere, por favor, para evitar problemas"
            status="info"
            icon={<LoadingOutlined />}
          />
        ) : (
          <div>
            <p> Referencia {result && result.reference}</p>
            <p> Estado: {result && result.status}</p>
            <p> Nombre {result && result.customerData && result.customerData.fullName}</p>
            <p>Estado de la transacción: {stateTransaction?.status}</p>
            <p>{stateTransaction?.message}</p>
          </div>
        )}
      </Modal>
    )
  } else if (stateTransaction?.status == 404 || stateTransaction?.status == 500) {
    return (
      <Modal
        title="Ha ocurrido un error con la transacción"
        open={paymentStep == 'DISPLAYING_SUCCESS'}
        onOk={() => {
          makeUserAsPaidPlan().then(() => window.location.reload())
          dispatch({ type: 'ABORT' })
        }}
        onCancel={() => {
          dispatch({ type: 'ABORT' })
          makeUserAsPaidPlan().then(() => window.location.reload())
        }}
      >
        <p>Estado de la transacción: {stateTransaction?.status}</p>
        <p> {stateTransaction?.message}</p>
      </Modal>
    )
  } else {
    return (
      <>
        <Modal
          title="Pago exitoso"
          open={paymentStep == 'DISPLAYING_SUCCESS'}
          onOk={() => {
            makeUserAsPaidPlan().then(() => window.location.reload())
            dispatch({ type: 'ABORT' })
          }}
          onCancel={() => {
            dispatch({ type: 'ABORT' })
            makeUserAsPaidPlan().then(() => window.location.reload())
          }}
        >
          <p> Referencia {result && result.reference}</p>
          <p> Estado: {result && result.status}</p>
          <p> Nombre {result && result.customerData && result.customerData.fullName}</p>
        </Modal>
      </>
    )
  }
}

export default OrganizationPaymentSuccessModal
