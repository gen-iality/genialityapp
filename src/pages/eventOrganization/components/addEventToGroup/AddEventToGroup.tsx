import { Select } from 'antd';
import { useCrudGruopEventList } from '../../hooks/useCrudGruopEventList';
import { EventsApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
import { useEffect, useState } from 'react';

interface Props {
  selectedEvent: any;
}

export const AddEventToGroup = ({ selectedEvent }: Props) => {
  const { groupEvent, isLoadingGroup } = useCrudGruopEventList(selectedEvent.organizer_id);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>('');
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);

  const onAddEventToGroup = async (groupId: string | undefined) => {
    try {
      setSelectedGroup(groupId);
      setIsLoadingSelect(true);
      await EventsApi.editOne({ group_organization_id: groupId ?? '' }, selectedEvent._id);
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se agrego al grupo correctamente' });
    } catch (error) {
      setSelectedGroup(undefined);
      if ((error as any).request.status === 401)
        return DispatchMessageService({
          action: 'show',
          type: 'error',
          msj: 'No esta autorizado para editar este evento',
        });
      DispatchMessageService({ action: 'show', type: 'error', msj: 'No se pudo agregar al evento' });
    } finally {
      setIsLoadingSelect(false);
    }
  };
  useEffect(() => {
    setSelectedGroup(selectedEvent.group_organization_id);
  }, [selectedEvent]);
  /* todo: validar que al editar desde aqui solo importa ser admin en la organizacion */
  return (
    <Select
      disabled={isLoadingSelect || isLoadingGroup}
      onClear={() => onAddEventToGroup(undefined)}
      value={groupEvent.length > 0 ? selectedGroup : null}
      style={{ width: '100%' }}
      onSelect={onAddEventToGroup}
      loading={isLoadingGroup || isLoadingSelect}
      size='large'
      placeholder='Seleccionar grupo'
      options={groupEvent}
      allowClear
    />
  );
};
