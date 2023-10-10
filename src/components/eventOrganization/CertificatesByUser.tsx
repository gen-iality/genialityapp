import { LoadingOutlined } from '@ant-design/icons'
import { StateMessage } from '@context/MessageService'
import { UsersApi, EventsApi, RolAttApi } from '@helpers/request'
import { Button, Modal, Result, Space, Table, Typography } from 'antd'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import useCertificateFinder from './hooks/useCertificateFinder'
import { ColumnsType } from 'antd/lib/table'
import { CertRow, Html2PdfCerts, Html2PdfCertsRef } from 'html2pdf-certs'
import CertificateType from '@Utilities/types/CertificateType'
import {
  defaultCertRows,
  defaultCertificateBackground,
} from '@components/certificates/constants'
import { replaceAllTagValues } from '@components/certificates/utils/replaceAllTagValues'
import { getOrgMemberProperties } from '@components/events/CertificateLandingPage'
import dayjs from 'dayjs'

type Params = {
  id: string
  userId: string
}

interface ICertificatesByUserProps {}

const initContent: string = JSON.stringify(defaultCertRows)

const CertificatesByUser: FunctionComponent<ICertificatesByUserProps> = (props) => {
  const { id: organizationId, userId } = useParams<Params>()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [eventUser, setEventUser] = useState<any | null>(null)
  const [certs, setCerts] = useState<any[]>([])

  const [dataSource, setDataSource] = useState<any>([])
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [roles, setRoles] = useState<any[]>([])
  const [cacheEvents, setCacheEvents] = useState<{ [key: string]: any }>({})
  const [cacheRoles, setCacheRoles] = useState<{ [key: string]: any }>({})
  const [currentEvent, setCurrentEvent] = useState<any | null>(null)

  const pdfGeneratorRef = useRef<Html2PdfCertsRef>(null)

  const [certificateData, setCertificateData] = useState<CertificateType>({
    content: initContent,
    background: defaultCertificateBackground,
    event_id: '',
    name: '',
    event: null,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [readyCertToGenerate, setReadyCertToGenerate] = useState<
    CertificateType | undefined
  >()
  const [finalCertRows, setFinalCertRows] = useState<CertRow[]>(JSON.parse(initContent))
  const [selectedCertificateToDownload, setSelectedCertificateToDownload] = useState<
    CertificateType | undefined
  >()

  const [columns] = useState<ColumnsType<any>>([
    {
      title: 'Certificado',
      dataIndex: 'name',
    },
    {
      title: 'Curso',
      dataIndex: 'event',
      render: (event: any) => event.name,
    },
    {
      title: 'Opciones',
      render: ({ cert, roles, event }) => {
        return (
          <Button
            onClick={() => {
              setCurrentEvent(event)
              setSelectedCertificateToDownload(cert)
              setRoles(roles)
            }}
          >
            Precargar
          </Button>
        )
      },
    },
  ])

  const { loadCertsByUser } = useCertificateFinder(organizationId)

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

  useEffect(() => {
    if (!userId) return

    UsersApi.getProfile(userId).then((data) => {
      setUser(data)
    })

    setIsLoading(true)
    loadCertsByUser(userId)
      .then((certs) => {
        setCerts(certs)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [userId])

  useEffect(() => {
    setIsLoadingTable(true)
    Promise.all(
      certs.map(async (cert) => {
        const { name, event_id } = cert

        let event: any = cacheEvents[event_id]
        let roles: any[] = cacheRoles[event_id]
        if (!event) {
          event = await EventsApi.getOne(event_id)

          setCacheEvents((previous) => ({
            ...previous,
            [event_id]: event,
          }))
        }

        if (!roles) {
          roles = await RolAttApi.byEvent(event_id)
          setCacheRoles
        }

        setRoles(roles)

        console.debug({ name, event, roles })

        return { name, event, cert, roles }
      }),
    )
      .then((result) => {
        console.debug('result', result)
        setDataSource(result)
      })
      .finally(() => {
        setIsLoadingTable(false)
      })
  }, [certs])

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

  useEffect(() => {
    if (!selectedCertificateToDownload) return
    if (!organizationId) return
    if (!user) return
    if (!eventUser) return
    if (!currentEvent) return

    let currentCertRows: CertRow[] = defaultCertRows
    console.debug('selectedCertificateToDownload', { selectedCertificateToDownload })
    if (selectedCertificateToDownload?.content) {
      console.log('parse cert content from DB-saved')
      currentCertRows = JSON.parse(selectedCertificateToDownload?.content) as CertRow[]
    }

    getOrgMemberProperties(eventUser, organizationId)
      .then((extraOrgMemberProperties) => {
        const newUserDataWithInjection = {
          ...eventUser,
          properties: {
            ...eventUser.properties,
            ...extraOrgMemberProperties,
          },
        }

        const eventWithDateOfToday = { ...currentEvent }
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
          roles,
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
  }, [selectedCertificateToDownload, user, organizationId, eventUser, currentEvent])

  useEffect(() => {
    if (!currentEvent) return
    if (!user) return

    UsersApi.getEventUserByUser(currentEvent._id, user._id)
      .then((data) => {
        setEventUser(data)
      })
      .catch((err) => {
        console.error(err)
        StateMessage.show(
          null,
          'error',
          `No puede obtener el registro del usuario en el evento ${currentEvent.name}`,
        )
      })
  }, [currentEvent, user])

  if (isLoading) {
    return (
      <Result
        icon={<LoadingOutlined />}
        title="Cargando"
        subTitle="Recuperando datos (esto puede demorar una eternidad)..."
      />
    )
  }

  return (
    <Space direction="vertical">
      {user && <Typography.Title>{user.names}</Typography.Title>}
      {selectedCertificateToDownload && (
        <p>Seleccionado: {selectedCertificateToDownload.name}</p>
      )}
      <Table loading={isLoadingTable} dataSource={dataSource} columns={columns} />
      {selectedCertificateToDownload && (
        <Button
          disabled={isGenerating}
          type="primary"
          onClick={() => {
            generatePdfCertificate()
          }}
        >
          Descargar
        </Button>
      )}
      {selectedCertificateToDownload && (
        <Html2PdfCerts
          handler={pdfGeneratorRef}
          rows={finalCertRows}
          imageUrl={certificateData.background ?? defaultCertificateBackground}
          backgroundColor="#005882"
          enableLinks={true}
          filename={`certificate of ${user.names}.pdf`}
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
    </Space>
  )
}

export default CertificatesByUser
