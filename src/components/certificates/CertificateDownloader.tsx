import CertificateType from '@Utilities/types/CertificateType'
import { EventsApi, OrganizationApi, RolAttApi, UsersApi } from '@helpers/request'
import { CertRow, Html2PdfCerts, Html2PdfCertsRef } from 'html2pdf-certs'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { defaultCertRows, defaultCertificateBackground } from './constants'
import { Button, Modal } from 'antd'
import { getOrgMemberProperties } from '@components/events/CertificateLandingPage'
import dayjs from 'dayjs'
import { replaceAllTagValues } from './utils/replaceAllTagValues'
import { StateMessage } from '@context/MessageService'
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons'

interface ICertificateDownloaderProps {
  organization?: any
  organizationId?: string

  event?: any
  eventId?: string

  user?: any
  userId?: string
  eventUser?: any
  //   eventUserId?: string

  roles?: any[]

  cert: CertificateType | undefined
  certificateName: string

  onGenerating?: (isGenerating: boolean) => void
}

const initContent: string = JSON.stringify(defaultCertRows)

const CertificateDownloader: FunctionComponent<ICertificateDownloaderProps> = (props) => {
  const {
    event,
    eventId,
    user,
    userId,
    eventUser,
    organization,
    organizationId,
    roles,
    cert,
    certificateName,
    onGenerating,
  } = props

  const [finalOrganization, setFinalOrganization] = useState<any | undefined>(
    organization,
  )
  const [finalEvent, setFinalEvent] = useState<any | undefined>(event)
  const [finalUser, setFinalUser] = useState<any | undefined>(user)
  const [finalEventUser, setFinalEventUser] = useState<any | undefined>(eventUser)
  const [finalRoles, setFinalRoles] = useState(roles)

  // Cert states

  const pdfGeneratorRef = useRef<Html2PdfCertsRef>(null)

  const [certificateData, setCertificateData] = useState<CertificateType>({
    content: initContent,
    background: defaultCertificateBackground,
    event_id: '',
    name: '',
    event: null,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreparingCert, setIsPreparingCert] = useState(false)

  const [readyCertToGenerate, setReadyCertToGenerate] = useState<
    CertificateType | undefined
  >()
  const [finalCertRows, setFinalCertRows] = useState<CertRow[]>(JSON.parse(initContent))
  // const [selectedCertificateToDownload, setSelectedCertificateToDownload] = useState<
  //   CertificateType | undefined
  // >()
  const selectedCertificateToDownload = cert

  // Functions

  const generatePdfCertificate = () => {
    if (!selectedCertificateToDownload) {
      Modal.error({
        title: 'Error al generar',
        content: 'Falta seleccionar el certificado a generar',
      })
      return
    }

    setIsGenerating(true)
    setReadyCertToGenerate(selectedCertificateToDownload)
  }

  // Effects

  useEffect(() => {
    if (typeof onGenerating === 'function') {
      onGenerating(isGenerating)
    }
  }, [isGenerating])

  // Loaders

  useEffect(() => {
    if (event) {
      setFinalEvent(event)
    }
  }, [event])

  useEffect(() => {
    if (user) {
      setFinalUser(user)
    }
  }, [user])

  useEffect(() => {
    if (eventUser) {
      setFinalEventUser(eventUser)
    }
  }, [eventUser])

  useEffect(() => {
    if (roles && roles.length > 0) {
      setFinalRoles(roles)
    }
  }, [roles])

  useEffect(() => {
    if (!organizationId) return

    OrganizationApi.getOne(organizationId).then((data) => setFinalOrganization(data))
  }, [organizationId])

  useEffect(() => {
    if (!eventId) return

    EventsApi.getOne(eventId).then((data) => setFinalEvent(data))
  }, [eventId])

  useEffect(() => {
    if (!userId) return

    UsersApi.getProfile(userId).then((data) => setFinalUser(data))
  }, [userId])

  useEffect(() => {
    if (!finalEvent) return
    if (!finalUser) return

    setIsPreparingCert(true)
    UsersApi.getEventUserByUser(finalEvent._id, finalUser._id)
      .then((data) => setFinalEventUser(data))
      .finally(() => {
        setIsPreparingCert(false)
      })
  }, [finalUser, finalEvent])

  useEffect(() => {
    if (!finalEvent) return
    if (Array.isArray(roles)) return

    RolAttApi.byEvent(finalEvent._id).then((data) => setFinalRoles(data))
  }, [finalEvent])

  // Watch and generate the PDF
  useEffect(() => {
    if (!pdfGeneratorRef.current) {
      console.debug('ref to Html2PdfCerts is undefined')
      return
    }
    if (readyCertToGenerate !== undefined) {
      console.log('start generating the certificate')
      pdfGeneratorRef.current.generatePdf()
      setReadyCertToGenerate(undefined)
    }
  }, [readyCertToGenerate, pdfGeneratorRef.current])

  // Processor

  useEffect(() => {
    if (!selectedCertificateToDownload) return
    if (!finalUser) return
    if (!finalEventUser) return
    if (!finalEvent) return
    if (!finalRoles) return

    let currentCertRows: CertRow[] = defaultCertRows
    console.debug('selectedCertificateToDownload', { selectedCertificateToDownload })
    if (selectedCertificateToDownload?.content) {
      console.log('parse cert content from DB-saved')
      currentCertRows = JSON.parse(selectedCertificateToDownload?.content) as CertRow[]
    }

    setIsPreparingCert(true)
    getOrgMemberProperties(finalEventUser, finalOrganization._id)
      .then((extraOrgMemberProperties) => {
        const newUserDataWithInjection = {
          ...finalEventUser,
          properties: {
            ...finalEventUser.properties,
            ...extraOrgMemberProperties,
          },
        }

        const eventWithDateOfToday = { ...finalEvent }
        eventWithDateOfToday.datetime_from = dayjs(
          eventWithDateOfToday.datetime_from,
        ).format('DD/MM/YYYY')
        eventWithDateOfToday.datetime_to = dayjs(eventWithDateOfToday.datetime_to).format(
          'DD/MM/YYYY',
        )

        // Put the user's data in the cert rows to print
        const newCertRows = replaceAllTagValues(
          eventWithDateOfToday,
          newUserDataWithInjection,
          finalRoles,
          currentCertRows,
        )

        setCertificateData({
          ...certificateData,
          ...(selectedCertificateToDownload || {}),
          background:
            selectedCertificateToDownload?.background ??
            certificateData.background ??
            defaultCertificateBackground,
        })
        setFinalCertRows(newCertRows)
      })
      .catch((err) => {
        console.error('The organization user can not be gotten:', err)
        StateMessage.show(null, 'error', 'No se ha podido obtener desde el servidor')
      })
      .finally(() => {
        setIsPreparingCert(false)
      })
  }, [
    selectedCertificateToDownload,
    finalUser,
    finalOrganization,
    finalEventUser,
    finalEvent,
  ])

  return (
    <div>
      {selectedCertificateToDownload && (
        <Button
          disabled={isGenerating || isPreparingCert}
          type="primary"
          onClick={() => {
            generatePdfCertificate()
          }}
        >
          {isPreparingCert ? (
            <>
              Cargando datos específicos... <LoadingOutlined />
            </>
          ) : (
            <>
              Descargar <DownloadOutlined />
            </>
          )}
        </Button>
      )}
      {selectedCertificateToDownload && !isPreparingCert && (
        <Html2PdfCerts
          handler={pdfGeneratorRef}
          rows={finalCertRows}
          imageUrl={certificateData.background ?? defaultCertificateBackground}
          backgroundColor="#005882"
          enableLinks={true}
          filename={certificateName}
          format={[
            certificateData.cert_width ?? 1280,
            certificateData.cert_height ?? 720,
          ]}
          sizeStyle={{
            height: certificateData.cert_height ?? 720,
            width: certificateData.cert_width ?? 1280,
          }}
          transformationScale={0.5}
          unit="px"
          orientation="landscape"
          onEndGenerate={() => {
            setIsGenerating(false)
          }}
        />
      )}
    </div>
  )
}

export default CertificateDownloader
