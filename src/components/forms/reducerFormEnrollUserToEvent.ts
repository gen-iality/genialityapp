import getBasicFields from './getBasicFields';
import { thereAreExtraFields, validateButtonText } from '@/Utilities/formUtils';
export const helperInitialState: any = {
  basicFields: [],
  aditionalFields: [],
  thereAreExtraFields: 0,
  buttonText: '',
};

export const helperReducer = (state: any, action: any) => {
  let fields = action.payload?.fields;
  const editUser = action.payload?.editUser;
  const visibleInCms = action.payload?.visibleInCms;

  switch (action.type) {
    case 'getBasicFields':
      fields = fields.filter((field: any) => {
        return field.name === 'email' || field.name === 'names';
      });

      return {
        ...state,
        basicFields: getBasicFields({ fields, editUser }),
      };

    case 'thereAreExtraFields':
      return {
        ...state,
        thereAreExtraFields: thereAreExtraFields(fields),
      };
    case 'buttonText':
      return {
        ...state,
        buttonText: validateButtonText(editUser, visibleInCms),
      };

    default:
      console.log('🚀 FUERA DEL REDUCER');
      return state;
  }
};
