import { useEffect, useState } from 'react';
import { Upload, Spin, Image } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { uploadImagedummyRequest, readUrlImg } from '../../Utilities/imgUtils';
import { ImageUploaderDragAndDropType } from '../../Utilities/types/types';

const ImageUploaderDragAndDrop = ({ imageDataCallBack, imageUrl }: ImageUploaderDragAndDropType) => {
  const { Dragger } = Upload;
  let [image, setImage] = useState<any>(null);
  let [isUploading, setIsUploading] = useState<boolean>(false);

  const imageName = () => {
    if (imageUrl && typeof imageUrl === 'string') {
      var imageIndex = imageUrl.indexOf('/events');
      var name = imageUrl.substring(imageIndex + 8, imageUrl.length);
      return name;
    }
  };
  const fileList = [
    {
      url: imageUrl,
      name: imageName(),
    },
  ];

  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
    }
  }, []);

  const draggerprops: any = {
    listType: 'picture',
    accept: 'image/png,image/jpeg',
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: uploadImagedummyRequest,
    defaultFileList: imageUrl && [...fileList],
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
          imageDataCallBack(null);
          break;

        default:
          setIsUploading(true);
          break;
      }
    },
    /** props para no mostrar la mini previa de antDesing */
    isImageUrl(file: any) {
      return;
    },
    iconRender(file: any) {
      return <FileImageOutlined style={{ color: '#009fd9' }} />;
    },
    onPreview(file: any) {},
  };

  return (
    <Spin tip='Cargando imagen...' spinning={isUploading}>
      <Dragger {...draggerprops}>
        {image ? (
          <Image preview={false} alt='preview' src={image} />
        ) : (
          <>
            <p className='ant-upload-drag-icon'>
              <FileImageOutlined style={{ color: '#009fd9' }} />
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
