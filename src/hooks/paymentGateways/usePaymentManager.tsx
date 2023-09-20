import { useState } from 'react'
import { StateMessage } from '@context/MessageService'
import { OrganizationApi, PaymentGatewayApi } from '@helpers/request'

export enum KindOfKey {
  PRODUCTION,
  TESTING,
}

type OrganizationLike = {
  _id?: string
  privateKeyProd?: string
  privateKeyTest?: string
  publicKeyProd?: string
  publicKeyTest?: string
}

type PaymentGatewayOrganization = {
  organization: any
  paymentGateway?: {
    publicKeyProd: string
    privateKeyProd: string
  }
  paymentGatewayTest?: {
    publicKeyTest: string
    privateKeyTest: string
  }
}

type PaymentManagerHook = {
  isEnabled: boolean
  isEnabledTest: boolean
  publicKey?: string | null
  privateKey?: string | null
  publicTestKey?: string | null
  privateTestKey?: string | null
  updatePublicKey: (pk: string) => void
  updatePrivateKey: (pk: string) => void
  updatePublicTestKey: (pk: string) => void
  updatePrivateTestKey: (pk: string) => void
  onEnableChange: (value: boolean) => void
  onEnableTestChange: (value: boolean) => void
  updatePaymentGateway: (values: PaymentGatewayOrganization) => void
  repairPaymentGateway: (kindOfKey: KindOfKey, checked: boolean) => void
  getStatusPayment: (transactionId: string) => any
}

export function usePaymentManager<T extends OrganizationLike = {}>(
  org: T,
): PaymentManagerHook {
  const {
    _id: organizationId,
    privateKeyProd,
    privateKeyTest,
    publicKeyProd,
    publicKeyTest,
  } = org

  const [isEnabled, setIsEnabled] = useState(publicKeyProd ? false : true)
  const [isEnabledTest, setIsEnabledTest] = useState(publicKeyTest ? false : true)
  const [publicKey, setPublicKey] = useState(publicKeyProd ?? null)
  const [privateKey, setPrivateKey] = useState(privateKeyProd ?? null)
  const [publicTestKey, setPublicTestKey] = useState(publicKeyTest ?? null)
  const [privateTestKey, setPrivateTestKey] = useState(privateKeyTest ?? null)

  const updatePaymentGateway: PaymentManagerHook['updatePaymentGateway'] = async (
    values,
  ) => {
    const { organization, paymentGateway, paymentGatewayTest } = values
    let organizationData: OrganizationLike = {}

    if (paymentGateway) {
      console.debug('will to update keys')
      const { publicKeyProd, privateKeyProd } = paymentGateway
      organizationData = {
        ...organization,
        publicKeyProd,
        privateKeyProd,
      }
    } else if (paymentGatewayTest) {
      console.debug('will to update testing keys')
      const { publicKeyTest, privateKeyTest } = paymentGatewayTest
      organizationData = {
        ...organization,
        publicKeyTest,
        privateKeyTest,
      }
    }

    /**
     * @todo create a new endpoint to save that value because those access tokens can be accessed from public GET request. When that new endpoint gets be created, you should not edit all the organzation, only the payment access tokens
     */
    try {
      await OrganizationApi.editOne(organizationData, organizationId)
      StateMessage.show(null, 'success', 'Información actualizada correctamente')
    } catch (error) {
      StateMessage.show(null, 'error', 'No se pudo actualizar la información')
    }
  }

  const repairPaymentGateway: PaymentManagerHook['repairPaymentGateway'] = async (
    kindOfKey,
    checked,
  ) => {
    if (checked) return

    const organizationData =
      kindOfKey == KindOfKey.PRODUCTION
        ? {
            publicKeyProd: null,
            privateKeyProd: null,
          }
        : kindOfKey == KindOfKey.TESTING
        ? {
            publicKeyTest: null,
            privateKeyTest: null,
          }
        : null

    if (organizationData === null) {
      console.warn('the value `kindOfKey` is invalid:', kindOfKey)
      return
    }

    console.debug(
      'repair',
      kindOfKey === KindOfKey.PRODUCTION
        ? 'production'
        : kindOfKey === KindOfKey.TESTING
        ? 'testing'
        : null,
      'to',
      organizationData,
    )

    // Update the data
    try {
      await OrganizationApi.editOne(organizationData, organizationId)
      StateMessage.show(null, 'success', 'Información actualizada correctamente')
    } catch (error) {
      StateMessage.show(null, 'error', 'No se pudo actualizar la información')
    }
  }

  const getStatusPayment: PaymentManagerHook['getStatusPayment'] = async (result) => {
    try {
      const response = await PaymentGatewayApi.get(result)
      return response
    } catch (error: any) {
      return {
        status: error?.response?.status,
        message: error?.response?.data?.message,
      }
    }
  }

  return {
    isEnabled,
    isEnabledTest,
    publicKey,
    privateKey,
    publicTestKey: publicTestKey,
    privateTestKey: privateTestKey,
    updatePublicKey: (pk) => setPublicKey(pk),
    updatePrivateKey: (pk) => setPrivateKey(pk),
    updatePublicTestKey: (pk) => setPublicTestKey(pk),
    updatePrivateTestKey: (pk) => setPrivateTestKey(pk),
    onEnableChange: (value) => {
      setIsEnabled(value)
      // if (value && isEnabledTest) {
      //   setIsEnabledTest(false)
      // }
    },
    onEnableTestChange: (value) => {
      setIsEnabledTest(value)
      // if (value && isEnabled) {
      //   setIsEnabled(false)
      // }
    },
    updatePaymentGateway,
    repairPaymentGateway,
    getStatusPayment,
  }
}
