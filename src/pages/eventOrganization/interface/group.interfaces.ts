export interface GroupEvent {
  organizationId: string;
  name: string;
  _id: string;
}

export interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}
