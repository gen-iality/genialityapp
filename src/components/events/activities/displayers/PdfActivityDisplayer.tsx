import { useState, useEffect, FunctionComponent } from 'react'
import { Document as DocumentReactPDF, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

import HeaderColumnswithContext from '../HeaderColumns'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

import { IBasicActivityProps } from './basicTypes'
import { Alert } from 'antd'

const PdfActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props

  const [pdfURL, setPdfURL] = useState<string | null>(null)

  const [numPages, setNumPages] = useState<number | undefined>()

  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  useEffect(() => {
    if (!activity.content?.reference) return
    setPdfURL(activity.content.reference)
  }, [activity.content])

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages as number)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      {pdfURL ? (
        <>
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
            <button
              type="button"
              disabled={pageNumber >= (numPages || 0)}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
          {activity.content?.type != 'pdf_url' && (
            <Alert
              type="info"
              message={`El tipo de contenido ${activity.content?.type} es desconocido o nuevo`}
            />
          )}
        </>
      ) : (
        <Alert type="error" message="No se ha definido una URL a un PDF" />
      )}
    </>
  )
}

export default PdfActivityDisplayer
