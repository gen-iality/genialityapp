import { useEffect, useState } from 'react';
import { Upload, Spin, Image, Card } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { uploadImagedummyRequest, readUrlImg, handleImageName } from '../../Utilities/imgUtils';
import { ImageUploaderDragAndDropType } from '../../Utilities/types/types';
import { uploadImageData } from '@/Utilities/uploadImageData';
import { fireStorage } from '@/helpers/firebase';
import { deleteFireStorageData } from '@/Utilities/deleteFireStorageData';
import Compressor from 'compressorjs';

const ImageUploaderDragAndDrop = ({
  imageDataCallBack,
  imageUrl,
  width = 0,
  height = 0,
  styles = { cursor: 'auto', marginBottom: '20px', borderRadius: '20px', textAlign: 'center' },
  hoverable = true,
}: ImageUploaderDragAndDropType) => {
  const { Dragger } = Upload;
  let [image, setImage] = useState<any>(null);
  let [isUploading, setIsUploading] = useState<boolean>(false);

  const fileList = [
    {
      url: imageUrl,
      name: handleImageName(imageUrl),
    },
  ];

  useEffect(() => {
    /** Seteamos la imagen cuando ya vien una desde la base de datos, para ver la previa */
    if (imageUrl) {
      setImage(imageUrl);
    } else {
      setImage(null);
    }
  }, [imageUrl]);

  /** props para el dragger */
  let draggerprops: any = {
    listType: 'picture',
    accept: 'image/png,image/jpeg,image/jpg,image/gif',
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: uploadImagedummyRequest,
    fileList: imageUrl ? [...fileList] : undefined,
    onChange: async ({ file }: any) => {
      const { status } = file;

      switch (status) {
        case 'done':
          /** url para previa de la imagen, esta funcion nos servira para cuando se saque el guardado en base de datos de este componente */
          // readUrlImg({ files: file.originFileObj, setImage });
          /** este callback nos servira para cuando se saque el guardado en base de datos de este componente */
          // imageDataCallBack(file.originFileObj);
          new Compressor(file.originFileObj, {
            quality: 0.8,
            minWidth: width as number,
            minHeight: height as number,
            convertSize: 5000000,
            success: async (result) => {
              const imagenUrl = await uploadImageData(result);
              setImage(imagenUrl);
              imageDataCallBack(imagenUrl);
              setIsUploading(false);
            },
          });
          break;

        case 'error':
          setImage(null);
          break;

        case 'removed':
          //ELIMINAR DE FIREBASE
          await deleteFireStorageData(image);
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
    /**------------------------------------------------- */
  };

  return (
    <Spin tip='Cargando imagen...' spinning={isUploading}>
      <Card hoverable={hoverable} style={styles}>
        <Dragger {...draggerprops}>
          {image ? (
            <Image preview={false} alt='preview' src={image} />
          ) : (
            <>
              <p className='ant-upload-drag-icon'>
                <FileImageOutlined style={{ color: '#009fd9' }} />
              </p>
              <p className='ant-upload-text'>Haga clic o arrastre el archivo a esta área para cargarlo</p>
              {width && height && (
                <p className='ant-upload-hint'>
                  Dimensiones sugeridas: {width}px * {height}px
                </p>
              )}
              <p>Formatos aceptados: .png, .jpeg, .jpg, .gif</p>
            </>
          )}
        </Dragger>
      </Card>
    </Spin>
  );
};

export default ImageUploaderDragAndDrop;
