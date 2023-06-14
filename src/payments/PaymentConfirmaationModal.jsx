import { useState } from 'react'
import { Button, Modal } from 'antd'

const PaymentConfirmaationModal = ({ isOpen, handleOk, handleCancel }) => {
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
        Open Modal
      </Button>
      <Modal
        title="Payment confirmation"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Payment confirmation...</p>
        <p>Payment confirmation...</p>
        <p>Payment confirmation...</p>
      </Modal>
    </>
  )
}

export default PaymentConfirmaationModal
