import { FunctionComponent, useEffect, useState, useRef } from 'react'
import { CertsApi, RolAttApi } from '@helpers/request'
import { useHistory, useLocation } from 'react-router-dom'
import { handleRequestError } from '@helpers/utils'
import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  Select,
  Button,
  Upload,
  Image as ImageAntD,
  InputNumber,
  Divider,
  Switch,
} from 'antd'
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  ExclamationOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import Header from '@antdComponents/Header'
import BackTop from '@antdComponents/BackTop'
import dayjs from 'dayjs'
import { firestore } from '@helpers/firebase'

import { StateMessage } from '@context/MessageService'
import { CertRow, Html2PdfCerts, Html2PdfCertsRef } from 'html2pdf-certs'
import 'html2pdf-certs/dist/styles.css'
import CertificateRows from './CertificateRows'
import { availableTags, defaultCertificateBackground, defaultCertRows } from './constants'
import { replaceAllTagValues } from './utils/replaceAllTagValues'
import CertificateType, {
  CertificateRequirementConfigType,
} from '@Utilities/types/CertificateType'
import { activityContentValues } from '@context/activityType/constants/ui'

const { confirm } = Modal

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const initContent: string = JSON.stringify(defaultCertRows)

const RequirementConfigField: FunctionComponent<{
  value?: CertificateRequirementConfigType
  onChange?: (value: CertificateRequirementConfigType) => void
}> = (props) => {
  const { value, onChange } = props

  const [loadedValue, setLoadedValue] = useState<CertificateRequirementConfigType>({
    completion: 0,
    enable: false,
    ignore_activity_type: [],
  })

  useEffect(() => {
    setLoadedValue({
      completion: value?.completion ?? 0,
      enable: !!value?.enable,
      ignore_activity_type: value?.ignore_activity_type ?? [],
    })
  }, [value])

  const hanndleChange = (updates: CertificateRequirementConfigType) => {
    if (typeof onChange !== 'function') return
    onChange(updates)
  }

  return (
    <>
      <Form.Item {...formLayout} label="Porcentaje del curso requierido (optional)">
        <InputNumber
          value={value?.completion}
          formatter={(value) => `${value}%`}
          parser={(value) => {
            if (value === undefined) return 0
            return parseInt(value.replace('%', ''))
          }}
          onChange={(value) => {
            const newValue: CertificateRequirementConfigType = {
              ...loadedValue,
              completion: value ?? 0,
              enable: true,
            }
            setLoadedValue(newValue)
            hanndleChange(newValue)
          }}
        />
      </Form.Item>
      <Form.Item {...formLayout} label="Tipo de contenido ignorado">
        <Select
          mode="multiple"
          value={value?.ignore_activity_type}
          options={Object.values(activityContentValues).map((v) => ({
            label: v,
            value: v,
          }))}
          onChange={(value) => {
            const newValue: CertificateRequirementConfigType = {
              ...loadedValue,
              ignore_activity_type: value,
              enable: true,
            }
            setLoadedValue(newValue)
            hanndleChange(newValue)
          }}
        />
      </Form.Item>
    </>
  )
}

interface ICertificateEditorPageProps {
  event: any
  parentUrl: string
}

