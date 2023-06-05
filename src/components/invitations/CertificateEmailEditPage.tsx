import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import EviusReactQuill from '@components/shared/eviusReactQuill'
import { EventsApi } from '@helpers/request'
import { Button, Form, Input, Typography } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'

interface ICertificateEmailEditPageProps {
  event: any
}

const CertificateEmailEditPage: FunctionComponent<ICertificateEmailEditPageProps> = (
  props,
) => {
  const { event } = props

  const [isLoading, setIsLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')

  const [form] = Form.useForm()

  const onSubmit = (values: any) => {
    setIsLoading(true)

    // Copy SOME modified fields
    event.certificate_email_settings = {
      ...values,
    }

    EventsApi.editOne(event, event._id).finally(() => setIsLoading(false))
  }

  useEffect(() => {
    form.setFieldsValue({ ...event.certificate_email_settings })
    setHtmlContent(event.certificate_email_settings?.content || '')
  }, [])

  useEffect(() => {
    form.setFieldValue('content', htmlContent)
  }, [htmlContent])

  return (
    <Form form={form} onFinish={onSubmit}>
      <Typography.Title>Edita el texto del correo de certificados</Typography.Title>
      <Form.Item
        name="action_text"
        label="Texto de acción (optional)"
        initialValue={event.certificate_email_settings?.action_text}
      >
        <Input placeholder="(Optional) texto en el botón de acción: descargar certificado por ejemplo" />
      </Form.Item>
      <Form.Item
        name="subject"
        label="Asunto del correo (opcional)"
        initialValue={event.certificate_email_settings?.subject}
      >
        <Input placeholder="(Optional) 'Correo de GEN.iality'" />
      </Form.Item>
      <Form.Item
        name="content"
        label="Contenido del correo"
        initialValue={event.certificate_email_settings?.content || ''}
        rules={[{ required: true, message: 'Necesario el contenido del correo' }]}
      >
        <EviusReactQuill
          name="html"
          data={htmlContent}
          handleChange={(value: string) => setHtmlContent(value)}
        />
      </Form.Item>
      <Button
        htmlType="submit"
        type="primary"
        disabled={isLoading}
        icon={isLoading ? <LoadingOutlined /> : <CheckCircleOutlined />}
      >
        Guardar
      </Button>
    </Form>
  )
}

export default CertificateEmailEditPage
