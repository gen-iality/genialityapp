export interface IConditionalField {
  fieldToValidate: string;
  value: string;
  fields: string[];
  state: any;
}

export interface IConditionalFieldTable extends IConditionalField {
  fieldToValidateLabel?: string;
  fieldLabels: string[];
}

export interface IConditionalFieldForm extends IConditionalField {}

export type TTypeFieldConditional = 'list' | 'boolean';
