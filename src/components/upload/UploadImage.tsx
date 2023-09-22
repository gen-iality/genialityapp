import { useEffect, useState } from 'react';
import { PictureOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Upload } from 'antd';
import { UploadProps } from 'antd/es/upload';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { useIntl } from 'react-intl';
import { getBase64 } from './utils/upload-utils';
import ImgCrop from 'antd-img-crop';
import { UploadFile } from 'antd/lib/upload/interface';

interface IMyUploadComponentProps extends FormItemLabelProps {
  onSetFile: (item: UploadFile | undefined) => void;
  maxFiles?: number;
  fileSelected?: UploadFile;
  urlImageSelected?: string;
}

export const UploadImageWithEdition = ({
  onSetFile,
  maxFiles,
  urlImageSelected,
  fileSelected,
}: IMyUploadComponentProps) => {
  const [currentFile, setCurrentFile] = useState<UploadFile>();
  const [imageAvatar, setImageAvatar] = useState<string | ArrayBuffer | null>(null);
  const [urlSelected, setUrlSelected] = useState('');
  const intl = useIntl();

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    if (file.status === 'removed') {
      setImageAvatar(null);
      onSetFile(undefined);
      setCurrentFile(undefined);
    } else {
      getBase64(file.originFileObj, (imageUrl) => {
        setImageAvatar(imageUrl);
      });
      setUrlSelected('');
      onSetFile(newFileList[0]);
      setCurrentFile(newFileList[0]);
    }
  };

  useEffect(() => {
    if (fileSelected && urlImageSelected)
      console.warn('Solo debe mandar o un urlImageSelected o un fileSelected, dependiendo su caso');
  }, [urlImageSelected, fileSelected]);

  useEffect(() => {
    if (urlImageSelected) setUrlSelected(urlImageSelected);
  }, [urlImageSelected]);

  useEffect(() => {
    if (fileSelected) {
      setCurrentFile(fileSelected);
      if (onSetFile) onSetFile(fileSelected);
      getBase64(fileSelected.originFileObj, (imageUrl) => {
        setImageAvatar(imageUrl);
      });
    }
  }, [fileSelected]);

  return (
    <ImgCrop rotate shape='round'>
      <Upload
        fileList={currentFile ? [currentFile] : []}
        accept='image/*'
        onChange={handleChange}
        multiple={false}
        listType='picture'
        maxCount={maxFiles ? maxFiles : 1}
        customRequest={({ file, onSuccess }: any) => {
          onSuccess('done');
        }}>
        <Space direction='vertical'>
          <Button
            type='primary'
            shape='circle'
            style={{
              height: currentFile ? 'auto' : '120px',
              width: currentFile ? 'auto' : '120px',
              padding: '0px',
              border: '0px',
            }}>
            {!currentFile && !urlSelected && <PictureOutlined style={{ fontSize: '50px' }} />}
            {(currentFile || urlSelected.length > 0) && (
              <Avatar src={urlSelected.length > 0 ? urlSelected : imageAvatar} size={95} />
            )}
          </Button>
          <>
            {intl.formatMessage({
              id: 'modal.label.photo',
              defaultMessage: 'Subir foto',
            })}
          </>
        </Space>
      </Upload>
    </ImgCrop>
  );
};
