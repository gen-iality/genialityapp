
export type RegisteredOption = 'all' | 'not-register' | 'group-event';

export interface FormUserOrganization {
  names: string;
  email: string;
  password: string;
  registeredOption: RegisteredOption;
  group?: string[];
}

export interface IUserToOrganization extends FormUserOrganization {
  [key: string]: any;
  active: boolean | undefined;
}
