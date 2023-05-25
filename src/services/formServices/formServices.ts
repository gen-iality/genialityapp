import { StateMessage } from '@context/MessageService'
import { UsersApi } from '@helpers/request'

/** function to create or edit an eventuser from the cms */
export const saveOrUpdateAttendeeInAEvent = async ({
  values,
  shouldBeEdited,
  handleModal = false,
  setLoadingregister,
  updateView,
  eventID,
  attendeeId,
}: any) => {
  setLoadingregister(true)

  let resp
  let respActivity = true
  if (values) {
    const body = { properties: values }

    if (!shouldBeEdited) {
      try {
        resp = await UsersApi.createOne(body, eventID)
      } catch (e) {
        StateMessage.show(null, 'error', 'Usuario ya registrado en el curso')
        respActivity = false
      }
    } else {
      try {
        resp = await UsersApi.editEventUser(body, eventID, attendeeId)
      } catch (e) {
        resp = false
        respActivity = false
      }
    }

    if (updateView) {
      updateView()
    }
  }

  if (resp || respActivity) {
    setLoadingregister(false)
    StateMessage.show(
      null,
      'success',
      shouldBeEdited ? 'Usuario editado correctamente' : 'Usuario agregado correctamente',
    )
    if (handleModal) handleModal()
    return resp
  } else {
    setLoadingregister(false)
    StateMessage.show(null, 'error', 'Error al guardar el usuario')
    return resp
  }
}
