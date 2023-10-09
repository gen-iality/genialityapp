import { useEffect, useRef } from 'react';
import { Button, Form, Input, Modal, ModalProps, Switch, Transfer } from 'antd';
import { GroupEvent, GroupEventMongo } from '../../interface/group.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import { useGetEventsByOrg } from '@/components/eventOrganization/hooks/useGetEventsByOrg';
import { useTransfer } from '@/hooks/useTransfer';
import { useGetOrganizationUsers } from '../../hooks/useGetOrganizationUsers';

interface Props extends ModalProps {
  onCancel: () => void;
  selectedGroup?: GroupEventMongo;
  organizationId: string;
  handledUpdate: (groupId: string, newGroupData: GroupEvent) => Promise<void>;
  handledAddGroup: (newGrupo: GroupEvent) => Promise<void>;
}

export const GroupModal = ({
  onCancel,
  selectedGroup,
  organizationId,
  handledUpdate,
  handledAddGroup,
  ...modalProps
}: Props) => {
  const inputRef = useRef<any>();
  const [form] = Form.useForm<GroupEvent>();
  const { eventsByOrg } = useGetEventsByOrg(organizationId);
  const { organizationUsers } = useGetOrganizationUsers(organizationId);
  const {
    onChange: onChangeEvents,
    onSelectChange: onSelectChangeEvents,
    selectedKeys: selectedKeysEvents,
    targetKeys: targetKeysEvents,
    setTargetKeys: setTargetKeysEvents,
  } = useTransfer([]);
  const {
    onChange: onChangeOrgUser,
    onSelectChange: onSelectChangeOrgUser,
    selectedKeys: selectedKeysOrgUser,
    targetKeys: targetKeysOrgUser,
    setTargetKeys: setTargetKeysOrgUser,
  } = useTransfer([]);

  const onAddGroup = async (newGroupData: GroupEvent) => {
    try {
      await handledAddGroup({
        name: newGroupData.name,
        free_access_organization: newGroupData.free_access_organization,
        event_ids: newGroupData.event_ids,
        organization_user_ids: newGroupData.organization_user_ids,
      });

      DispatchMessageService({
        action: 'show',
        type: 'success',
        msj: 'Se agrego el grupo correctamente',
      });
      onCancel();
    } catch (error) {
      DispatchMessageService({
        action: 'show',
        type: 'info',
        msj: 'Ocurrio un error al agregar el grupo',
      });
    }
  };

  const onEditGroup = async (newGroupData: GroupEvent) => {
    try {
      await handledUpdate(selectedGroup?.item._id ?? '', newGroupData);
      onCancel();
      DispatchMessageService({
        action: 'show',
        type: 'success',
        msj: 'Se edito el grupo correctamente',
      });
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'info', msj: 'No se pudo editar el grupo' });
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      form.setFieldsValue({
        free_access_organization: selectedGroup.item.free_access_organization,
        name: selectedGroup.item.name,
        event_ids: selectedGroup.item.event_ids,
        organization_user_ids: selectedGroup.item.organization_user_ids,
      });
      setTargetKeysEvents(selectedGroup.item.event_ids);
      setTargetKeysOrgUser(selectedGroup.item.organization_user_ids);
    } else {
      form.setFieldsValue({
        free_access_organization: false,
        name: '',
        event_ids: [],
        organization_user_ids: [],
      });
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Modal {...modalProps} onCancel={onCancel} title={selectedGroup ? 'Editar grupo' : 'Agregar grupo'} footer={null}>
      <Form form={form} onFinish={selectedGroup ? onEditGroup : onAddGroup} layout='vertical'>
        <Form.Item
          name={'name'}
          label={<label>Nombre</label>}
          rules={[{ required: true, message: 'El nombre es requerido' }]}>
          <Input ref={inputRef} placeholder={'Ingrese el nombre del grupo'} maxLength={20} />
        </Form.Item>
        <Form.Item label={'Eventos'} name={'event_ids'}>
          <Transfer
            listStyle={{ width: '100%' }}
            oneWay={true}
            showSearch
            dataSource={eventsByOrg.map((event) => ({ ...event, title: event.name, key: event._id }))}
            titles={['Eventos', 'En el grupo']}
            targetKeys={targetKeysEvents}
            selectedKeys={selectedKeysEvents}
            onChange={onChangeEvents}
            onSelectChange={onSelectChangeEvents}
            render={(item) => item.title}
            showSelectAll={false}
          />
        </Form.Item>
        <Form.Item label={'Usuarios'} name={'organization_user_ids'}>
          <Transfer
            listStyle={{ width: '100%' }}
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
            onChange={onChangeOrgUser}
            onSelectChange={onSelectChangeOrgUser}
            render={(item) => item.name}
            showSelectAll={false}
          />
        </Form.Item>

        <Form.Item
          valuePropName='checked'
          name={'free_access_organization'}
          label={<label>Acceso libre para los miembros de la organización</label>}>
          <Switch />
        </Form.Item>
        <Button htmlType='submit'>{selectedGroup ? 'Editar' : 'Agregar'}</Button>
      </Form>
    </Modal>
  );
};
