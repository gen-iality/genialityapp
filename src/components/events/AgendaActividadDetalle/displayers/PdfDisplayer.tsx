import { useState, useEffect, FunctionComponent } from 'react'
import { Document as DocumentReactPDF, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

import HeaderColumnswithContext from '../HeaderColumns'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

import { IBasicActivityProps } from './basicTypes'

const PdfDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props

  const [pdfURL, setPdfURL] = useState()

  const [numPages, setNumPages] = useState<number | undefined>()
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    if (!activity) return
    setPdfURL(activity.meeting_id)
  }, [activity])

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages as number)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  // function onItemClick({ pageNumber: itemPageNumber }) {
  //   setPageNumber(itemPageNumber)
  // }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      <a href={pdfURL} target="blank">
        Descargar PDF
      </a>
      <DocumentReactPDF file={pdfURL} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={600} />
      </DocumentReactPDF>
      <div>
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
          Previous
        </button>
        <button type="button" disabled={pageNumber >= (numPages || 0)} onClick={nextPage}>
          Next
        </button>
      </div>
    </>
  )
}

export default PdfDisplayer
