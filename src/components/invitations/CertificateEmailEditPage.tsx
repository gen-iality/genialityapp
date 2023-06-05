import EviusReactQuill from '@components/shared/eviusReactQuill'
import { EventsApi } from '@helpers/request'
import { Button, Form, Input, Typography } from 'antd'
import { FunctionComponent, useState } from 'react'

interface ICertificateEmailEditPageProps {
  event: any
}

const CertificateEmailEditPage: FunctionComponent<ICertificateEmailEditPageProps> = (
  props,
) => {
  const { event } = props

  const [isLoading, setIsLoading] = useState(false)

  const [form] = Form.useForm()

  const onSubmit = (values: any) => {
    setIsLoading(true)

    // Copy SOME modified fields
    event.certificate_email_text = {
      ...values,
    }

    EventsApi.editOne(event, event._id).finally(() => setIsLoading(false))
  }

  return (
    <Form form={form} onFinish={onSubmit}>
      <Typography.Title>Edita el texto del correo de certificados</Typography.Title>
      <Form.Item
        name="action_text"
        label="Texto de acción (optional)"
        initialValue={event.certificate_email_text?.action_text}
      >
        <Input placeholder="(Optional) texto en el botón de acción: descargar certificado por ejemplo" />
      </Form.Item>
      <Form.Item
        name="subject"
        label="Asunto del correo (opcional)"
        initialValue={event.certificate_email_text?.subject}
      >
        <Input placeholder="(Optional) 'Correo de GEN.iality'" />
      </Form.Item>
      <Form.Item
        name="content"
        label="Contenido del correo"
        initialValue={event.certificate_email_text?.content || ''}
        rules={[{ required: true, message: 'Necesario el contenido del correo' }]}
      >
        <EviusReactQuill
          name="html"
          data={form.getFieldValue('content') || ''}
          handleChange={(value: string) => form.setFieldValue('content', value)}
        />
      </Form.Item>
      <Button htmlType="submit" type="primary">
        Guardar
      </Button>
    </Form>
  )
}

export default CertificateEmailEditPage
