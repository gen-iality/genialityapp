import { ReactNode, useState } from 'react'
import { Input, Form, Result, Typography, Divider } from 'antd'
import rules from '../utils/formValidatorRules'
import urlProcessorSet from '../utils/urlProcessorSet'
import VimeoUploader from './VimeoUploader'

const { Paragraph } = Typography

export interface ActivityExternalUrlFieldProps {
  type: string
  subtitle?: string
  iconSrc?: string
  placeholder?: string
  addonBefore: ReactNode
  onInput: (input: string) => void
}

function ActivityExternalUrlField(props: ActivityExternalUrlFieldProps) {
  const { type, subtitle, iconSrc, placeholder, addonBefore, onInput } = props
  const [initialURL, setInitialURL] = useState('')

  return (
    <Result
      style={{ margin: '0px 100px 0px 100px' }}
      icon={<img width={150} src={iconSrc} />}
      subTitle={<Paragraph>{subtitle}</Paragraph>}
      title={
        <Form>
          <Form.Item
            name="url"
            rules={
              (rules[type as keyof typeof rules] as unknown as undefined) || [
                { required: true },
              ]
            }
          >
            <Input
              type={type === 'vimeo' ? 'number' : 'text'}
              addonBefore={addonBefore}
              placeholder={placeholder}
              value={initialURL}
              size="large"
              onChange={(e) => {
                // This is for send the ID only if the URL is from YouTube or Vimeo
                const url = urlProcessorSet[type](e)
                onInput(url)
                setInitialURL(url)
              }}
            />
            <Divider />
            <Typography.Paragraph>También puedes subir el archivo</Typography.Paragraph>
            <VimeoUploader
              onUploaded={(url) => {
                setInitialURL(url)
                onInput(url)
              }}
            />
          </Form.Item>
        </Form>
      }
    />
  )
}

export default ActivityExternalUrlField
