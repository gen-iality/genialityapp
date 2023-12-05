export interface IConditionalField {
  id?: string;
  fieldToValidate: string;
  value: string | boolean;
  fields: string[];
  state: any;
}

export interface IConditionalFieldTable extends IConditionalField {
  fieldToValidateLabel?: string;
  fieldLabels: string[];
}

export interface IConditionalFieldForm extends Pick<IConditionalField, 'fields' | 'fieldToValidate' | 'value'> {}

export type TTypeFieldConditional = 'list' | 'boolean';
