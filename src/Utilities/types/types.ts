import { ReactNode } from 'react';

export type ImageUploaderDragAndDropType = {
  imageDataCallBack: (file: object | null) => void;
  imageUrl: string;
  width: number | string | null;
  height: number | string | null;
  styles?: Object,
  hoverable?: boolean
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
  attendeeNotFound: boolean;
  attendeeFound: boolean;
  another: boolean;
  attendee: {} | any;
};

export type FormEnrollAttendeeToEventPropsTypes = {
  fields: any;
  conditionalFields: any;
  attendee: any;
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
  /** It allows to send a function to which the information of the event attendee will be passed and it will allow to create or update it */
  saveAttendee: (attendee: any) => void;
  loaderWhenSavingUpdatingOrDelete: boolean;
  /** Allows setting the state for a loader. */
  checkInAttendeeCallbak: (attendee: any) => void;
  /** Indicates if the component will be used in the cms or in the landing */
  visibleInCms: boolean;
  submitIcon: ReactNode;
};
export type saveCheckInAttendeePropsTypes = {
  _id: string;
  checked: boolean;
  reloadComponent?: () => void;
  setAttemdeeCheckIn?: (state: any) => void;
  checkInAttendeeCallbak?: (attendee: any) => void;
  notification?: boolean;
};

export type aditionalFieldsPropsTypes = {
  validatedFields: Array<any>;
  attendee: any;
  visibleInCms: any;
};
export type updateFieldsVisibilityPropsTypes = {
  conditionalFields: any;
  allValues: any;
  fields: [];
  setValidatedFields: (state: any) => any;
};
export type AttendeeCheckInPropsTypes = {
  attendee: any;
  reloadComponent?: () => any;
  checkInAttendeeCallbak: (attendee: any) => void;
};
