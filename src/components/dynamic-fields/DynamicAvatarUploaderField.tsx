import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { FormInstance, Rule } from 'antd/lib/form'
import { RcFile } from 'antd/lib/upload'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import DynamicFormItem from './DynamicFormItem'
import { IDynamicFieldProps } from './types'
import useCheckFileSize from './hooks/useCheckFileSize'
import useMandatoryRule from './hooks/useMandatoryRule'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'

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

  return (
    <DynamicFormItem
      fieldData={fieldData}
      rules={[basicRule]}
      initialValue={initialValue}
    >
      <ImgCrop
        rotate
        shape="round"
      >
        <Upload
          action="https://api.evius.co/api/files/upload/"
          accept="image/png,image/jpeg"
          onChange={(info: UploadChangeParam<UploadFile<unknown>>) => {
            const [file] = info.fileList
            if (file && file.status === 'done') {
              console.debug('uploaded at', file.response)
              if (form) {
                console.log('form update', fieldData.name, 'to', file.response)
                form.setFieldsValue({
                  [fieldData.name]: file.response,
                })
              }
            }
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
          <Button type="primary" icon={<UploadOutlined />}>
            <FormattedMessage
              id="form.button.avatar"
              defaultMessage="Subir imagen de perfil"
            />
          </Button>
        </Upload>
      </ImgCrop>
    </DynamicFormItem>
  )
}

export default DynamicAvatarUploaderField
