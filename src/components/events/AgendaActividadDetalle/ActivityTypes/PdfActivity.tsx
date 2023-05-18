import { useState, useEffect, FunctionComponent } from 'react'
import { Document as DocumentReactPDF, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

import { useHelper } from '../../../../context/helperContext/hooks/useHelper'
import HeaderColumnswithContext from '../HeaderColumns'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

// TODO: not use useHelper, pass the activity data via props to be this component portable

const PdfActivity: FunctionComponent = () => {
  const { currentActivity } = useHelper()

  const [activityState, setActivityState] = useState<any>()
  const [pdfURL, setPdfURL] = useState()

  const [numPages, setNumPages] = useState<number | undefined>()
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    setActivityState(currentActivity)
  }, [currentActivity])

  useEffect(() => {
    if (!activityState) return
    setPdfURL(activityState.meeting_id)
  }, [activityState])

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
      <HeaderColumnswithContext isVisible activityState={activityState} />
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

export default PdfActivity
