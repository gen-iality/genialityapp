import { useState } from 'react';
import { Upload, Spin, Image } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { uploadImagedummyRequest, readUrlImg } from './imgUtils';
import { ImageUploaderDragAndDropType } from './types/types';

const ImageUploaderDragAndDrop = ({ imageDataCallBack }: ImageUploaderDragAndDropType) => {
  const { Dragger } = Upload;
  let [image, setImage] = useState<any>(null);
  let [isUploading, setIsUploading] = useState<boolean>(false);

  const draggerprops: any = {
    listType: 'picture',
    accept: 'image/png,image/jpeg',
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: uploadImagedummyRequest,
    onChange: ({ file }: any) => {
      const { status } = file;

      switch (status) {
        case 'done':
          readUrlImg({ files: file.originFileObj, setImage });
          imageDataCallBack(file.originFileObj);
          setIsUploading(false);
          break;

        case 'error':
          setImage(null);
          break;

        case 'removed':
          setImage(null);
          setIsUploading(false);
          break;

        default:
          setIsUploading(true);
          break;
      }
    },
    /** Se agrega previewFile para mostrar el icono default de ant y no un preview de la imagen */
    previewFile(file: any) {
      return fetch('http://via.placeholder.com/500/F5F5F7/CCCCCC?text=.', {
        method: 'GET',
        body: file,
      })
        .then((res) => res.json())
        .catch((err) => {});
    },
  };

  return (
    <Spin tip='Cargando imagen...' spinning={isUploading}>
      <Dragger {...draggerprops}>
        {image ? (
          <Image preview={false} alt='preview' src={image} />
        ) : (
          <>
            <p className='ant-upload-drag-icon'>
              <FileImageOutlined />
            </p>
            <p className='ant-upload-text'>Haga clic o arrastre el archivo a esta área para cargarlo</p>
            <p className='ant-upload-hint'>Dimensiones sugeridas: 1080px * 1080px</p>
          </>
        )}
      </Dragger>
    </Spin>
  );
};

export default ImageUploaderDragAndDrop;
