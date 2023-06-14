import { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import usePaymentStatehandler from './usePaymentStatehandler'

const publicKey = process.env.VITE_WOMPI_DEV_PUB_API_KEY

const PaymentModal = ({ isOpen, handleOk, handleCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const showModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(true)
  }

  const [paymentState, paymentDispatch] = usePaymentStatehandler()

  //   const handleOkInner = () => {
  //     setIsModalOpen(false)
  //   }

  //   const handleCancelInner = () => {
  //     setIsModalOpen(false)
  //   }

  useEffect(() => {
    paymentDispatch({ type: 'ABORT' })
    // @ts-ignore
    //if (window?.WidgetCheckout && money) {
    const eventId = 'asd'
    const money = 5000
    const price = Math.round(money) * 100
    const payload = {
      eventId,
      price,
    }
    const userInfo = { _id: 1, names: 'a', email: 'a' }
    const lang = 'ES'
    // TODO: JUST FOR TEST PURPOSES
    const redirectUrl = encodeURI(
      `http://${window.location.host}/${eventId}?finish=true&payment_event=true&event_id=${payload.eventId}&user_id=${userInfo._id}&assigned_to.names=${userInfo.names}&assigned_to.email=${userInfo.email}&lang=${lang}`,
    )

    // @ts-ignore
    const checkout = new WidgetCheckout({
      currency: 'COP',
      amountInCents: price,
      reference: new Date().getTime() + eventId + userInfo._id,
      publicKey: publicKey,
      redirectUrl,
      customerData: {
        // Opcional
        email: userInfo.email,
        fullName: userInfo.names,
      },
    })
    console.log('checkout', checkout)
    // @ts-ignore
    checkout.open((result) => {
      console.log({ result })
      alert('nos jodimos')
      //const transaction = result.transaction as Transaction;
      // console.log('Transaction ID: ', transaction.id);
      //console.log('Transaction object: ', transaction);

      //setPayment(transaction)
      //setcurrent(1)
    })

    paymentDispatch({ type: 'ABORT' })
  }, [])

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <p>{paymentState && paymentState.paymentstep}</p>
      {/* <Modal title="Payment" open={isOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Payment confirmation...</p>
        <p>Payment confirmation...</p>
        <p>Payment confirmation...</p>
      </Modal> */}
    </>
  )
}

export default PaymentModal
