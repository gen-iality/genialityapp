/* eslint-disable react-hooks/exhaustive-deps */
import FormEnrollAttendeeToEvent from '@/components/forms/FormEnrollAttendeeToEvent';
import { UseEventContext } from '@/context/eventContext';
import { Modal, ModalProps } from 'antd';
import { UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { useEffect, useState } from 'react';
import { RolAttApi, UsersApi } from '@/helpers/request';
import { handleRequestError } from '@/helpers/utils';
import { DispatchMessageService } from '@/context/MessageService';

interface Props extends ModalProps {
  selectedUserOrg: UserOrganizationToEvent;
  onCancel: () => void;
  getNewUsersOrgList: () => void;
}

export const ModalAddEventUserFromOrganization = ({
  selectedUserOrg,
  onCancel,
  getNewUsersOrgList,
  ...modalProps
}: Props) => {
  const event = UseEventContext();
  const [isLoadingReques, setIsLoadingReques] = useState(false);
  const [fieldForm, setFieldForm] = useState<any[]>();
  const {
    value: { _id: eventId },
  } = UseEventContext();

  const buildField = async () => {
    if (event.value.user_properties) {
      const rolesList = await RolAttApi.byEventRolsGeneral();
      let rolesOptions = rolesList.map((rol: any) => {
        return {
          label: rol.name,
          value: rol._id,
        };
      });
      const fieldsForm: any[] = [...event.value.user_properties];
      fieldsForm.push({
        author: null,
        categories: [],
        label: 'Rol',
        mandatory: true,
        name: 'rol_id',
        organizer: null,
        tickets: [],
        type: 'list',
        fields_conditions: [],
        unique: false,
        options: rolesOptions,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac1' },
      });
      setFieldForm(fieldsForm);
    }
  };

  useEffect(() => {
    buildField();
  }, []);
  const saveEventUser = async (values: any) => {
    setIsLoadingReques(true);
    let resp;
    let respActivity = true;
    if (values) {
      const snap = { rol_id: values.rol_id, properties: values };
      try {
        resp = await UsersApi.createOne(snap, eventId);
        setIsLoadingReques(false);
      } catch (error) {
        setIsLoadingReques(false);
        if (handleRequestError(error).message === 'users limit exceeded') {
          DispatchMessageService({
            type: 'error',
            msj: 'Ha exedido el límite de usuarios en el plan',
            action: 'show',
          });
        } else {
          DispatchMessageService({
            type: 'error',
            msj: 'Usuario ya registrado en el evento',
            action: 'show',
          });
        }

        respActivity = false;
      }
    }

    if (resp || respActivity) {
      DispatchMessageService({
        type: 'success',
        msj: 'Usuario agregado correctamente',
        action: 'show',
      });
      onCancel();
      getNewUsersOrgList();
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Error al guardar el usuario',
        action: 'show',
      });
    }
  };

  return (
    <Modal {...modalProps} footer={false} onCancel={onCancel}>
      <FormEnrollAttendeeToEvent
        fields={fieldForm}
        conditionalFields={undefined}
        attendee={{
          properties: { names: selectedUserOrg.name, ...selectedUserOrg },
        }}
        isAddFromOrganization
        saveAttendee={saveEventUser}
        loaderWhenSavingUpdatingOrDelete={isLoadingReques}
        visibleInCms
      />
    </Modal>
  );
};
