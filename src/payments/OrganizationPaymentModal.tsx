/* global WidgetCheckout */
import { useEffect, FunctionComponent, useContext, useMemo } from 'react'
import OrganizationPaymentContext from './OrganizationPaymentContext'
import { OrganizationUserType } from '@Utilities/types/OrganizationUserType'

const publicKey: string = import.meta.env.VITE_WOMPI_DEV_PUB_API_KEY

interface IOrganizationPaymentModalProps {
  organization: any
  organizationUser: OrganizationUserType
}

const money = 5000
const price = Math.round(money) * 100
const lang = 'ES'

const OrganizationPaymentModal: FunctionComponent<IOrganizationPaymentModalProps> = (
  props,
) => {
  const { organizationUser, organization } = props
  console.log('organizationUser', organizationUser)

  const { paymentStep, dispatch } = useContext(OrganizationPaymentContext)

  const query = useMemo(() => {
    if (!organizationUser) return

    const params = {
      finish: 'true',
      payment_event: 'true',
      user_id: organizationUser.account_id,
      'assigned_to.names': organizationUser.user.names,
      'assigned_to.email': organizationUser.user.email,
      lang,
    }
    return new URLSearchParams(params)
  }, [organizationUser])

  const redirectUrl = useMemo(() => {
    if (!query || !organization) return

    return encodeURI(
      `http://${window.location.host}/paid-organization/${
        organization._id
      }?${query.toString()}`,
    )
  }, [query, organization])

  const checkout = useMemo(() => {
    if (!redirectUrl || !organizationUser) return

    const moreCustomData: any = {}
    if (organizationUser.properties.phone) {
      moreCustomData.phoneNumber = organizationUser.properties.phone
      moreCustomData.phoneNumberPrefix = '+57'
    }
    if (organizationUser.properties.ID) {
      moreCustomData.legalId = organizationUser.properties.ID
      moreCustomData.legalIdType = 'CC'
    }

    console.log('moreCustomData:', moreCustomData)

    /// @ts-ignore
    return new WidgetCheckout({
      currency: 'COP',
      amountInCents: price,
      reference: `${new Date().getTime()}-${organization._id}-${
        organizationUser.account_id
      }`,
      publicKey: publicKey,
      redirectUrl,
      customerData: {
        email: organizationUser.user.email,
        fullName: organizationUser.user.names,
        ...moreCustomData,
      },
    })
  }, [redirectUrl, organizationUser])

  useEffect(() => {
    if (paymentStep == 'DISPLAYING_PAYMENT') {
      if (!checkout) return

      dispatch({ type: 'ABORT' })

      checkout.open(async (result: any) => {
        console.log({ result })

        if (result.transaction.status == 'APPROVED') {
          console.log('paid')
        }
        console.debug('member', { organizationUser, result })

        //En cualquier caso enviamos la accion de respuesta de transacción recibida
        dispatch({
          type: 'DISPLAY_SUCCESS',
          result: result.transaction,
        })
      })
    }
  }, [paymentStep, checkout])

  return <></>
}

export default OrganizationPaymentModal
