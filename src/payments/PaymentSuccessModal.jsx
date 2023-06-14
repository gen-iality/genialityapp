import { useState } from 'react'
import { Button, Modal } from 'antd'

const PaymentSuccessModal = ({ isOpen, handleOk, handleCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const showModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(true)
  }

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
        <p> Payment Success</p>
        <p> Payment Success</p>
        <p> Payment Success</p>
      </Modal>
    </>
  )
}

export default PaymentSuccessModal
