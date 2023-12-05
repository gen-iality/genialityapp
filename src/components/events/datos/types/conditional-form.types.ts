export interface IConditionalField {
	_id?: string;
	fieldToValidate: string;
	value: string | boolean;
	fields: string[];
	state: TValueState;
}

export interface IConditionalFieldTable extends IConditionalField {
	fieldToValidateLabel?: string;
	fieldLabels: string[];
}

export interface IConditionalFieldForm extends Pick<IConditionalField, 'fields' | 'fieldToValidate' | 'value'> {}

export type TTypeFieldConditional = 'list' | 'boolean';

export type TValueState = 'enabled' | 'disabled';
export interface IConditionalStatus {
	enabled: IState;
	disabled: IState;
}

export interface IState {
	label: string;
	status: 'green' | 'red';
}
