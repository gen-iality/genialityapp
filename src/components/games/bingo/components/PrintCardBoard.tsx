import { useReactToPrint } from 'react-to-print';
import { Button, Space } from 'antd';
import DownloadIcon from '@2fd/ant-design-icons/lib/Download';
import PrinterIcon from '@2fd/ant-design-icons/lib/Printer';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf';
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
        const canvas = await html2canvas(html, {
          logging: false,
          windowWidth: html.scrollWidth,
          windowHeight: html.scrollHeight,
          allowTaint: true,
          useCORS: true,
        });
        const data = canvas.toDataURL('image/png');
        console.log('base64', data);
        // pdf.output('dataurlnewwindow');
      }
    },
  });
  return (
    <>
      <Space>
        <Button loading={loading} disabled={loading} onClick={handleShare} icon={<DownloadIcon />}>
          Descargar
        </Button>
        <Button loading={loading} disabled={loading} onClick={() => onHandlePrint()}>
          <Space split='/'>
            <DownloadIcon />
            <PrinterIcon />
          </Space>
        </Button>
      </Space>
    </>
  );
}
