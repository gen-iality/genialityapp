import { Modal } from 'antd'
import { useEventContext } from '@context/eventContext'
import { useEffect, useState } from 'react'
import { UsersApi } from '@helpers/request'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useUserEvent } from '@context/eventUserContext'
const ModalUpdate = () => {
  const cEvent = useEventContext()
  const cEventUser = useUserEvent()

  const [isVisible, setIsVisible] = useState(false)
  const { handleChangeTypeModal } = useHelper()
  const handleOpen = () => {
    setIsVisible(false)
    handleChangeTypeModal('update')
  }

  // const btn = <Button onClick={handleOpen}>Actualizar</Button>
  const validateAttende = async () => {
    if (!cEvent.value && !cEventUser.value) return
    if (cEventUser.value?.rol.type !== 'attendee') return
    try {
      await UsersApi.validateAttendeeData(cEvent.value._id, cEventUser.value._id)
    } catch (error) {
      // notification.info({
      //   message: 'Informacion Importante',
      //   description: 'Tienes informacion que actualizar para este evento, por favor actualice la informacion',
      //   btn,
      // });

      setIsVisible(true)
    }
  }

  useEffect(() => {
    validateAttende()
  }, [cEvent.value, cEventUser.value])

  return (
    <Modal
      okText="Actualizar"
      title="Informacion Importante"
      visible={isVisible}
      onOk={handleOpen}
      cancelText="Cancelar"
      onCancel={() => setIsVisible(false)}
    >
      Tienes informacion que actualizar para este evento, por favor actualice la
      informacion
    </Modal>
  )
}
export default ModalUpdate
