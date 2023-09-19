import { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, ModalProps } from 'antd';
import { GroupEvent } from '../../interface/group.interfaces';
import { GroupsApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';

interface Props extends ModalProps {
  onCancel: () => void;
  selectedGroup?: any;
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
  const [groupName, setgroupName] = useState('');
  const inputRef = useRef<any>();
  const handledChange = (value: string) => {
    setgroupName(value);
  };

  const onAddGroup = async () => {
    try {
      await handledAddGroup({
        name: groupName,
      });
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se agrego el grupo correctamente' });
      onCancel();
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'info', msj: 'Ocurrio un error al agregar el grupo' });
    }
  };

  const onEditGroup = async () => {
    try {
      await handledUpdate(selectedGroup._id, { name: groupName });
      onCancel();
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se edito el grupo correctamente' });
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'info', msj: 'No se pudo editar el grupo' });
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      setgroupName(selectedGroup.name);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Modal {...modalProps} onCancel={onCancel} title={selectedGroup ? 'Editar grupo' : 'Agregar grupo'} footer={null}>
      <Input
        ref={inputRef}
        placeholder={'Ingrese el nombre del grupo'}
        value={groupName}
        onChange={({ target: { value } }) => handledChange(value)}
        maxLength={20}
      />
      <Button onClick={selectedGroup ? onEditGroup : onAddGroup}>{selectedGroup ? 'Editar' : 'Agregar'}</Button>
    </Modal>
  );
};
