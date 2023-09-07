import type { RcFile, UploadProps } from 'antd/es/upload';

export interface FormUserOrganization {
    names: string;
    email: string;
    password: string;
}

export interface UserToOrganization extends FormUserOrganization {
    [key: string]: any;
    active:boolean | undefined
}
