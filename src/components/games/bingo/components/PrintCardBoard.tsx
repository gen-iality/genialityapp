import { useReactToPrint } from 'react-to-print';
import { Button, Space } from 'antd';
import { useState } from 'react';
import html2canvas from 'html2canvas';

interface Props { 
  bingoCardRef: any; 
  cardboardCode: string 
  listCartons?: boolean;
}
export default function PrintCardBoard({ bingoCardRef, cardboardCode, listCartons = false }: Props) {
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
      }
    },
  });
  return (
    <Space wrap>
      {/* <Button loading={loading} disabled={loading} onClick={handleShare} icon={<DownloadIcon />}>
          Descargar
        </Button> */}
      <Button loading={loading} disabled={loading} onClick={() => onHandlePrint()}>
        <Space split='/'>
          {listCartons ? 'Descargar cartones':'Descargar cartón'}
          {/* <DownloadIcon />
          <PrinterIcon /> */}
        </Space>
      </Button>
    </Space>
  );
}
