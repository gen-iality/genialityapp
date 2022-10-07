import { message, Result, Spin, Upload } from 'antd';
import React, { useState } from 'react';
import FileVideoOutlineIcon from '@2fd/ant-design-icons/lib/FileVideoOutline';
import { RcFile } from 'antd/lib/upload';
import { useTypeActivity } from '@context/typeactivity/hooks/useTypeActivity';
import { deleteVideo } from '@adaptors/gcoreStreamingApi';

const InputUploadVideo = (props: any) => {
  const { selectOption, typeOptions } = useTypeActivity();
  const [loading, setLoading] = useState(false);
  const beforeUpload = (file: any) => {
    return file;
  };
  const urlUploadVideoGcore = 'https://webhook.evius.co/upload-video';
  return (
    <Upload.Dragger
      beforeUpload={beforeUpload}
      action={`${urlUploadVideoGcore}?nameActivity=${props.activityName}`}
      maxCount={1}
      accept='video/*'
      name='video'
      onRemove={() => {}}
      onChange={async (info) => {
        const { status, response } = info.file;
        switch (status) {
          case 'done':
            console.log('RESPONSE ACA===>', response);
            selectOption(typeOptions.key, `${response.video.iframe_url}*${response.video.id}`);
            setLoading(false);
            break;
          case 'error':
            if (response.message == 'ERROR: Invalid format') {
              message.error('Formato de video inválido');
            } else {
              message.error('Error al cargar el video');
            }
            setLoading(false);
            break;
          case 'removed':
            //ELIMINAR VIDEO DE GCORE
            if (response?.video) {
              await deleteVideo(response.video.id);
            }
            setLoading(false);
            break;
          default:
            setLoading(true);
            break;
        }

        if (status == 'error') {
        }
      }}>
      <Result
        icon={<FileVideoOutlineIcon />}
        title='Haga clic o arrastre el video a esta área para cargarlo'
        subTitle='Solamente ogm, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v y avi  '
      />
      {loading && <Spin />}
    </Upload.Dragger>
  );
};

export default InputUploadVideo;
