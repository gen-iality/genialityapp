export type ImageUploaderDragAndDropType = {
  imageDataCallBack: (file: object | null) => void;
  imageUrl: string;
  width: number | string;
  height: number | string;
};

export type fieldsData = {
  name: string;
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