const CertificateEditorPage: FunctionComponent<ICertificateEditorPageProps> = (props) => {
  const location = useLocation<{ edit?: string }>()
  const locationState = location?.state || {} //si viene new o edit en el state, si es edit es un id
  const history = useHistory()
  const [certificateData, setCertificateData] = useState<CertificateType>({
    content: initContent,
    background: defaultCertificateBackground,
    event_id: '',
    name: '',
    event: null,
  })
  const [roles, setRoles] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const [noFinalCertRows, setNoFinalCertRows] = useState<CertRow[]>(
    JSON.parse(initContent),
  )
  const [backUpNoFinalCertRows] = useState<CertRow[]>(JSON.parse(initContent))
  const [readyCertToGenerate, setReadyCertToGenerate] = useState<CertRow[] | undefined>()

  const [isEnabledRequirement, setIsEnabledRequirement] = useState(false)

  const [form] = Form.useForm<CertificateType>()

  const pdfGeneratorRef = useRef<Html2PdfCertsRef>(null)

  const requestCertificateDataFromID = async (id: string) => {
    const data = await CertsApi.getOne(id)
    console.log('request cert', { data })
    if (!data.content) {
      if (data.content.trim() === '[]')
        setCertificateData({ ...data, content: initContent })
      if (Array.isArray(data.content) && data.content.length === 0)
        setCertificateData({ ...data, content: initContent })
    }

    setCertificateData({ ...data })
    data.content &&
      setNoFinalCertRows(
        Array.isArray(data.content) ? data.content : JSON.parse(data.content),
      )
    form.setFieldsValue({ ...data })
    form.setFieldsValue({
      content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
    })
  }

  const onSubmit = async (values: CertificateType) => {
    console.log('submit', { values })
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se guarda la información...',
    )

    setCertificateData({
      ...certificateData,
      ...values,
    })

    const payload = {
      name: values.name,
      // rol_id: values.role, // TODO: check if this is the rol._id
      content:
        typeof values.content === 'string'
          ? values.content
          : JSON.stringify(values.content),
      event_id: props.event._id,
      background: certificateData.background,
      rol_id: values.rol_id,
      cert_width: values.cert_width,
      cert_height: values.cert_height,
      requirement_config: values.requirement_config,
    }

    try {
      if (locationState.edit) {
        await CertsApi.editOne(payload, locationState.edit)
      } else {
        await CertsApi.create(payload)
      }

      StateMessage.destroy('loading')

      StateMessage.show(null, 'success', 'Información guardada correctamente!')

      history.push(`${props.parentUrl}`)
    } catch (e) {
      StateMessage.destroy('loading')

      StateMessage.show(null, 'error', handleRequestError(e).message)
    }
  }

  const onRemoveId = () => {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se borra la información...',
    )
    if (locationState.edit) {
      confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk: async () => {
          try {
            await CertsApi.deleteOne(locationState.edit)
            StateMessage.destroy('loading')
            StateMessage.show(null, 'success', 'Se eliminó la información correctamente!')
            history.push(`${props.parentUrl}`)
          } catch (e) {
            StateMessage.destroy('loading')
            StateMessage.show(null, 'error', handleRequestError(e).message)
          }
        },
      })
    }
  }

  const requestRoles = async () => {
    const data = await RolAttApi.byEvent(props.event._id)
    setRoles(data)
  }

  const handleImage = (file: any) => {
    if (file) {
      // Create URL from image to show it
      const imageURL = window.URL.createObjectURL(file)
      console.debug('imageURL', { imageURL })
      setCertificateData({ ...certificateData, background: imageURL })
      // An image is created to convert it to base64 and get its type and format

      const reader = new FileReader()
      reader.readAsDataURL(file) // originFileObj
      reader.onload = () => {
        const imageData = {
          data: reader.result,
          full: file.type,
          type: file.type.split('/')[1],
        }

        if (reader.result) {
          setCertificateData({
            ...certificateData,
            background: reader.result.toString(),
            // imageData: imageData,
            // imageFile: imageData,
            // image: imageData,
          })
        }
      }
    } else {
      StateMessage.show(null, 'error', 'Solo se permiten imágenes. Intentalo de nuevo')
    }
  }

  // https://stackoverflow.com/a/20285053
  const toDataURL_New = (url: string): Promise<string> => {
    const p = new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        const reader = new FileReader()
        reader.onloadend = function () {
          resolve(reader.result as unknown as string)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.onerror = function (err) {
        reject(err)
      }
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.send()
    })
    return p
  }

  const toDataURL_Legacy = (src: string, outputFormat?: string): Promise<string> => {
    const p = new Promise<string>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        const canvas = document.createElement('CANVAS') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject('Cannot get the canvas 2d context')
          return
        }

        // @ts-expect-error
        canvas.height = this.naturalHeight
        // @ts-expect-error
        canvas.width = this.naturalWidth
        // @ts-expect-error
        ctx.drawImage(this, 0, 0)
        const dataURL = canvas.toDataURL(outputFormat)
        resolve(dataURL)
      }
      img.src = src
      if (img.complete || img.complete === undefined) {
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        img.src = src
      }
    })
    return p
  }

  const generatePDF = async () => {
    props.event.datetime_from = dayjs(props.event.datetime_from).format('DD-MM-YYYY')
    props.event.datetime_to = dayjs(props.event.datetime_to).format('DD-MM-YYYY')

    setIsGenerating(true)

    const userRef = firestore.collection(`${props.event._id}_event_attendees`)

    let oneUser: any = null
    try {
      oneUser = await new Promise((resolve, reject) => {
        userRef
          .orderBy('updated_at', 'desc')
          .limit(1)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) reject()
            else resolve(querySnapshot.docs[0].data())
          })
      })
    } catch (err) {
      console.error('Cannot generate the certificate', err)
      setIsGenerating(false)
      return
    }

    const newNoFinalCertRows = replaceAllTagValues(
      props.event,
      oneUser,
      roles,
      noFinalCertRows,
    )

    // THIS line tries to avoid CORS, but if it can't, then... everything is screwed

    // Conver the image url to image base64
    let imageAsUri = certificateData.background
    if (imageAsUri.toString().toLowerCase().startsWith('http')) {
      try {
        console.log('converting image url to image base64')
        imageAsUri = await toDataURL_New(certificateData.background)
        console.log('imagen url:', { imageAsUri })
      } catch (err) {
        console.error('Cannot request because CORS', err)
        setIsGenerating(false)
      }
    }

    if (imageAsUri.toString().toLowerCase().startsWith('http')) {
      try {
        console.log('try to converting image url to image base64 using legacy mode')
        imageAsUri = await toDataURL_Legacy(certificateData.background)
        console.log('imagen url (legacy mode):', { imageAsUri })
      } catch (err2) {
        console.error('Cannot request because CORS (in legacy mode)', err2)
        setIsGenerating(false)
      }
    }
    console.debug({ imageAsUri })

    setCertificateData({
      ...certificateData,
      background: imageAsUri,
    })
    setNoFinalCertRows(newNoFinalCertRows)
    setReadyCertToGenerate(newNoFinalCertRows)

    setIsGenerating(false)
  }

  useEffect(() => {
    // If the component is rendered to edit, then we have to get the data
    if (locationState.edit) {
      requestCertificateDataFromID(locationState.edit)
    }

    // Get all roles
    requestRoles()
  }, [locationState.edit])

  useEffect(() => {
    setIsEnabledRequirement(
      certificateData.requirement_config === undefined
        ? false
        : certificateData.requirement_config.enable,
    )
  }, [certificateData])

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

  return (
    <Form {...formLayout} form={form} onFinish={onSubmit}>
      <Header
        title="Certificado"
        description={
          <>
            <ExclamationOutlined
              style={{ color: 'orange' }}
              className="animate__animated animate__pulse animate__infinite"
            />
            {
              'Para tener una vista más exacta del certificado por favor presione el botón de generar'
            }
          </>
        }
        back
        save
        form
        remove={onRemoveId}
        edit={Boolean(locationState.edit)}
        extra={
          <Form.Item>
            <Row wrap gutter={[16, 8]}>
              <Col>
                <Upload
                  type="select"
                  accept="image/*"
                  showUploadList={false}
                  // onChange={(e) => handleImage(e)}
                  beforeUpload={(file) => {
                    console.log('Dont upload', { file })
                    handleImage(file)
                    return false
                  }}
                >
                  <Button type="primary" icon={<UploadOutlined />}>
                    Imagen de Fondo
                  </Button>
                </Upload>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={isGenerating ? <LoadingOutlined /> : undefined}
                  onClick={() => generatePDF()}
                >
                  Generar
                </Button>
              </Col>
            </Row>
          </Form.Item>
        }
      />

      <Row wrap gutter={[8, 8]}>
        <Col md={12} sm={24}>
          <Form.Item
            name="name"
            label="Nombre del certificado"
            initialValue={certificateData.name}
            rules={[{ required: true, message: 'Necesario' }]}
          >
            <Input placeholder="Nombre del certificado" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item name="rol_id" label="Rol">
            <Select
              placeholder="Seleccione un rol"
              options={roles.map((role) => ({
                label: role.name,
                value: role._id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col>
          <Form.Item name="cert_width" label="Dimensione ancho (opcional)">
            <InputNumber placeholder="Ancho" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="cert_height" label="Dimensione alto (opcional)">
            <InputNumber placeholder="Altura" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col>
          <Form.Item label="Habilitar requerimientos">
            <Switch
              checked={isEnabledRequirement}
              checkedChildren="Con requerimientos"
              unCheckedChildren="Sin requerimientos"
              onChange={(checked) => {
                setIsEnabledRequirement(checked)
                const lastFormValues: CertificateType['requirement_config'] =
                  form.getFieldValue('requirement_config')
                form.setFieldsValue({
                  requirement_config: {
                    completion: lastFormValues?.completion ?? 100,
                    ignore_activity_type: lastFormValues?.ignore_activity_type ?? [],
                    enable: checked,
                  },
                })
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col>
          {isEnabledRequirement && (
            <Form.Item label="Requerimientos" name="requirement_config">
              <RequirementConfigField />
            </Form.Item>
          )}
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col md={16} sm={24}>
          <Form.Item label="Etiquetas disponibles">
            <Row wrap gutter={[18, 8]}>
              {availableTags.map((tag, index) => (
                <Col key={index}>
                  <code>{tag.tag}</code>
                  <p>{tag.label}</p>
                </Col>
              ))}
            </Row>
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item
            label="Imagen de fondo"
            extra={
              <Button
                danger
                onClick={() =>
                  setCertificateData({
                    ...certificateData,
                    background: defaultCertificateBackground,
                  })
                }
                icon={<CloseCircleOutlined />}
              >
                Cambiar a Imagen original
              </Button>
            }
          >
            <ImageAntD src={certificateData.background} alt="Imagen certificado" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item name="content" label="Filas" initialValue={noFinalCertRows}>
            <CertificateRows onChange={setNoFinalCertRows} />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <Html2PdfCerts
        handler={pdfGeneratorRef}
        rows={noFinalCertRows}
        imageUrl={certificateData.background ?? defaultCertificateBackground}
        backgroundColor="#005882"
        enableLinks={true}
        filename="certificate-test.pdf"
        format={[certificateData.cert_width ?? 1280, certificateData.cert_height ?? 720]}
        sizeStyle={{
          height: certificateData.cert_height ?? 720,
          width: certificateData.cert_width ?? 1280,
        }}
        transformationScale={0.5}
        unit="px"
        orientation="landscape"
        onEndGenerate={() => {
          setNoFinalCertRows(backUpNoFinalCertRows)
          setIsGenerating(false)
        }}
      />

      <BackTop />
    </Form>
  )
}

export default CertificateEditorPage
