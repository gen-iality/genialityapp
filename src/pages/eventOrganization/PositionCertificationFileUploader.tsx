import * as React from 'react';
import {
  Upload,
  Input,
  Tabs,
  Button,
  Form,
} from 'antd';
import type { UploadProps } from 'antd';
import { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { fireStorage } from '@helpers/firebase';
import dayjs from 'dayjs';

interface IPositionCertificationFileUploaderProps {
  value?: string,
  onChange?: (value?: string) => void,
  onFirebasePathChange?: (value?: string) => void,
  path: string,
}

const PositionCertificationFileUploader: React.FunctionComponent<IPositionCertificationFileUploaderProps> = (props) => {
  const {
    value,
    path: targetPath,
    onChange = () => {},
    onFirebasePathChange = () => {},
  } = props

  const [isUploading, setIsUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadProps['fileList']>([]);
  const [firebasePath, setFirebasePath] = useState('');

  /**
   * This component can be conver to a generic component to upload file.
   * 
   * If you wanna convert it, then take in mind:
   * - Keep the props value and onChange
   * - Add props to custom the tab texts
   */

  const onUploadingChange: UploadProps['onChange'] = (e) => {
    console.log('uploading status:', e.file.status)
    setFileList(e.fileList)
    switch (e.file.status) {
      case 'removed':
        onChange(undefined)
        setIsUploading(false)
        break
      case 'done':
      case 'success':
        setIsUploading(false)
        break
      case 'uploading':
        setIsUploading(true)
        break
    }
  }

  const onCustomRequest: UploadProps['customRequest'] = (options) => {
    const { file, onProgress, onError, onSuccess } = options

    if (typeof file === 'string') {
      console.warn('the value file is string: ', file)
      return
    }
    
    const ref = fireStorage.ref();
    // @ts-expect-error
    const filename = dayjs().format('YYYY-DD-MM HH:mm:ss') + '-' + (file.name || 'unnamed');

    console.log('file will be uploaded as', filename);
    // Upload to FireStorage
    const newFirebasePath = `documents/${targetPath}/${filename}`
    setFirebasePath(newFirebasePath)
    onFirebasePathChange(newFirebasePath)

    const uploadTaskRef = ref.child(newFirebasePath).put(file);
    // Handle the uploading
    uploadTaskRef.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log('uploading...', progress, '%'); // Put this in a component I guess
        onProgress && onProgress({percent: progress})
        switch (snapshot.state) {
          case 'paused':
            console.info('uploading is paussed');
            break;
          case 'running':
            console.info('uploading is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('You tried upload things to firestore:', error);
        onError && onError(error);
      },
      () => {
        uploadTaskRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          onChange(downloadURL)
          console.log('got URL:', downloadURL);
          onSuccess && onSuccess(file);

          setFileList([
            {
              name: filename,
              uid: filename,
              url: downloadURL,
            }
          ])
        });
      }
    );
  }

  if (!targetPath || !targetPath.trim()) return <>Missing the path in uploader</>

  useEffect(() => {
    if (value) {
      console.log('value', value)
      // https://domain.com/path/general/documents%2Fhere.pdf?bla=xd
      const url = new URL(value)
      // documents%2Fhere.pdf
      const [encodedCurrentFirebasePath] = url.pathname.split('/').slice(-1)

      // documents/here.pdf
      const currentFirebasePath = decodeURIComponent(encodedCurrentFirebasePath)
      if (!currentFirebasePath.startsWith('documents/')) {
        console.warn('This url seems to be from non-Firebase URL, but it is not a problem')
      } else {
        onFirebasePathChange(currentFirebasePath)
      }
      setFirebasePath(currentFirebasePath)

      // here.pdf
      const [filename] = currentFirebasePath.split('/').slice(-1)

      setFileList([{
        uid: filename,
        name: filename,
        url: value,
      }])
    }
  }, [value])

  return (
    <Tabs>
      <Tabs.TabPane tab="Archivo" key="1">
        <Form.Item label="Subir archivo" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          <Upload
            disabled={isUploading}
            multiple={false}
            customRequest={onCustomRequest}
            name="file"
            type="drag"
            fileList={fileList}
            onChange={onUploadingChange}
            onRemove={(file) => {
              const ref = fireStorage.ref();
              if (firebasePath) {
                ref.child(firebasePath).delete().then(() => {
                  onChange(undefined)
                })
              } else {
                onChange(undefined)
                console.warn('If this URL is from Firebase, then it is a problem. But, if it is from another URL there is no problem :)')
              }
              onFirebasePathChange(undefined)
            }}
            listType="text"
            maxCount={1}
          >
            <Button block disabled={isUploading} icon={<UploadOutlined />}>
              Toca para subir archivo
            </Button>
          </Upload>
        </Form.Item>
      </Tabs.TabPane>
      <Tabs.TabPane tab="URL" key="2">
        <Form.Item label="URL del certificado" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              onFirebasePathChange(undefined)
            }}
          />
        </Form.Item>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default PositionCertificationFileUploader;
