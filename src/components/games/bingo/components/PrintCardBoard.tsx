import { useReactToPrint } from 'react-to-print';
import { Button, Space } from 'antd';
import DownloadIcon from '@2fd/ant-design-icons/lib/Download';
import PrinterIcon from '@2fd/ant-design-icons/lib/Printer';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function PrintCardBoard({ bingoCardRef, cardboardCode }: { bingoCardRef: any; cardboardCode: string }) {
  const [loading, setLoading] = useState(false);
  const handlePrintHook = useReactToPrint({
    content: () => bingoCardRef.current,
    documentTitle: `Bingo ID: ${cardboardCode}`,
    onAfterPrint: () => setLoading(false),
  });

  const onHandlePrint = () => {
    setLoading(true);
    handlePrintHook();
  };
  const handleShare = useReactToPrint({
    content: () => bingoCardRef.current,
    documentTitle: `${cardboardCode}.pdf`,
    copyStyles: true,
    print: async (printIframe: HTMLIFrameElement) => {
      const document = printIframe.contentDocument;
      if (document) {
        const html = document.getElementsByTagName('html')[0];
        console.log(html);
        html2canvas(html).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          {
            /*
          ts-ignore
        */
          }
          pdf.addImage(imgData, 'JPEG', 0, 0);
          // pdf.output('dataurlnewwindow');
          pdf.save('download.pdf');
        });
      }
    },
  });
  return (
    <>
      <Space>
        <Button loading={loading} disabled={loading} onClick={handleShare} icon={<DownloadIcon />}>
          Descargar
        </Button>
        <Button loading={loading} disabled={loading} onClick={() => onHandlePrint()} icon={<PrinterIcon />}>
          Imprimir
        </Button>
      </Space>
    </>
  );
}
