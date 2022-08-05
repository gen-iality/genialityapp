import { FormDataType } from '../components/MainAgendaForm';
import { DispatchMessageService } from '@/context/MessageService';

export default function useValidAgendaForm (formdata: FormDataType)  {
  const validForm: () => boolean = () => {
    const title = [];
    if (formdata.name.length <= 0)
      title.push('El nombre es requerido');

    if (formdata.date === '' || formdata.date === 'Invalid date')
      title.push('Seleccione el día');

    if (formdata.hour_start === '' || formdata.hour_start === 'Invalid date')
      title.push('Seleccione una hora de inicio valida');

    if (formdata.hour_end === '' || formdata.hour_end === 'Invalid date')
      title.push('Seleccione una hora de finalización valida');
    
    if (title.length === 0) return true;

    title.map((item) => {
      DispatchMessageService({ msj: item, type: 'warning', action: 'show' });
    });

    return false;
  };
  return validForm;
}
