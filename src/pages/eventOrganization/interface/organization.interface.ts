
export type RegisteredOption = 'all' | 'not-register' | 'group-event';

export interface FormUserOrganization {
  names: string;
  email: string;
  password: string;
  registeredOption: RegisteredOption;
  group?: string[];
}

export interface UserToOrganization extends FormUserOrganization {
  [key: string]: any;
  active: boolean | undefined;
}
