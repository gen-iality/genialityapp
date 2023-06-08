import { CertsApi, EventsApi, RolAttApi, UsersApi } from '@helpers/request'
import { Alert, Button, Divider, Spin, Typography } from 'antd'
import { FunctionComponent, useEffect, useReducer, useRef, useState } from 'react'
import { useParams } from 'react-router'

import {
  defaultCertificateBackground,
  defaultCertRows,
} from '@components/certificates/constants'

import { CertRow, Html2PdfCerts, Html2PdfCertsRef } from 'html2pdf-certs'
import 'html2pdf-certs/dist/styles.css'
import CertificateType from '@Utilities/types/CertificateType'

import { replaceAllTagValues } from '@components/certificates/utils/replaceAllTagValues'
import {
  CheckOutlined,
  DownloadOutlined,
  HomeOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

type WantedParamsType = {
  userId?: string
  eventId?: string
  activityId?: string
}

type CGState = {
  // Importate states
  event?: any
  user?: any
  activity?: any
  eventUser?: any
  certRows?: CertRow[]
  certificateData: CertificateType
  // ID states
  // eventId?: string
  // activityId?: string
  // userId?: string
  // UI states
  isLoading: boolean
  isFailure: boolean
  // Messages state
  errorMessage?: string
}

type CGAction =
  | { type: 'NO_IDS' }
  | { type: 'LOADING' }
  | { type: 'FAILURE'; text: string }
  | { type: 'LOADED' }
  | { type: 'SET_DATA'; eventUser?: any; activity?: any; user?: any; event?: any }
  | { type: 'SET_CERT_ROWS'; certRows: CertRow[] }
  | { type: 'SET_CERTIFICATE_DATA'; certificateData: CertificateType }

const reducerGC = (state: CGState, action: CGAction): CGState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, isFailure: false }
    case 'FAILURE':
      return { ...state, isLoading: false, isFailure: true, errorMessage: action.text }
    case 'LOADED':
      return { ...state, isLoading: false, isFailure: false }
    case 'NO_IDS':
      return { ...state, errorMessage: 'Error en la URL' }
    case 'SET_DATA':
      const { activity, event, eventUser, user } = action
      return { ...state, activity, event, eventUser, user }
    case 'SET_CERT_ROWS':
      return { ...state, certRows: action.certRows }
    case 'SET_CERTIFICATE_DATA':
      return { ...state, certificateData: action.certificateData }
    default:
      return state
  }
}

const initContent: string = JSON.stringify(defaultCertRows)

const CertificateGeneraterPage: FunctionComponent = () => {
  const [isGenerating, setIsGenerating] = useState(false)

  const [state, dispatch] = useReducer(reducerGC, {
    isLoading: false,
    isFailure: false,
    certificateData: {
      content: initContent,
      background: defaultCertificateBackground,
      event_id: '',
      name: '',
      event: null,
    },
  })

  const pdfQuizGeneratorRef = useRef<Html2PdfCertsRef>(null)

  const params = useParams<WantedParamsType>()

  const handleGenerate = async () => {
    if (!pdfQuizGeneratorRef.current) return
    setIsGenerating(true)
    pdfQuizGeneratorRef.current.generatePdf()
  }

  useEffect(() => {
    dispatch({ type: 'LOADING' })

    // We need these IDs
    if (!params.eventId || !params.activityId) {
      dispatch({ type: 'NO_IDS' })
      return
    }

    Promise.all([
      // Get the event
      EventsApi.getOne(params.eventId),
      // Get the user
      UsersApi.getProfile(params.userId),
      // Get the event user
      UsersApi.getEventUserByUser(params.eventId, params.userId),
      // Get the certs
      CertsApi.byEvent(params.eventId) as Promise<CertificateType[]>,
      // Get the roles
      RolAttApi.byEvent(params.eventId) as Promise<any[]>,
    ])
      .then(([event, user, eventUser, certs, roles]) => {
        console.debug('event', event)
        console.debug('user', user)
        console.debug('eventUser', eventUser)
        dispatch({ type: 'SET_DATA', event, user, eventUser })

        // TODO: implement this
        const extraOrgMemberProperties = {}

        const dataEventUser = {
          ...eventUser,
          properties: {
            ...eventUser.properties,
            ...extraOrgMemberProperties,
          },
        }

        let rolCert: CertificateType | undefined = certs.find((cert: any) => !cert.rol_id)
        // If the event user has rol_id and this matches with any attendee roles, then find the cert found
        const rolValidation = roles.find((rol: any) => rol._id === dataEventUser.rol_id)
        if (dataEventUser.rol_id && rolValidation) {
          rolCert = certs.find((cert: any) => {
            return cert.rol._id === dataEventUser.rol_id
          })
        }

        let currentCertRows: CertRow[] = defaultCertRows
        console.debug('rolCert', { rolCert })
        if (rolCert?.content) {
          console.log('parse cert content from DB-saved')
          currentCertRows = JSON.parse(rolCert?.content) as CertRow[]
        }

        // Put the user's data in the cert rows to print
        const newCertRows = replaceAllTagValues(
          event,
          dataEventUser,
          roles,
          currentCertRows,
        )
        dispatch({ type: 'SET_CERT_ROWS', certRows: newCertRows })

        dispatch({
          type: 'SET_CERTIFICATE_DATA',
          certificateData: {
            ...state.certificateData,
            ...(rolCert || {}),
            background:
              rolCert?.background ??
              state.certificateData.background ??
              defaultCertificateBackground,
          },
        })

        // Done
        dispatch({ type: 'LOADED' })
      })
      .catch((err) => {
        console.error(err)
        dispatch({ type: 'FAILURE', text: err.toString() })
      })

    // setIsLoading(false)
  }, [params.eventId, params.activityId, params.userId])

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '2rem',
          borderRadius: '15px',
          border: '1px solid #888',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography.Title>
          <Link to="/" title="Ir al inicio">
            <HomeOutlined />
          </Link>{' '}
          {state.isLoading ? (
            <>
              Cargando certificado <Spin />
            </>
          ) : (
            <>
              Certificado disponible <CheckOutlined />
            </>
          )}
        </Typography.Title>
        {state.isFailure && <Alert type="error" message={state.errorMessage} />}
        {state.certRows && (
          <>
            <Divider />
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Button
                icon={isGenerating ? <LoadingOutlined /> : <DownloadOutlined />}
                disabled={isGenerating}
                type="primary"
                danger={isGenerating}
                onClick={handleGenerate}
              >
                Descargar certificado
              </Button>
            </div>
            <Html2PdfCerts
              handler={pdfQuizGeneratorRef}
              rows={state.certRows}
              imageUrl={state.certificateData.background ?? defaultCertificateBackground}
              backgroundColor="#005882"
              enableLinks={true}
              filename="certificate-quiz.pdf"
              format={[
                state.certificateData.cert_width ?? 1280,
                state.certificateData.cert_height ?? 720,
              ]}
              sizeStyle={{
                height: state.certificateData.cert_height ?? 720,
                width: state.certificateData.cert_width ?? 1280,
              }}
              transformationScale={0.5}
              unit="px"
              orientation="landscape"
              onEndGenerate={() => {
                console.log('certificate generated')
                setIsGenerating(false)
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CertificateGeneraterPage
