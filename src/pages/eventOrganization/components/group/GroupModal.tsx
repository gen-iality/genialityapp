import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, ModalProps, Switch, Transfer } from 'antd';
import { GroupEvent, GroupEventMongo } from '../../interface/group.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import MyTransferComponent from '@/components/common/my-transfer/MyTransferComponent';
import { useGetEventsByOrg } from '@/components/eventOrganization/hooks/useGetEventsByOrg';
import { TransferDirection } from 'antd/lib/transfer';
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
  const { eventsByOrg, isLoadingEventsByOrg } = useGetEventsByOrg(organizationId);
  const { organizationUsers, isLoadingOrgUsers } = useGetOrganizationUsers(organizationId);
  const {
    onChange: onChangeEvents,
    onSelectChange: onSelectChangeEvents,
    selectedKeys: selectedKeysEvents,
    targetKeys: targetKeysEvents,
  } = useTransfer([]);
  const {
    onChange: onChangeOrgUser,
    onSelectChange: onSelectChangeOrgUser,
    selectedKeys: selectedKeysOrgUser,
    targetKeys: targetKeysOrgUser,
  } = useTransfer([]);

  const onAddGroup = async (newGroupData: GroupEvent) => {
    try {
      await handledAddGroup({
        name: newGroupData.name,
        free_access_organization: newGroupData.free_access_organization,
        eventsId: newGroupData.eventsId,
        usersId: newGroupData.usersId,
      });

      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se agrego el grupo correctamente' });
      onCancel();
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'info', msj: 'Ocurrio un error al agregar el grupo' });
    }
  };

  const onEditGroup = async (newGroupData: GroupEvent) => {
    try {
      await handledUpdate(selectedGroup?.item._id ?? '', newGroupData);
      onCancel();
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se edito el grupo correctamente' });
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'info', msj: 'No se pudo editar el grupo' });
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      form.setFieldsValue({
        free_access_organization: selectedGroup.item.free_access_organization,
        name: selectedGroup.item.name,
        eventsId: [],
        usersId: [],
      });
    } else {
      form.setFieldsValue({
        free_access_organization: false,
        name: '',
        eventsId: [],
        usersId: [],
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
        <Form.Item
          label={'Eventos'}
          name={'events'}
          // rules={rules}
        >
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
        <Form.Item
          label={'Usuarios'}
          name={'users'}
          // rules={rules}
        >
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
