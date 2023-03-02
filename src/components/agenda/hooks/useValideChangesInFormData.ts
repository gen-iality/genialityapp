import dayjs from 'dayjs';
import useDeepStateEqualityValidation from './useDeepStateEqualityValidation';
import { FormDataType } from '../components/MainAgendaForm';

function useValideChangesInFormData(
  saved: FormDataType,
  modified: FormDataType,
  isPublished: boolean,
  setWasChanged: (was: boolean) => void,
) {
  const deepStateEqualityValidation = useDeepStateEqualityValidation();
  const valideChangesInFormData = () => {
    if (!saved) return;
    const {
      name,
      hour_start,
      hour_end,
      date,
      space_id,
      selectedCategories,
      description,
      image,
      // isPublished,
      length,
      latitude,
      selectedHosts,
      selectedTools,
      isPhysical,
    } = modified;

    const initialHour = dayjs(hour_start).format('HH:mm');
    const finalHour = dayjs(hour_end).format('HH:mm');

    const formattedModified = {
      name,
      hour_start: initialHour,
      hour_end: finalHour,
      date,
      space_id,
      selectedCategories,
      description,
      image,
      isPublished: isPublished,
      length,
      latitude,
      selectedHosts,
      selectedTools,
      isPhysical,
    };

    const equalityValidation = deepStateEqualityValidation(modified, formattedModified);
    console.log('equalityValidation:', equalityValidation);
    setWasChanged(!equalityValidation);
  };

  return valideChangesInFormData;
}

export default useValideChangesInFormData;
