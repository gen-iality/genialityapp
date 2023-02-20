import { UploadOutlined } from '@ant-design/icons'
import { DispatchMessageService } from '@context/MessageService'
import { Button, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { FormInstance, Rule } from 'antd/lib/form'
import { RcFile } from 'antd/lib/upload'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import DynamicFormItem from './DynamicFormItem'
import { IDynamicFieldProps } from './types'
import useCheckFileSize from './useCheckFileSize'
import useMandatoryRule from './useMandatoryRule'

interface IDynamicAvatarUploaderFieldProps extends IDynamicFieldProps {
  form: FormInstance
}

// const imageUrl = [{ url: value }]
const DynamicAvatarUploaderField: React.FunctionComponent<IDynamicAvatarUploaderFieldProps> = (props) => {
  const {
    form,
    fieldData,
    allInitialValues,
  } = props

  const { name } = fieldData

  const [rules, setRules] = useState<Rule[]>([])

  const intl = useIntl()
  const { basicRule } = useMandatoryRule(fieldData)

  const getFilenameFromURL = useCallback((url: any) => {
    if (typeof url !== 'string') return null
    const splittedUrl = url.split('/')
    return splittedUrl[splittedUrl.length - 1]
  }, [])

  const checkFileSize = useCheckFileSize()

  const handleBeforeUpload = useCallback((file: RcFile) => {
    return checkFileSize(file)
  }, [checkFileSize])

  const initialValue = useMemo(() => {
    const fileList: any[] = []
    const value = allInitialValues[name]
    if (value) {
      fileList.push(...[
        {
          name: typeof value == 'string' ? getFilenameFromURL(value) : null,
          url: typeof value == 'string' ? value : null,
        },
      ])
    }
    return fileList
  }, [allInitialValues, name])

  // Clone the basic rule and inject a validator method
  useEffect(() => {
    const newRule: Rule = { ...basicRule }
    newRule.transform = (value: any) => {
      console.info('wanna validate', {value})
      return value.fileList[0].name
    }
    newRule.validator = (_, value) => {
      console.log('???', value, _)
      return Promise.resolve()
    }
    setRules([newRule])
    console.log('update rules')
  }, [basicRule])

  return (
    <DynamicFormItem
      fieldData={fieldData}
      rules={rules}
      initialValue={initialValue}
    >
      <ImgCrop
        rotate
        shape="round"
      >
        <Upload
          action="https://api.evius.co/api/files/upload/"
          accept="image/png,image/jpeg"
          onChange={(file) => {
            console.log('file changed', {file})
            form.setFieldsValue({ [name]: file })
          }}
          multiple={false}
          listType="picture"
          maxCount={1}
          onRemove={(file) => {
            console.log('remove', {file})
            form.setFieldsValue({ [name]: undefined })
          }}
          beforeUpload={handleBeforeUpload}
        >
          <Button type='primary' icon={<UploadOutlined />}>
            {intl.formatMessage({
              id: 'form.button.avatar',
              defaultMessage: 'Subir imagen de perfil',
            })}
          </Button>
        </Upload>
      </ImgCrop>
    </DynamicFormItem>
  )
}

export default DynamicAvatarUploaderField
