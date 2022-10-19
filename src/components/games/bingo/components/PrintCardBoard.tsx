import ReactToPrint from 'react-to-print';
import BingoCard from './BingoCard';
import { Button, Space } from 'antd';
import DownloadIcon from '@2fd/ant-design-icons/lib/Download';
import PrinterIcon from '@2fd/ant-design-icons/lib/Printer';
export default function PrintCardBoard(bingoCardRef: RefHTMLDivElement) {
  return (
    <>
      <Space>
        <Button icon={<DownloadIcon />}>Descargar</Button>
        <Button icon={<PrinterIcon />}>Imprimir</Button>
      </Space>
    </>
  );
}
