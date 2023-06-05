import { useEffect, useState, createElement, useMemo, useRef } from 'react'
import dayjs from 'dayjs'
import { Row, Col, Card, Spin, Alert, Button, Modal, Typography } from 'antd'
import { withRouter } from 'react-router-dom'
import withContext from '@context/withContext'
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
import { CertificateData } from '@components/certificates/types'
import { replaceAllTagValues } from '@components/certificates/utils/replaceAllTagValues'
import { FB } from '@helpers/firestore-request'

type CurrentEventAttendees = any // TODO: define this type and move to @Utilities/types/

export interface CertificateProps {
  cEvent?: any
  cEventUser?: any
  cUser?: any
}

const initContent: string = JSON.stringify(defaultCertRows)

const IconText = ({
  icon,
  text,
  onSubmit,
}: {
  icon: any
  text: string
  onSubmit: () => void
}) => (
  <Button htmlType="submit" type="primary" onClick={onSubmit}>
    {createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </Button>
)

function Certificate(props: CertificateProps) {
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
  const [certificateData, setCertificateData] = useState<CertificateData>({
    content: initContent,
    background: defaultCertificateBackground,
    event_id: '',
    name: '',
  })
  const [readyCertToGenerate, setReadyCertToGenerate] = useState<
    CertificateData | undefined
  >()
  const [finalCertRows, setFinalCertRows] = useState<CertRow[]>(JSON.parse(initContent))
  const [lastRolCert, setLastRolCert] = useState<CertificateData | undefined>()

  const pdfQuizGeneratorRef = useRef<Html2PdfCertsRef>(null)
  const pdfGeneralGeneratorRef = useRef<Html2PdfCertsRef>(null)

  const getOrgMemberProperties = async (dataUser: any) => {
    const { data: orgMembers } = await OrganizationApi.getUsers(
      props.cEvent.value.organiser._id,
    )
    const orgMember = orgMembers.find(
      (orgMember: any) => orgMember.account_id === dataUser.account_id,
    )
    return orgMember?.properties || {}
  }

  /**
   * Generate the certificate.
   *
   * If you pass false in dryRun, a real certificate will be generated.
   *
   * @param dataUser The user data. Generally it is taken from the eventUser.
   * @param dryRun true if you only want to show the certificate preview.
   */
  const generateCert = async (dataUser: any, dryRun: boolean = false) => {
    const extraOrgMemberProperties = await getOrgMemberProperties(dataUser)

    dataUser = {
      ...dataUser,
      properties: {
        ...dataUser.properties,
        ...extraOrgMemberProperties,
      },
    }

    let modal: null | ReturnType<typeof Modal.success> = null
    if (!dryRun) {
      modal = Modal.success({
        title: 'Generando certificado',
        content: <Spin>Espera</Spin>,
      })
    }

    const certs = await CertsApi.byEvent(props.cEvent.value._id)
    const roles = await RolAttApi.byEvent(props.cEvent.value._id)
    const currentEvent = { ...props.cEvent.value }
    currentEvent.datetime_from = dayjs(currentEvent.datetime_from).format('DD/MM/YYYY')
    currentEvent.datetime_to = dayjs(currentEvent.datetime_to).format('DD/MM/YYYY')

    //Por defecto se trae el certificado sin rol
    let rolCert: CertificateData | undefined = certs.find((cert: any) => !cert.rol_id)
    //Si el asistente tiene rol_id y este corresponde con uno de los roles attendees, encuentra el certificado ligado
    const rolValidation = roles.find((rol: any) => rol._id === dataUser.rol_id)
    if (dataUser.rol_id && rolValidation) {
      rolCert = certs.find((cert: any) => {
        return cert.rol._id === dataUser.rol_id
      })
    }
    setLastRolCert(rolCert)

    let currentCertRows: CertRow[] = defaultCertRows
    console.debug('rolCert', { rolCert })
    if (rolCert?.content) {
      console.log('parse cert content from DB-saved')
      currentCertRows = JSON.parse(rolCert?.content) as CertRow[]
    }

    // Put the user's data in the cert rows to print
    const newCertRows = replaceAllTagValues(
      currentEvent,
      dataUser,
      roles,
      currentCertRows,
    )

    setCertificateData({
      ...certificateData,
      ...(rolCert || {}),
      background:
        rolCert?.background ?? certificateData.background ?? defaultCertificateBackground,
    })
    setFinalCertRows(newCertRows)

    if (!dryRun) {
      if (rolCert) {
        setReadyCertToGenerate(rolCert)
      } else {
        console.warn('rolCert is undefined, create a cert in the CMS please')
      }

      modal && modal.destroy()
    } else {
      console.log('nothing was created because the dry-run mode is on')
    }
  }

  // Watch and generate the PDF for quiz
  useEffect(() => {
    if (!pdfQuizGeneratorRef.current) {
      console.debug('ref to Html2PdfCerts is undefined')
      return
    }
    if (readyCertToGenerate !== undefined) {
      console.log('start generating the certificate')
      pdfQuizGeneratorRef.current.generatePdf()
      setReadyCertToGenerate(undefined)
    }
  }, [readyCertToGenerate, pdfQuizGeneratorRef.current])

  // Watch and generate the PDF for general
  useEffect(() => {
    if (!pdfGeneralGeneratorRef.current) {
      console.debug('ref to Html2PdfCerts is undefined')
      return
    }
    if (readyCertToGenerate !== undefined) {
      console.log('start generating the certificate')
      pdfGeneralGeneratorRef.current.generatePdf()
      setReadyCertToGenerate(undefined)
    }
  }, [readyCertToGenerate, pdfGeneralGeneratorRef.current])

  useEffect(() => {
    if (!props.cUser?.value?._id) return
    if (!props.cEvent?.value?._id) return // Take data to the evaluation certificates
    ;(async () => {
      const surveys: SurveyData[] = await SurveysApi.byEvent(props.cEvent?.value?._id)

      let passed = 0
      let notPassed = 0

      for (let i = 0; i < surveys.length; i++) {
        const survey: SurveyData = surveys[i] as never
        const stats = await useAsyncPrepareQuizStats(
          props.cEvent?.value?._id,
          survey._id!,
          props.cUser?.value?._id,
          survey,
        )

        console.debug('stats', stats)
        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1
          } else {
            notPassed = notPassed + 1
          }
        }
      }

      console.debug('1. passed', passed)
      console.debug('1. surveys.length', surveys.length)

      if (surveys.length === 0) {
        setThereAreEvaluations(false)
      } else setThereAreEvaluations(true)

      if (passed === surveys.length) {
        setWereEvaluationsPassed(true)
      } else {
        setWereEvaluationsPassed(false)
      }
    })()

    // Take the date for the finished course certificate
    ;(async () => {
      if (!props.cEvent?.value) return
      if (!props.cEventUser?.value) return
      console.log('start finding course stats')

      setActivitiesAttendee([])

      const activityFilter = (a: any) =>
        ![activityContentValues.quizing, activityContentValues.survey].includes(
          a.type?.name,
        )

      const { data }: { data: AgendaType[] } = await AgendaApi.byEvent(
        props.cEvent.value._id,
      )
      const filteredData = data
        .filter(activityFilter)
        .filter((activity) => !activity.is_info_only)

      setAllActivities(filteredData)
      const allAttendees = await FB.Attendees.getEventUserActivities(
        filteredData.map((activity) => activity._id as string),
        props.cEventUser?.value?._id,
      )
      const filteredAttendees = allAttendees.filter((attendee) => attendee !== undefined)
      // Filter existent activities and set the state
      setActivitiesAttendee(filteredAttendees)
    })()
  }, [props.cUser?.value, props.cEvent?.value, props.cEventUser?.value])

  // mimimi PRE-load the cert data to show the background image because client
  useEffect(() => {
    if (!props.cEvent.value?._id) return
    if (!props.cEventUser.value?._id) return
    generateCert(props.cEventUser.value, true)
  }, [props.cEvent.value, props.cEventUser.value])

  const progressPercentValue: number = useMemo(
    () =>
      Math.round(((activitiesAttendee.length || 0) / (allActivities.length || 0)) * 100),
    [activitiesAttendee, allActivities],
  )

  return (
    <>
      <Row gutter={[8, 8]} wrap justify="center">
        <Col span={24}>
          {thereAreEvaluations === undefined ? (
            <Card style={{ textAlign: 'center' }}>
              <Spin tip="Cargando..." />
            </Card>
          ) : (
            <Card>
              {thereAreEvaluations && (
                <>
                  {!wereEvaluationsPassed && (
                    <>
                      <Alert
                        message="Certificado de evaluaciones NO disponible"
                        type="error"
                      />
                      <br />
                    </>
                  )}
                  {wereEvaluationsPassed && (
                    <>
                      <Alert
                        message="Certificado de evaluaciones disponible"
                        type="success"
                      />
                      <br />
                      <IconText
                        text="Descargar certificado de evaluaciones"
                        icon={isGenerating ? LoadingOutlined : DownloadOutlined}
                        onSubmit={() => generateCert(props.cEventUser.value)}
                      />
                      <br />
                      <Typography.Text strong>
                        Éste es una plantilla y no es el certificado final. Clic en
                        descargar para obtener el certificado real.
                      </Typography.Text>
                      {lastRolCert ? (
                        <Html2PdfCerts
                          handler={pdfQuizGeneratorRef}
                          rows={finalCertRows}
                          imageUrl={
                            certificateData.background ?? defaultCertificateBackground
                          }
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
                      ) : (
                        <p>Falla crear el certificado por el administrador</p>
                      )}
                    </>
                  )}
                </>
              )}

              {progressPercentValue === 100 && (
                <>
                  {props.cEvent.value.hide_certificate_link ? (
                    <Alert
                      message="Certificado bloqueado por administrador"
                      type="warning"
                    />
                  ) : (
                    <>
                      <Alert message="Certificado de curso completo" type="success" />
                      <br />
                      <IconText
                        text="Descargar certificado del curso"
                        icon={isGenerating ? LoadingOutlined : DownloadOutlined}
                        onSubmit={() => generateCert(props.cEventUser.value)}
                      />
                      <br />
                      <Typography.Text strong>
                        Éste es una plantilla y no es el certificado final. Clic en
                        descargar para obtener el certificado real.
                      </Typography.Text>
                      {lastRolCert ? (
                        <Html2PdfCerts
                          handler={pdfGeneralGeneratorRef}
                          rows={finalCertRows}
                          imageUrl={
                            certificateData.background ?? defaultCertificateBackground
                          }
                          backgroundColor="#005882"
                          enableLinks={true}
                          filename="certificate-general.pdf"
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
                      ) : (
                        <p>Falla crear el certificado por el administrador</p>
                      )}
                    </>
                  )}
                </>
              )}
            </Card>
          )}
        </Col>
      </Row>
    </>
  )
}

const Component = withContext((props: any) => <Certificate {...props} />)
export default withRouter((props: any) => <Component {...props} />)
