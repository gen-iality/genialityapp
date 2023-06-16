import { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import { OrganizationApi } from '@helpers/request'
const PaymentSuccessModal = ({
  result,
  organizationUser,
  isOpen,
  handleOk,
  handleCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const showModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(true)
  }

  console.log({ result })
  useEffect(() => {
    console.log('miembro')
    if (!organizationUser) return

    let prueba = async () => {
      let data = { payment_plan: false }
      let result = await OrganizationApi.editUser(
        organizationUser.organization_id,
        organizationUser._id,
        data,
      )
      console.log('miembro', { organizationUser, result })
    }
    //prueba()
  }, [organizationUser])

  //   const handleOkInner = () => {
  //     setIsModalOpen(false)
  //   }

  //   const handleCancelInner = () => {
  //     setIsModalOpen(false)
  //   }

  return (
    <>
      <Modal
        title="Payment Success"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p> Referencia {result && result.reference}</p>
        <p> Estado: {result && result.status}</p>
        <p> Nombre {result && result.customerData && result.customerData.fullName}</p>
      </Modal>
    </>
  )
}

export default PaymentSuccessModal
