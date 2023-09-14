import { useState, useEffect } from 'react'
import { StateMessage } from '@context/MessageService'
import { OrganizationApi, PaymentGatewayApi } from '@helpers/request'

export const usePayment = (org: any) => {
  const {
    _id: organizationId,
    privateKeyProd,
    privateKeyTest,
    publicKeyProd,
    publicKeyTest,
  } = org
  const [checked, setChecked] = useState(publicKeyProd ? false : true)
  const [checkedTest, setCheckedTest] = useState(publicKeyTest ? false : true)
  const [publicKey, setPublicKey] = useState(publicKeyProd ?? null)
  const [privateKey, setPrivateKey] = useState(privateKeyProd ?? null)
  const [testPublicKey, setTestPublicKey] = useState(publicKeyTest ?? null)
  const [testPrivateKey, setTestPrivateKey] = useState(privateKeyTest ?? null)

  const label = checked
    ? 'Habilitar pasarela de pagos personalizada.'
    : 'Deshabilitar pasarela de pagos personalizada.'

  const labelTest = checkedTest
    ? 'Habilitar pasarela de pagos. (en modo de pruebas)'
    : 'Deshabilitar pasarela de pagos. (en modo de pruebas)'

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  }

  async function updatePaymentGatewayOrganization(values: any) {
    const { organization, paymentGateway, paymentGatewayTest } = values
    let organizationData = {}

    if (paymentGateway) {
      const { publicKeyProd, privateKeyProd } = paymentGateway
      organizationData = {
        ...organization,
        publicKeyProd,
        privateKeyProd,
      }
    } else if (paymentGatewayTest) {
      const { publicKeyTest, privateKeyTest } = paymentGatewayTest
      organizationData = {
        ...organization,
        publicKeyTest,
        privateKeyTest,
      }
    }

    try {
      await OrganizationApi.editOne(organizationData, organizationId)
      StateMessage.show(null, 'success', 'Información actualizada correctamente')
    } catch (error) {
      StateMessage.show(null, 'error', 'No se pudo actualizar la información')
    }
  }

  async function updatePaymentGatewayByCheckbox(typeCheckbox: number, checked: boolean) {
    if (typeCheckbox == 0 && checked == true) {
      const organizationData = {
        publicKeyProd: null,
        privateKeyProd: null,
      }
      try {
        await OrganizationApi.editOne(organizationData, organizationId)
        StateMessage.show(null, 'success', 'Información actualizada correctamente')
      } catch (error) {
        StateMessage.show(null, 'error', 'No se pudo actualizar la información')
      }
    } else if (typeCheckbox == 1 && checked == true) {
      const organizationData = {
        publicKeyTest: null,
        privateKeyTest: null,
      }
      try {
        await OrganizationApi.editOne(organizationData, organizationId)
        StateMessage.show(null, 'success', 'Información actualizada correctamente')
      } catch (error) {
        StateMessage.show(null, 'error', 'No se pudo actualizar la información')
      }
    }
  }

  async function getStatusPayment(result: any) {
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
    checked,
    checkedTest,
    label,
    labelTest,
    publicKey,
    privateKey,
    testPublicKey,
    testPrivateKey,
    formLayout,
    setPublicKey,
    setPrivateKey,
    setTestPublicKey,
    setTestPrivateKey,
    setChecked,
    setCheckedTest,
    updatePaymentGatewayOrganization,
    updatePaymentGatewayByCheckbox,
    getStatusPayment,
  }
}
