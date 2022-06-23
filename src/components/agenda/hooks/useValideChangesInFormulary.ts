import * as Moment from 'moment';
import useDeepStateEqualityValidation from './useDeepStateEqualityValidation';
import FormularyType from "../types/FormularyType";

function useValideChangesInFormulary(
  original: FormularyType,
  saved: FormularyType,
  isPublished: boolean,
  setWasChanged: (was: boolean) => void,
) {
  const deepStateEqualityValidation = useDeepStateEqualityValidation();
  if (!original) return;
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
    isPhysical,
  } = original;

  const initialHour = Moment(hour_start).format('HH:mm');
  const finalHour = Moment(hour_end).format('HH:mm');

  let actualActivityStates = {
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
    isPhysical,
  };

  const equalityValidation = deepStateEqualityValidation(original, actualActivityStates);

  setWasChanged(equalityValidation === false);
}

export default useValideChangesInFormulary;