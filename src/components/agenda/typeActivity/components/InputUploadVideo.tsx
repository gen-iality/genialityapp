import { Result, Upload } from 'antd';
import React from 'react';
import FileVideoOutlineIcon from '@2fd/ant-design-icons/lib/FileVideoOutline';
import { RcFile } from 'antd/lib/upload';

const InputUploadVideo = () => {
  const beforeUpload = (file: any) => {
    return file;
  };
  return (
    <Upload.Dragger
      beforeUpload={beforeUpload}
      action={'https://390b-190-93-152-17.ngrok.io?nameActivity=acitividadquemada'}
      maxCount={1}
      accept='video/*'
      name='video'>
      <Result
        icon={<FileVideoOutlineIcon />}
        title='Haga clic o arrastre el video a esta área para cargarlo'
        subTitle='Solamente ogm, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v y avi  '
      />
    </Upload.Dragger>
  );
};

export default InputUploadVideo;
