import { message, Result, Upload } from 'antd';
import React from 'react';
import FileVideoOutlineIcon from '@2fd/ant-design-icons/lib/FileVideoOutline';
import { RcFile } from 'antd/lib/upload';
import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';

const InputUploadVideo = (props: any) => {
  const { selectOption, typeOptions } = useTypeActivity();
  const beforeUpload = (file: any) => {
    return file;
  };
  console.log('KEY==>', typeOptions.key);
  return (
    <Upload.Dragger
      beforeUpload={beforeUpload}
      action={`http://143.110.230.98:3000?nameActivity=${props.activityName}`}
      maxCount={1}
      accept='video/*'
      name='video'
      onRemove={() => {}}
      onChange={(info) => {
        const { status, response } = info.file;
        if (status == 'done') {
          selectOption(typeOptions.key, response.video.iframe_url + '-' + response.video.id);
        }
        if (status == 'error') {
          message.error('Error al cargar el video');
        }
      }}>
      <Result
        icon={<FileVideoOutlineIcon />}
        title='Haga clic o arrastre el video a esta área para cargarlo'
        subTitle='Solamente ogm, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v y avi  '
      />
    </Upload.Dragger>
  );
};

export default InputUploadVideo;
