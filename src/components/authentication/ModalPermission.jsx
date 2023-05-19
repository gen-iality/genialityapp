import { Modal } from 'antd'
import FormComponent from '../events/registrationForm/form'
import withContext from '@context/withContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'

import { StateMessage } from '@context/MessageService'
import { useEventContext } from '@context/eventContext'
import { useUserEvent } from '@context/eventUserContext'
import { UsersApi } from '@helpers/request'

const stylePaddingDesktop = {
  paddingLeft: '25px',
  paddingRight: '25px',
}
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
}

const ModalPermission = () => {
  const { handleChangeTypeModal, typeModal } = useHelper()
  const cEvent = useEventContext()
  const cEventUser = useUserEvent()

  async function saveEventUser(values) {
    const eventUserBody = {
      properties: { ...values },
    }

    const resp = await UsersApi.createOne(eventUserBody, cEvent.value?._id)

    if (resp._id) {
      StateMessage.show(null, 'success', `Usuario editado correctamente`)
      cEventUser.setUpdateUser(true)
      handleChangeTypeModal(null)
    } else {
      StateMessage.show(null, 'error', `No fue posible editar el Usuario`)
    }
  }

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={null}
      zIndex={1000}
      closable
      onCancel={() => handleChangeTypeModal(null)}
      visible={
        typeModal == 'register' ||
        typeModal == 'update' ||
        typeModal === 'registerForTheEvent'
      }
    >
      <div
        // className="asistente-list"
        style={{
          // height: '70vh',
          overflowY: 'hidden',
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        <FormComponent callback={saveEventUser} />
      </div>
    </Modal>
  )
}

export default withContext(ModalPermission)
