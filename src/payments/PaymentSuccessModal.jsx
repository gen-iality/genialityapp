import { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import { OrganizationApi } from '@helpers/request'
const PaymentSuccessModal = ({ organizationUser, isOpen, handleOk, handleCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const showModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    console.log('miembro')
    if (!organizationUser) return

    let prueba = async () => {
      //org, member,
      let data = { payment_plan: 'false' }
      let result = await OrganizationApi.editUser(
        organizationUser.organization_id,
        organizationUser._id,
        data,
      )
      console.log('miembro', { organizationUser, result })
    }
    prueba()
  }, [organizationUser])

  //   const handleOkInner = () => {
  //     setIsModalOpen(false)
  //   }

  //   const handleCancelInner = () => {
  //     setIsModalOpen(false)
  //   }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Payment Success
      </Button>
      <Modal
        title="Payment Success"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p> usuario Success</p>
        <p> Payment Success</p>
        <p> Payment Success</p>
      </Modal>
    </>
  )
}

export default PaymentSuccessModal
