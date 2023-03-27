import { ModalProps } from "antd";

export interface CreateUserModalProps extends ModalProps {
  createModalVisible: boolean;
  onCancelModalCreateUser: () => void;
  onOk: () => void;
}

export interface FieldsForm {
    name:               string;
    label:              string;
    unique:             boolean;
    mandatory:          boolean;
    type:               string;
    updated_at?:        AtedAt;
    created_at?:        AtedAt;
    _id:                string;
    visibleByAdmin?:    boolean;
    author?:            null;
    categories?:        any[];
    organizer?:         null;
    tickets?:           any[];
    fields_conditions?: any[];
    options?:           Option[];
    visibleByContacts?: string;
}
export interface Option {
  label: string;
  value: string;
}

export interface AtedAt {
  $date: DateClass;
}

export interface DateClass {
  $numberLong: string;
}