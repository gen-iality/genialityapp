import { useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'
import { Row, Col, Alert, Button, Modal, Typography, Form, Select } from 'antd'
import withContext, { WithEviusContextProps } from '@context/withContext'
import { CertsApi, OrganizationApi, RolAttApi } from '@helpers/request'
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons'

import {
  defaultCertificateBackground,
  defaultCertRows,
} from '@components/certificates/constants'
import { CertRow, Html2PdfCerts, Html2PdfCertsRef } from 'html2pdf-certs'
import 'html2pdf-certs/dist/styles.css'
import CertificateType from '@Utilities/types/CertificateType'
import { replaceAllTagValues } from '@components/certificates/utils/replaceAllTagValues'

import { useEventProgress } from '@context/eventProgressContext'
import { StateMessage } from '@context/MessageService'

const initContent: string = JSON.stringify(defaultCertRows)

function CertificateLandingPage(props: WithEviusContextProps) {
  const { cEvent, cEventUser } = props

  const [isGenerating, setIsGenerating] = useState(false)
  const [certificateData, setCertificateData] = useState<CertificateType>({
    content: initContent,
    background: defaultCertificateBackground,
    event_id: '',
    name: '',
    event: null,
  })
  const [readyCertToGenerate, setReadyCertToGenerate] = useState<
    CertificateType | undefined
  >()
  const [finalCertRows, setFinalCertRows] = useState<CertRow[]>(JSON.parse(initContent))
  const [roles, setRoles] = useState<any[]>([])
  const [availableCerts, setAvailableCerts] = useState<CertificateType[]>([])

  const [filteredCertificates, setFilteredCertificates] = useState<CertificateType[]>([])
  const [selectedCertificateToDownload, setSelectedCertificateToDownload] = useState<
    CertificateType | undefined
  >()

  const cEventProgress = useEventProgress()

  const pdfGeneratorRef = useRef<Html2PdfCertsRef>(null)

  const getOrgMemberProperties = async (dataUser: any) => {
    const { data: orgMembers } = await OrganizationApi.getUsers(
      cEvent.value.organiser._id,
    )
    const orgMember = orgMembers.find(
      (orgMember: any) => orgMember.account_id === dataUser.account_id,
    )
    return orgMember?.properties || {}
  }

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

  const requestCertificates = async () => {
    const certs: CertificateType[] = await CertsApi.byEvent(cEvent.value._id)
    setAvailableCerts(certs)
    if (certs.length === 0) {
      console.info('No certificate available flaco')
      return
    }

    const _roles = await RolAttApi.byEvent(cEvent.value._id)
    setRoles(_roles)

    let _filteredCertificates: CertificateType[] = []

    // Take th default certificate
    const _defaultCertificate: CertificateType | undefined = certs.find(
      (cert: any) => !cert.rol_id,
    )

    if (_defaultCertificate) {
      _filteredCertificates.push(_defaultCertificate)
      console.debug('there is default certificate', _defaultCertificate)
    }

    // Search all certificate that has the same event user role
    if (
      cEventUser.value.rol_id &&
      _roles.find((rol: any) => rol._id === cEventUser.value.rol_id)
    ) {
      const certificatesByRoles = certs.filter(
        (cert) => cert.rol_id === cEventUser.value.rol_id,
      )
      _filteredCertificates.push(...certificatesByRoles)
      console.debug(
        `there are ${certificatesByRoles.length} certificates by role of event user: ${cEventUser.value.rol_id}`,
      )
    }

    // The certificates with no roles will be added too
    certs
      .filter((cert) => !cert.rol_id)
      .forEach((cert) => {
        if (_filteredCertificates.every((certificate) => certificate._id !== cert._id)) {
          _filteredCertificates.push(cert)
        }
      })

    console.log('_filteredCertificates (not filtered)', { _filteredCertificates })

    // Some certificates need an event progress
    _filteredCertificates = _filteredCertificates.filter((cert) => {
      // Filter by attendee type
      console.debug(
        'required_attendee_type is array?',
        Array.isArray(cert.required_attendee_type),
      )
      if (Array.isArray(cert.required_attendee_type)) {
        // If the admin forgot set the requirement, then they are lol
        if (cert.required_attendee_type.length === 0) return true

        if (!cEventUser.value?.properties?.tipoDeAsistente) {
          // Sure the admin set some require attendee type, BUT the user has no one
          console.info(`${cEventUser.value.user?.names} has no attendee type`)
          return false
        }

        if (
          cert.required_attendee_type.includes(
            cEventUser.value.properties.tipoDeAsistente,
          )
        ) {
          console.log('Yuuuuuuu, you are a', cEventUser.value.properties.tipoDeAsistente)
          return true
        } else {
          console.log('No limited for now...')
          return false
        }
      }

      // If no problem, no problem
      if (cert.requirement_config === undefined || !cert.requirement_config.enable) {
        console.log(`cert ${cert.name} has no requirement config`)
        return true
      }

      /**
       * we are using progressFilteredActivities that depends of the event
       * configuration, but the certificates have another configuration when
       * they have ignored activity type. The procedure will be:
       * - Take the activities
       * - Filter by ignored content type
       * - Recalc the progress with the exported EventProgress context methods
       * - Filter here again
       */
      const activityTypeToIgnore = cert.requirement_config.ignore_activity_type ?? []
      console.debug('activityTypeToIgnore:', activityTypeToIgnore)
      const reFilteredActivities = cEventProgress.rawActivities.filter(
        (activity) => !activityTypeToIgnore.includes(activity.type?.name as any),
      )
      console.debug('reFilteredActivities:', reFilteredActivities)
      const reCalcedProgress = cEventProgress.calcProgress(
        cEventProgress.getAttendeesForActivities(
          reFilteredActivities.map((activity) => activity._id!),
        ).length,
        reFilteredActivities.length,
      )
      console.debug('recalc the event progress and got:', {
        activityTypeToIgnore,
        reFilteredActivities,
        reCalcedProgress,
      })
      console.log(cert, 'requires a completion of:', cert.requirement_config.completion)
      if ((cert.requirement_config.completion ?? 0) >= reCalcedProgress) {
        console.log(
          `cert ${cert.name} has completion over progress:`,
          cert.requirement_config.completion,
        )
        return true
      }
      console.log(
        `cert ${cert.name} has completion under progress:`,
        cert.requirement_config.completion,
      )
      return false
    })
    console.log('_filteredCertificates (filtered)', { _filteredCertificates })

    setFilteredCertificates(_filteredCertificates)

    // The default certificate is the first, then:
    setSelectedCertificateToDownload(_filteredCertificates[0])
  }

  useEffect(() => {
    if (!cEvent.value?._id) return
    if (!cEventUser.value?._id) return
    // Load available certificates
    requestCertificates()
      .then(() => StateMessage.show(null, 'success', 'Datos obtenidos', 3))
      .catch((err) => {
        console.error(err)
        StateMessage.show(
          null,
          'error',
          'No se ha podido obtener los datos de certificados',
        )
      })
  }, [cEvent.value, cEventUser.value])

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

    let currentCertRows: CertRow[] = defaultCertRows
    console.debug('selectedCertificateToDownload', { selectedCertificateToDownload })
    if (selectedCertificateToDownload?.content) {
      console.log('parse cert content from DB-saved')
      currentCertRows = JSON.parse(selectedCertificateToDownload?.content) as CertRow[]
    }

    getOrgMemberProperties(cEventUser.value)
      .then((extraOrgMemberProperties) => {
        const newUserDataWithInjection = {
          ...cEventUser.value,
          properties: {
            ...cEventUser.value.properties,
            ...extraOrgMemberProperties,
          },
        }

        const eventWithDateOfToday = { ...cEvent.value }
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
  }, [selectedCertificateToDownload])

  if (availableCerts.length === 0) {
    return (
      <Row gutter={[8, 8]} wrap justify="center">
        <Col span={24}>
          <Alert type="info" message="No hay certificados disponibles" />
        </Col>
      </Row>
    )
  }

  if (filteredCertificates.length === 0) {
    return (
      <Row gutter={[8, 8]} wrap justify="center">
        <Col span={24}>
          <Alert
            type="warning"
            message="No hay certificados disponibles para este usuario"
          />
        </Col>
      </Row>
    )
  }

  return (
    <>
      <Row gutter={[8, 8]} wrap justify="center">
        <Col span={24}>
          <Form.Item label="Certificados disponibles">
            <Select
              options={filteredCertificates.map((cert) => ({
                label: cert.name,
                value: cert._id,
              }))}
              value={selectedCertificateToDownload?._id}
              onChange={(value) =>
                // Set the select certificate
                setSelectedCertificateToDownload(
                  filteredCertificates.find((cert) => cert._id === value),
                )
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              onClick={() => generatePdfCertificate()}
            >
              {isGenerating ? <LoadingOutlined /> : <DownloadOutlined />} Descargar
              certificado
            </Button>
          </Form.Item>
          <Typography.Text strong>
            Éste es una plantilla y no es el certificado final. Clic en descargar para
            obtener el certificado real.
          </Typography.Text>
          {filteredCertificates.length > 0 && (
            <Html2PdfCerts
              handler={pdfGeneratorRef}
              rows={finalCertRows}
              imageUrl={certificateData.background ?? defaultCertificateBackground}
              backgroundColor="#005882"
              enableLinks={true}
              filename="certificate-quiz.pdf"
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
        </Col>
      </Row>
    </>
  )
}

export default withContext((props: any) => <CertificateLandingPage {...props} />)
