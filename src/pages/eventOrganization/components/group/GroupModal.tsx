import { useEffect, useRef } from 'react';
import { Button, Form, Input, Modal, ModalProps, Switch } from 'antd';
import { GroupEvent, GroupEventMongo } from '../../interface/group.interfaces';
import { DispatchMessageService } from '@/context/MessageService';
import MyTransferComponent from '@/components/common/my-transfer/MyTransferComponent';
import { useGetEventsByOrg } from '@/components/eventOrganization/hooks/useGetEventsByOrg';

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
  const onAddGroup = async (newGroupData: GroupEvent) => {
    try {
      await handledAddGroup({
        name: newGroupData.name,
        free_access_organization: newGroupData.free_access_organization,
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
      });
    } else {
      form.setFieldsValue({
        free_access_organization: false,
        name: '',
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
        <Form.Item name={'name'} label={<label>Nombre</label>}>
          <Input ref={inputRef} placeholder={'Ingrese el nombre del grupo'} maxLength={20} />
        </Form.Item>
        <Form.Item
          label={'Eventos'}
          name={'events'}
          // rules={rules}
        >
          <MyTransferComponent
            dataSource={eventsByOrg.map((event) => ({ ...event, title: event.name, key: event._id }))}
            selectedRowKey={(recorder) => recorder._id}
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
