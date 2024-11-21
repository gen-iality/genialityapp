import { useEffect, FunctionComponent, useState, useContext } from 'react'
import { Modal, Result, Space } from 'antd'
import { EventsApi, OrganizationApi } from '@helpers/request'
import { OrganizationUserType } from '@Utilities/types/OrganizationUserType'
import OrganizationPaymentContext from './OrganizationPaymentContext'
import dayjs from 'dayjs'
import { StateMessage } from '@context/MessageService'
import { LoadingOutlined } from '@ant-design/icons'
import { usePaymentManager } from '@/hooks/paymentGateways/usePaymentManager'

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
  const { getStatusPayment } = usePaymentManager(organization ?? {})
  const [stateTransaction, setStateTransaction] = useState<any>(null)

  const SendId = async () => {
    const resp = await getStatusPayment(result.id)
    setStateTransaction(resp)
  }

  useEffect(() => {
    if (result) {
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

    const data = {
      payment_plan: {
        price: organization.access_settings?.price ?? 0,
        date_until: dayjs(Date.now()).add(
          organization.access_settings?.days ?? 30,
          'day',
        ),
      },
    }

    const result = await OrganizationApi.editUser(
      organizationUser.organization_id,
      organizationUser._id,
      data,
    )

    // Do request to send email
    try {
      await EventsApi.sendGenericMail(
        organizationUser?.user?.email,
        `http://${window.location.host}/organization/${organization._id}`,
        `<p>El pago para acceder a la plataforma "${organization.name}" se ha realizado de manera satisfactoria, recuerda que este pago tendrá vigencia de un año a partir de la fecha.</p> 
      <p>Plataforma de educación médica virtual de la Asociación Colombiana de Endocrinología, Diabetes y Metabolismo - ACE</p>
      <p>    En Endocampus encontrarás una amplia variedad de simposios, congresos, cursos y material educativo de alta calidad, desarrollado por la asociación Colombiana de endocrinología, Diabetes y Metabolismo. 
      </p>
      <p>
      te invitamos a explorar nuestra plataforma</p>`,
        'Ir a ' + organization.name,
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

    // Now, we dont use the local checking, use the backend checking instead
    // if (paymentStep !== 'DISPLAYING_SUCCESS') return

    if (stateTransaction?.data?.transaction?.status === 'APPROVED') {
      makeUserAsPaidPlan()
        .finally(() => {
          setIsLoading(false)
        })
        .catch((err) => {
          StateMessage.show(null, 'error', err.toString())
        })
    }
  }, [
    organizationUser,
    organization,
    isLoading,
    paymentStep,
    stateTransaction?.data?.transaction?.status,
  ])

  if (!stateTransaction) {
    return (
      <Modal
        title="Espere, se está procesando el pago"
        open={paymentStep == 'DISPLAYING_SUCCESS'}
        onOk={() => {
          window.location.reload()
          dispatch({ type: 'ABORT' })
        }}
        onCancel={() => {
          dispatch({ type: 'ABORT' })
          window.location.reload()
        }}
      >
        <Result
          title="Transación en progreso..."
          subTitle="Espere, por favor, para evitar problemas"
          status="info"
          icon={<LoadingOutlined />}
          extra={
            <Space direction="vertical">
              <p>Estado de la transacción: {stateTransaction?.status}</p>
              <p>{stateTransaction?.message}</p>
            </Space>
          }
        />
      </Modal>
    )
  } else if (stateTransaction?.status == 404 || stateTransaction?.status == 500) {
    return (
      <Modal
        title="Ha ocurrido un error con la transacción"
        open={paymentStep == 'DISPLAYING_SUCCESS'}
        onOk={() => {
          dispatch({ type: 'ABORT' })
          window.location.reload()
        }}
        onCancel={() => {
          dispatch({ type: 'ABORT' })
          window.location.reload()
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
          title="Pago e inscripción exitosa"
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
            if (!isLoading) {
              dispatch({ type: 'ABORT' })
              window.location.reload()
            }
          }}
        >
          {isLoading ? (
            <Result
              title="Inscripción en progreso..."
              subTitle="Espere, por favor, para evitar problemas"
              status="info"
              icon={<LoadingOutlined />}
            />
          ) : (
            <div>
              <p> Referencia {result && result.reference}</p>
              <p> Estado: {result && result.status}</p>
              <p>
                {' '}
                Nombre {result && result.customerData && result.customerData.fullName}
              </p>
            </div>
          )}
        </Modal>
      </>
    )
  }
}

export default OrganizationPaymentSuccessModal
