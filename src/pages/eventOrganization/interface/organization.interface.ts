import type { RcFile, UploadProps } from 'antd/es/upload';

export interface FormUserOrganization {
    names: string;
    email: string;
    password: string;
    imageFile?: RcFile
}