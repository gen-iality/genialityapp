import { FormularyType } from '../components/AgendaFormulary';
import { DispatchMessageService } from '@/context/MessageService';

export default function useValidAgendaForm (formulary: FormularyType)  {
  const validForm: () => boolean = () => {
    const title = [];
    if (formulary.name.length <= 0)
      title.push('El nombre es requerido');

    if (formulary.date === '' || formulary.date === 'Invalid date')
      title.push('Seleccione el día');

    if (formulary.hour_start === '' || formulary.hour_start === 'Invalid date')
      title.push('Seleccione una hora de inicio valida');

    if (formulary.hour_end === '' || formulary.hour_end === 'Invalid date')
      title.push('Seleccione una hora de finalización valida');
    
    if (title.length > 0) {
      title.map((item) => {
        DispatchMessageService({ msj: item, type: 'warning', action: 'show' });
      });
    } else return true;

    return false;
  };
  return validForm;
}
