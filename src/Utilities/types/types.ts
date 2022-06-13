import { ReactNode } from 'react';

export type ImageUploaderDragAndDropType = {
  imageDataCallBack: (file: object | null) => void;
  imageUrl: string;
  width: number | string;
  height: number | string;
};

export type fieldsData = {
  name: string;
  label: string;
  type: string;
};

export type searchValue = {
  document: string;
  qr: string;
};
export type searchDocumentOrIdPropsTypes = {
  key: string;
  searchValue: searchValue;
  fields: any;
  eventID: string;
  setScannerData: (data: any) => void;
  setCheckInLoader: (data: any) => void;
};

export type newData = {
  userNotFound: boolean;
  userFound: boolean;
  another: boolean;
  user: {} | any;
};
export type userCheckInPropsTypes = {
  scannerData: {
    user: {} | any;
  };
  setScannerData: (data: any) => void;
  handleScan: (data: any) => void;
  setCheckInLoader: (data: any) => void;
  checkIn: (id: any, user: any) => any;
};

export type FormEnrollUserToEventPropsTypes = {
  fields: any;
  conditionalFields: any;
  editUser: any;
  options: any;
  saveUser: (user: any) => void;
  loaderWhenSavingUpdatingOrDelete: boolean;
  visibleInCms: boolean;
  submitIcon: ReactNode;
};
export type saveCheckInAttendeePropsTypes = {
  _id: string;
  checked: boolean;
  reloadComponent: () => void;
  setAttemdeeCheckIn: (state: any) => void;
};

export type aditionalFieldsPropsTypes = {
  validatedFields: Array<any>;
  editUser: any;
  visibleInCms: any;
};
export type updateFieldsVisibilityPropsTypes = {
  conditionalFields: any;
  allValues: any;
  fields: [];
  setValidatedFields: (state: any) => any;
};
