import { useState, useEffect } from 'react';
import { Document, Page, pdfjs, Outline } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useHelper } from '../../../../context/helperContext/hooks/useHelper';
import HeaderColumnswithContext from '../HeaderColumns';
//import samplePDF from './sample.pdf';

const samplePDF =
  'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/documents%2F633c3faf6ddd2a144254b192%2F2022-20-10-2022-07-10-Interactivo.pdf?alt=media&token=eb8d36a1-b678-4d03-8279-96ae3297178f';

const PdfActivity = () => {
  let { currentActivity } = useHelper();

  const [activityState, setactivityState] = useState('');

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function onItemClick({ pageNumber: itemPageNumber }) {
    setPageNumber(itemPageNumber);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      <Document file={samplePDF} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={600} />
      </Document>
      <div>
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button type='button' disabled={pageNumber <= 1} onClick={previousPage}>
          Previous
        </button>
        <button type='button' disabled={pageNumber >= numPages} onClick={nextPage}>
          Next
        </button>
      </div>
    </>
  );
};

export default PdfActivity;
