import { DispatchMessageService } from '@context/MessageService';
import { UsersApi } from '@helpers/request';

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
  setLoadingregister(true);

  let resp;
  let respActivity = true;
  if (values) {
    const body = { properties: values };

    if (!shouldBeEdited) {
      try {
        resp = await UsersApi.createOne(body, eventID);
      } catch (e) {
        DispatchMessageService({
          type: 'error',
          msj: 'Usuario ya registrado en el curso',
          action: 'show',
        });
        respActivity = false;
      }
    } else {
      try {
        resp = await UsersApi.editEventUser(body, eventID, attendeeId);
      } catch (e) {
        resp = false;
        respActivity = false;
      }
    }

    if (updateView) {
      updateView();
    }
  }

  if (resp || respActivity) {
    setLoadingregister(false);
    DispatchMessageService({
      type: 'success',
      msj: shouldBeEdited ? 'Usuario editado correctamente' : 'Usuario agregado correctamente',
      action: 'show',
    });
    if (handleModal) handleModal();
    return resp;
  } else {
    setLoadingregister(false);
    DispatchMessageService({
      type: 'error',
      msj: 'Error al guardar el usuario',
      action: 'show',
    });
    return resp;
  }
};
