import { useEffect, useState } from 'react'
import { Upload, Spin, Image, Card } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'
import {
  uploadImagedummyRequest,
  readUrlImg,
  handleImageName,
} from '../../Utilities/imgUtils'
import { ImageUploaderDragAndDropType } from '../../Utilities/types/types'
import { uploadImageData } from '@Utilities/uploadImageData'
import { fireStorage } from '@helpers/firebase'
import { deleteFireStorageData } from '@Utilities/deleteFireStorageData'

const ImageUploaderDragAndDrop = ({
  imageDataCallBack,
  imageUrl,
  width = 0,
  height = 0,
}: ImageUploaderDragAndDropType) => {
  const { Dragger } = Upload
  const [image, setImage] = useState<any>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const fileList = [
    {
      url: imageUrl,
      name: handleImageName(imageUrl),
    },
  ]

  useEffect(() => {
    /** Seteamos la imagen cuando ya vien una desde la base de datos, para ver la previa */
    if (imageUrl) {
      setImage(imageUrl)
    }
  }, [imageUrl])

  /** props para el dragger */
  const draggerprops: any = {
    listType: 'picture',
    accept: 'image/png,image/jpeg',
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: uploadImagedummyRequest,
    defaultFileList: imageUrl ? [...fileList] : undefined,
    onChange: async ({ file }: any) => {
      const { status } = file

      switch (status) {
        case 'done':
          /** url para previa de la imagen, esta funcion nos servira para cuando se saque el guardado en base de datos de este componente */
          // readUrlImg({ files: file.originFileObj, setImage });
          /** este callback nos servira para cuando se saque el guardado en base de datos de este componente */
          // imageDataCallBack(file.originFileObj);

          const imagenUrl = await uploadImageData(file.originFileObj)
          setImage(imagenUrl)
          imageDataCallBack && imageDataCallBack(imagenUrl)
          setIsUploading(false)
          break

        case 'error':
          setImage(null)
          break

        case 'removed':
          // Eliminar de firebase
          await deleteFireStorageData(image)
          setImage(null)
          setIsUploading(false)
          imageDataCallBack && imageDataCallBack(null)
          break

        default:
          setIsUploading(true)
          break
      }
    },
    /** props para no mostrar la mini previa de antDesing */
    isImageUrl(file: any) {
      return
    },
    iconRender(file: any) {
      return <FileImageOutlined style={{ color: '#003853' }} />
    },
    onPreview(file: any) {},
    /**------------------------------------------------- */
  }

  return (
    <Spin tip="Cargando imagen..." spinning={isUploading}>
      <Card
        hoverable
        style={{
          cursor: 'auto',
          marginBottom: '20px',
          borderRadius: '20px',
          textAlign: 'center',
        }}
      >
        <Dragger {...draggerprops}>
          {image ? (
            <Image preview={false} alt="preview" src={image} />
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <FileImageOutlined style={{ color: '#003853' }} />
              </p>
              <p className="ant-upload-text">
                Haga clic o arrastre el archivo a esta área para cargarlo
              </p>
              <p className="ant-upload-hint">
                Dimensiones sugeridas: {width}px * {height}px
              </p>
            </>
          )}
        </Dragger>
      </Card>
    </Spin>
  )
}

export default ImageUploaderDragAndDrop
