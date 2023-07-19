import { useEffect, useState } from 'react'
import { message, Result, Spin, Upload, Form, Input } from 'antd'
import FileVideoOutlineIcon from '@2fd/ant-design-icons/lib/FileVideoOutline'
import { RcFile } from 'antd/lib/upload'

import useActivityType from '@context/activityType/hooks/useActivityType'

const urlUploadVideoVimeo = 'https://devapi.geniality.com.co/api/vimeo/upload'

const handleBeforeUpload = (file: RcFile) => {
  return file
}

export interface ActivityVideoUploadFieldProps {
  activityName: string
}

function ActivityVideoUploadField(props: ActivityVideoUploadFieldProps) {
  const { setContentSource, contentSource } = useActivityType()
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState(`Vídeo de ${props.activityName}`)

  const handleOnChange = async (info: any) => {
    const { status, response } = info.file
    switch (status) {
      case 'done':
        const uri: string | undefined = response.uri_list[0]
        if (uri) {
          const finalURL = uri
          setContentSource(finalURL)
          console.debug('file uploaded to', finalURL)
        } else {
          message.error('No se ha recuperado la URL del vídeo subido')
          setIsLoading(false)
        }
        break
      case 'error':
        if (response?.message == 'ERROR: Invalid format') {
          message.error('Formato de video inválido')
        } else {
          message.error('Error al cargar el video')
        }
        console.error(info)
        setIsLoading(false)
        break
      case 'removed':
        // Delete the video from gcore
        // if (response?.video) await deleteVideo(response.video.id)
        // TODO: implement the deleting video in the Back-End
        setIsLoading(false)
        break
      default:
        setIsLoading(true)
        break
    }

    if (status == 'error') {
    }
  }

  useEffect(() => {
    setIsLoading(false)
    console.log('then contentSource is', contentSource)
  }, [contentSource])

  return (
    <>
      <Form.Item label="(Optional) descripción">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del vídeo"
        />
      </Form.Item>
      <Upload.Dragger
        beforeUpload={handleBeforeUpload}
        action={`${urlUploadVideoVimeo}?description=${description}`}
        maxCount={1}
        accept="video/*"
        name="file"
        onRemove={() => {}}
        onChange={handleOnChange}
      >
        <Result
          icon={<FileVideoOutlineIcon />}
          title="Haga clic o arrastre el video a esta área para cargarlo"
          subTitle="Solamente formato ogm, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v y avi."
        />
        {isLoading && <Spin />}
      </Upload.Dragger>
    </>
  )
}

export default ActivityVideoUploadField
