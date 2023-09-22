import { DataEvent, ExcelColumn } from '../interfaces/ExcelEvent.interface';

export const parseEventsDataToExcel = (events: any[]): DataEvent[] => {
  return events.map((event) => {
    const startDate = Array.isArray(event.dates) ? event.dates[0]?.start : event.datetime_from;
    return {
      _id: event._id,
      name: event.name,
      startDate,
      count: event.count,
      speaker: event.hosts.map((speaker: any) => speaker.name),
      documentsUrls: event.documents.map((document: any) => document.file),
      videoUrls: event.url_videos,
    };
  });
};

export const parseDataMembersToExcel = (membersDat: any[], columsMembers: any[]) => {
  const filteredData = membersDat.map((item) => {
    const filteredItem: { [key: string]: any } = {};
    columsMembers.forEach((column) => {
      if (column.dataIndex && item.hasOwnProperty(column.dataIndex)) {
        filteredItem[column.dataIndex] = item[column.dataIndex];
      }
    });

    return filteredItem;
  });
  return filteredData;
};

export const parseMembersColumsExcel = (userPropertiesOrg: any[]): ExcelColumn[] => {
  const colums: ExcelColumn[] = [
    {
      title: 'Nombres y apellidos',
      dataIndex: 'names',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'position',
    },
  ];
  const propertiesConstants = colums.map((item) => item.dataIndex);
  const properties = userPropertiesOrg
    .filter((propertie) => !propertiesConstants.includes(propertie.name))
    .map<ExcelColumn>((propertie) => ({ dataIndex: propertie.name, title: propertie.label }));
  return [...colums, ...properties];
};
