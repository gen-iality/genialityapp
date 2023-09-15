import { Select } from 'antd';
import { useGetGruopEventList } from '../../hooks/useGetGruopEventList';
import { EventsApi } from '@/helpers/request';

interface Props {
  selectedEvent: any;
}

export const AddEventToGroup = ({ selectedEvent }: Props) => {
  const { groupEvent, isLoading } = useGetGruopEventList(selectedEvent.organizer_id);
  const onAddEventToGroup = (values: any) => {
   try {
    EventsApi.editOne()
   } catch (error) {
    
   }
  };
  return (
    <Select
      onSelect={onAddEventToGroup}
      loading={isLoading}
      size='large'
      placeholder='Grupo'
      options={groupEvent}
      allowClear
    />
  );
};
