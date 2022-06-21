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
  setLoadingregister: (data: any) => void;
};

export type newData = {
  userNotFound: boolean;
  userFound: boolean;
  another: boolean;
  user: {} | any;
};

export type FormEnrollUserToEventPropsTypes = {
  fields: any;
  conditionalFields: any;
  editUser: any;
  /** Receive an array of options, example:
     const options = [
    {
      type: 'secondary',
      text: 'option',
      icon: <PageNextOutlineIcon />,
      action: (data) => functionToExecute(),
    },
  ];
   */
  options: any;
  /** It allows to send a function to which the information of the event user will be passed and it will allow to create or update it */
  saveUser: (user: any) => void;
  loaderWhenSavingUpdatingOrDelete: boolean;
  /** Allows setting the state for a loader. */
  checkInUserCallbak: (user: any) => void;
  /** Indicates if the component will be used in the cms or in the landing */
  visibleInCms: boolean;
  submitIcon: ReactNode;
};
export type saveCheckInAttendeePropsTypes = {
  _id: string;
  checked: boolean;
  reloadComponent?: () => void;
  setAttemdeeCheckIn: (state: any) => void;
  checkInUserCallbak: (user: any) => void;
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
export type AttendeeCheckInPropsTypes = {
  editUser: any;
  reloadComponent?: () => any;
  checkInUserCallbak: (user: any) => void;
};
