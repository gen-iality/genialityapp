import { useEffect, useState, createElement, useMemo, useRef } from 'react'
import dayjs from 'dayjs'
import {
  Row,
  Col,
  Card,
  Spin,
  Alert,
  Button,
  Modal,
  Typography,
  Form,
  Select,
} from 'antd'
import withContext, { WithEviusContextProps } from '@context/withContext'
import {
  AgendaApi,
  CertsApi,
  OrganizationApi,
  RolAttApi,
  SurveysApi,
} from '@helpers/request'
import { SurveyData } from '@components/events/surveys/types'
import useAsyncPrepareQuizStats from '../quiz/useAsyncPrepareQuizStats'
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons'

import { activityContentValues } from '@context/activityType/constants/ui'

import AgendaType from '@Utilities/types/AgendaType'
import {
  defaultCertificateBackground,
  defaultCertRows,
} from '@components/certificates/constants'
import { CertRow, Html2PdfCerts, Html2PdfCertsRef } from 'html2pdf-certs'
import 'html2pdf-certs/dist/styles.css'
import CertificateType from '@Utilities/types/CertificateType'
import { replaceAllTagValues } from '@components/certificates/utils/replaceAllTagValues'
import { FB } from '@helpers/firestore-request'
import { useEventContext } from '@context/eventContext'
import { useEventProgress } from '@context/eventProgressContext'

type CurrentEventAttendees = any // TODO: define this type and move to @Utilities/types/

const initContent: string = JSON.stringify(defaultCertRows)

function CertificateLandingPage(props: WithEviusContextProps) {
  const { cEvent, cEventUser, cUser } = props

  const [wereEvaluationsPassed, setWereEvaluationsPassed] = useState<boolean | undefined>(
    undefined,
  )
  const [thereAreEvaluations, setThereAreEvaluations] = useState<boolean | undefined>(
    undefined,
  )

  const [activitiesAttendee, setActivitiesAttendee] = useState<CurrentEventAttendees[]>(
    [],
  )
  const [allActivities, setAllActivities] = useState<AgendaType[]>([])

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

  // /**
  //  * Generate the certificate.
  //  *
  //  * If you pass false in dryRun, a real certificate will be generated.
  //  *
  //  * @param dataUser The user data. Generally it is taken from the eventUser.
  //  * @param dryRun true if you only want to show the certificate preview.
  //  */
  // const generateCert = async (dataUser: any, dryRun: boolean = false) => {
  //   const extraOrgMemberProperties = await getOrgMemberProperties(dataUser)

  //   dataUser = {
  //     ...dataUser,
  //     properties: {
  //       ...dataUser.properties,
  //       ...extraOrgMemberProperties,
  //     },
  //   }

  //   let modal: null | ReturnType<typeof Modal.success> = null
  //   if (!dryRun) {
  //     modal = Modal.success({
  //       title: 'Generando certificado',
  //       content: <Spin>Espera</Spin>,
  //     })
  //   }

  //   const certs = await CertsApi.byEvent(cEvent.value._id)
  //   setAvailableCerts(certs)

  //   const roles = await RolAttApi.byEvent(cEvent.value._id)
  //   const currentEvent = { ...cEvent.value }
  //   currentEvent.datetime_from = dayjs(currentEvent.datetime_from).format('DD/MM/YYYY')
  //   currentEvent.datetime_to = dayjs(currentEvent.datetime_to).format('DD/MM/YYYY')

  //   //Por defecto se trae el certificado sin rol
  //   let rolCert: CertificateType | undefined = certs.find((cert: any) => !cert.rol_id)
  //   //Si el asistente tiene rol_id y este corresponde con uno de los roles attendees, encuentra el certificado ligado
  //   const rolValidation = roles.find((rol: any) => rol._id === dataUser.rol_id)
  //   if (rolValidation) {
  //     if (dataUser.rol_id) {
  //       rolCert = certs.find((cert: any) => cert.rol._id === dataUser.rol_id)
  //     }
  //   }
  //   (rolCert)

  //   let currentCertRows: CertRow[] = defaultCertRows
  //   console.debug('rolCert', { rolCert })
  //   if (rolCert?.content) {
  //     console.log('parse cert content from DB-saved')
  //     currentCertRows = JSON.parse(rolCert?.content) as CertRow[]
  //   }

  //   // Put the user's data in the cert rows to print
  //   const newCertRows = replaceAllTagValues(
  //     currentEvent,
  //     dataUser,
  //     roles,
  //     currentCertRows,
  //   )

  //   setCertificateData({
  //     ...certificateData,
  //     ...(rolCert || {}),
  //     background:
  //       rolCert?.background ?? certificateData.background ?? defaultCertificateBackground,
  //   })
  //   setFinalCertRows(newCertRows)

  //   if (!dryRun) {
  //     if (rolCert) {
  //       setReadyCertToGenerate(rolCert)
  //     } else {
  //       console.warn('rolCert is undefined, create a cert in the CMS please')
  //     }

  //     modal && modal.destroy()
  //   } else {
  //     console.log('nothing was created because the dry-run mode is on')
  //   }
  // }

  // useEffect(() => {
  //   if (!cUser?.value?._id) return
  //   if (!cEvent?.value?._id) return // Take data to the evaluation certificates
  //   ;(async () => {
  //     const surveys: SurveyData[] = await SurveysApi.byEvent(cEvent?.value?._id)

  //     let passed = 0
  //     let notPassed = 0

  //     for (let i = 0; i < surveys.length; i++) {
  //       const survey: SurveyData = surveys[i] as never
  //       const stats = await useAsyncPrepareQuizStats(
  //         cEvent?.value?._id,
  //         survey._id!,
  //         cUser?.value?._id,
  //         survey,
  //       )

  //       console.debug('stats', stats)
  //       if (stats.minimum > 0) {
  //         if (stats.right >= stats.minimum) {
  //           passed = passed + 1
  //         } else {
  //           notPassed = notPassed + 1
  //         }
  //       }
  //     }

  //     console.debug('1. passed', passed)
  //     console.debug('1. surveys.length', surveys.length)

  //     if (surveys.length === 0) {
  //       setThereAreEvaluations(false)
  //     } else setThereAreEvaluations(true)

  //     if (passed === surveys.length) {
  //       setWereEvaluationsPassed(true)
  //     } else {
  //       setWereEvaluationsPassed(false)
  //     }
  //   })()

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
      // If no problem, no problem
      if (cert.requirement_config === undefined || !cert.requirement_config.enable) {
        console.log('cert', cert.name, 'has no requirement config')
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
      const reFilteredActivities = cEventProgress.activities.filter(
        (activity) => !activityTypeToIgnore.includes(activity.type?.name as any),
      )
      const reCalcedProgress = cEventProgress.calcProgress(
        reFilteredActivities.length,
        cEventProgress.getAttendeesForActivities(
          reFilteredActivities.map((activity) => activity._id!),
        ).length,
      )
      console.debug('recalc the progress got:', {
        activityTypeToIgnore,
        reFilteredActivities,
        reCalcedProgress,
      })
      if (reCalcedProgress > (cert.requirement_config.completion ?? 0)) {
        console.log(
          'cert',
          cert.name,
          'has completion under progress:',
          cert.requirement_config.completion,
        )
        return true
      }
      console.log(
        'cert',
        cert.name,
        'has completion over progress:',
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
    requestCertificates().then()
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

    // Put the user's data in the cert rows to print
    const newCertRows = replaceAllTagValues(
      cEvent.value,
      cEventUser.value,
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
