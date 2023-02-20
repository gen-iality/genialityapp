import { UploadOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@context/MessageService';
import { Button, Upload } from 'antd';
import { Rule } from 'antd/lib/form';
import { RcFile } from 'antd/lib/upload';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DynamicFormItem from './DynamicFormItem';
import { IDynamicFieldProps } from './types';
import useCheckFileSize from './useCheckFileSize';
import useMandatoryRule from './useMandatoryRule';

interface IDynamicFileUploaderFieldProps extends IDynamicFieldProps {
}

const DynamicFileUploaderField: React.FunctionComponent<IDynamicFileUploaderFieldProps> = (props) => {
  const {
    fieldData,
    allInitialValues,
  } = props

  const { name } = fieldData

  const [rules, setRules] = useState<Rule[]>([])

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
      return value.fileList[0].name
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
      <Upload
        accept="application/pdf,image/png, image/jpeg,image/jpg,application/msword,.docx"
        action="https://api.evius.co/api/files/upload/"
        multiple={false}
        listType="text"
        beforeUpload={handleBeforeUpload}
      >
        <Button icon={<UploadOutlined />}>Subir archivo</Button>
      </Upload>
    </DynamicFormItem>
  );
};

export default DynamicFileUploaderField;
