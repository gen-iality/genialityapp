export interface ExcelEventColumn {
    title: string;
    dataIndex: string;
}

export interface DataEvent {
  _id: string;
  name: string;
  startDate: string;
  speaker: string[];
  count: number;
  documentsUrls:string[];
  videoUrls:string[];
}