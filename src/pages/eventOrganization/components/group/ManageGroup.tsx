import { useEffect } from 'react';
import { Form, Modal, ModalProps, Transfer } from 'antd';
import { GroupEvent, GroupEventMongo } from '../../interface/group.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import { useTransfer } from '@/hooks/useTransfer';
import { TransferDirection } from 'antd/lib/transfer';
import { confirmDeleteSync } from '@/components/ModalConfirm/confirmDelete';
import { useGetEventsByOrgOnlyName } from '@/components/eventOrganization/hooks/useGetEventsByOrgOnlyName';
import { useGetOrganizationUsersOnlyName } from '../../hooks/useGetOrganizationUsersOnlyName';

interface Props extends ModalProps {
  onCancel: () => void;
  selectedGroup: GroupEventMongo;
  organizationId: string;
  handledUpdate: (groupId: string, newGroupData: Partial<GroupEvent>) => Promise<void>;
  handledAddGroup: (newGrupo: GroupEvent) => Promise<void>;
  handledDelteEvent: (orgId: string, groupId: string, orgUserId: string) => Promise<void>;
  handledDelteOrgUser: (orgId: string, groupId: string, orgUserId: string) => Promise<void>;
}

export const ManageGroup = ({
  onCancel,
  selectedGroup,
  organizationId,
  handledUpdate,
  handledAddGroup,
  handledDelteEvent,
  handledDelteOrgUser,
  ...modalProps
}: Props) => {
  const { eventsByOrg, isLoadingEventsByOrg } = useGetEventsByOrgOnlyName(organizationId);
  const { organizationUsers, isLoadingOrgUsers } = useGetOrganizationUsersOnlyName(organizationId);
  const {
    onChange: onChangeTransferEvents,
    onSelectChange: onSelectChangeEvents,
    selectedKeys: selectedKeysEvents,
    targetKeys: targetKeysEvents,
    setTargetKeys: setTargetKeysEvents,
  } = useTransfer([]);
  const {
    onChange: onChangeTransferOrgUser,
    onSelectChange: onSelectChangeOrgUser,
    selectedKeys: selectedKeysOrgUser,
    targetKeys: targetKeysOrgUser,
    setTargetKeys: setTargetKeysOrgUser,
  } = useTransfer([]);

  const onAddEventsToGroup = async (event_ids: string[], moveKeys: string[]) => {
    const plural = moveKeys.length > 1;
    try {
      await handledUpdate(selectedGroup?.item._id ?? '', { event_ids });
      setTargetKeysEvents(event_ids);
      DispatchMessageService({
        action: 'show',
        type: 'success',
        msj: `Se  ${plural ? 'agregaron los eventos' : 'agrego el evento'} con exito`,
      });
    } catch (error) {
      DispatchMessageService({
        action: 'show',
        type: 'info',
        msj: `Ocurrio un error al agregar ${plural ? 'los eventos' : 'el evento'} al grupo`,
      });
    }
  };

  const onDeleteEventFromGroup = async (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    const eventIdToDelete = moveKeys[0];
    confirmDeleteSync({
      titleConfirm: 'Desea eliminar el evento del grupo',
      descriptionConfirm: 'Si lo elimina del grupo, los usuarios dentro inscritos por libre acceso seran retirados',
      onOk: async () => {
        try {
          await handledDelteEvent(organizationId, selectedGroup.value, eventIdToDelete);
          onChangeTransferEvents(targetKeys, direction, [eventIdToDelete]);
          DispatchMessageService({
            action: 'show',
            type: 'success',
            msj: 'Se retiro al evento del grupo correctamente',
          });
        } catch (error) {
          DispatchMessageService({
            action: 'show',
            type: 'error',
            msj: 'Ocurrio un error el intentar borrar el evento del grupo, intentelo mas tarde',
          });
        }
      },
    });
  };

  const onAddOrgUserToGroup = async (organization_user_ids: string[], moveKeys: string[]) => {
    const plural = moveKeys.length > 1;
    try {
      await handledUpdate(selectedGroup?.item._id ?? '', { organization_user_ids });
      DispatchMessageService({
        action: 'show',
        type: 'success',
        msj: `Se  ${plural ? 'agregaron los usuarios' : 'agrego el usuario'} con exito`,
      });
      setTargetKeysOrgUser(organization_user_ids);
    } catch (error) {
      DispatchMessageService({
        action: 'show',
        type: 'info',
        msj: `Ocurrio un error al agregar ${plural ? 'los usuarios' : 'el usuario'} al grupo`,
      });
    }
  };

  const onDeleteOrgUserGroup = async (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    const orgUserIdToDelete = moveKeys[0];
    confirmDeleteSync({
      titleConfirm: 'Desea retirar el usuario del grupo',
      descriptionConfirm:
        'Si lo elimina del grupo, el usuario inscrito por libre acceso sera retirado del los eventos de este grupo',
      onOk: async () => {
        try {
          await handledDelteOrgUser(organizationId, selectedGroup.value, orgUserIdToDelete);
          onChangeTransferOrgUser(targetKeys, direction, [orgUserIdToDelete]);
          DispatchMessageService({
            action: 'show',
            type: 'success',
            msj: 'Se retiro al usuario del grupo correctamente',
          });
        } catch (error) {
          DispatchMessageService({
            action: 'show',
            type: 'error',
            msj: 'Ocurrio un error el intentar borrar el usuario del grupo, intentelo mas tarde',
          });
        }
      },
    });
  };

  useEffect(() => {
    setTargetKeysEvents(selectedGroup.item.event_ids);
    setTargetKeysOrgUser(selectedGroup.item.organization_user_ids);
  }, [selectedGroup]);

  return (
    <Modal {...modalProps} onCancel={onCancel} title={'Gestionar el grupo'} footer={null}>
      <Form layout='vertical'>
        <Form.Item label={'Eventos'} name={'event_ids'}>
          <Transfer
            pagination
            disabled={isLoadingEventsByOrg}
            listStyle={{ width: '100%', height:'250px'  }}
            oneWay={true}
            showSearch
            dataSource={eventsByOrg.map((event) => ({ ...event, title: event.name, key: event._id }))}
            titles={['Eventos', 'En el grupo']}
            targetKeys={targetKeysEvents}
            selectedKeys={selectedKeysEvents}
            onChange={(event_ids, direction, moveKeys) => {
              if (direction === 'left') {
                onDeleteEventFromGroup(event_ids, direction, moveKeys);
              } else {
                onAddEventsToGroup(event_ids, moveKeys);
              }
            }}
            onSelectChange={onSelectChangeEvents}
            render={(item) => item.title}
            showSelectAll={false}
          />
        </Form.Item>
        <Form.Item label={'Usuarios'} name={'organization_user_ids'}>
          <Transfer
            pagination
            disabled={isLoadingOrgUsers}
            listStyle={{ width: '100%', height:'250px'  }}
            oneWay={true}
            showSearch
            dataSource={organizationUsers.map((orgUser) => ({
              ...orgUser,
              name: orgUser.properties.names,
              key: orgUser._id,
            }))}
            titles={['Usuarios', 'En el grupo']}
            targetKeys={targetKeysOrgUser}
            selectedKeys={selectedKeysOrgUser}
            onChange={(organization_user_ids, direction, moveKeys) => {
              if (direction === 'left') {
                onDeleteOrgUserGroup(organization_user_ids, direction, moveKeys);
              } else {
                onAddOrgUserToGroup(organization_user_ids, moveKeys);
              }
            }}
            onSelectChange={onSelectChangeOrgUser}
            render={(item) => item.name}
            showSelectAll={false}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
