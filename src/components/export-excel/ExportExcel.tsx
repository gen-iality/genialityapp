import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { utils, writeFileXLSX } from 'xlsx';
import { DispatchMessageService } from '../../context/MessageService';
import { ExcelColumn } from '@/pages/eventOrganization/tableColums/interfaces/ExcelEvent.interface';

interface Props {
  list?: { [key: string]: any }[];
  columns?: ExcelColumn[];
  fileName: string;
}
export const ExportExcel = ({ list, columns, fileName }: Props) => {
  const exportData = async () => {
    if (list) {
      const newlist = list.map((obj) => {
        let newObj: { [key: string]: any } = {};
        Object.keys(obj).forEach((key) => {
          const nameColum = columns?.find((c) => c.dataIndex === key)?.title;
          if (Array.isArray(obj[key])) {
            newObj[nameColum ?? key] = obj[key].join(',');
          } else {
            newObj[nameColum ?? key] = obj[key];
          }
        });
        return newObj;
      });
      // console.log({ newlist })
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(newlist);
      utils.book_append_sheet(wb, ws, 'Datos');
      writeFileXLSX(wb, fileName + '.xlsx');
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'No hay datos que exportar',
        action: 'show',
      });
    }
  };

  return (
    <div>
      <Button onClick={exportData}>
        <DownloadOutlined /> Exportar
      </Button>
    </div>
  );
};
