import FormEnrollAttendeeToEvent from '@/components/forms/FormEnrollAttendeeToEvent';
import { DispatchMessageService } from '@/context/MessageService';
import { UsersApi } from '@/helpers/request';
import { Modal } from 'antd';
import React, { useContext, useState } from 'react';
import { NetworkingContext } from '../../context/NetworkingContext';
import { CreateUserModalProps } from './interface/KioskRegistrationApp.interface';

const CreateUserModal = ({ createModalVisible, onCancelModalCreateUser, onOk, ...restProps }: CreateUserModalProps) => {
  const { fieldsForm, eventId } = useContext(NetworkingContext);
  const [creatingLoading, setcreatingLoading] = useState(false);
  const saveUserModal = async (values: any) => {
    setcreatingLoading(true);
    try {
      let resp;
      let respActivity = true;
      if (values) {
        /* console.log("ACA VALUES==>",values) */
        const snap = { rol_id: values.rol_id, properties: values };
        resp = await UsersApi.createOne(snap, eventId);
      }
      console.log(resp);
      DispatchMessageService({
        type: 'success',
        msj: 'Usuario agregado correctamente',
        action: 'show',
      });
      onOk()
    } catch (error) {
      DispatchMessageService({
        type: 'error',
        msj: 'Error al guardar el usuario',
        action: 'show',
      });
      console.log(error);
    }
    setcreatingLoading(false);
  };

  return (
    <>
      {createModalVisible && (
        <Modal visible={createModalVisible} onCancel={onCancelModalCreateUser} onOk={onOk} {...restProps}>
          {' '}
          <div>
            {fieldsForm && fieldsForm?.length > 0 && (
              <FormEnrollAttendeeToEvent
                fields={fieldsForm}
                conditionalFields={[]}
                attendee={undefined}
                options={[]}
                saveAttendee={saveUserModal}
                loaderWhenSavingUpdatingOrDelete={creatingLoading}
                visibleInCms
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateUserModal;
