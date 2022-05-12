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

export type searchDocumentOrIdPropsTypes = {
  key: string;
  documentOrId: string;
  fields: any;
  eventID: string;
  setQrData: (data: any) => void;
  setCheckInLoader: (data: any) => void;
};

export type newData = {
  msg: string;
  another: boolean;
  user: {} | any;
  formVisible: boolean;
};
export type userCheckInPropsTypes = {
  user: {} | any;
  qrData: {};
  setQrData: (data: any) => void;
  handleScan: (data: any) => void;
  setCheckInLoader: (data: any) => void;
  checkIn: (id: any, user: any) => any;
};
