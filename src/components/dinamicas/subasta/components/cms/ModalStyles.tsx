import React, { useState } from 'react';
import { ImagesData, ModalStylesProps } from '../../interfaces/auction.interface';
import { Button, Card, Col, Divider, Result, Row, Space, Spin, Typography, Upload } from 'antd';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';
import { BgColorsOutlined } from '@ant-design/icons';
import { uploadImagedummyRequest } from '../../utils/utils';
import FileVideoOutlineIcon from '@2fd/ant-design-icons/lib/FileVideoOutline';
import { DispatchMessageService } from '@/context/MessageService';
import { RcFile } from 'antd/lib/upload';
const { Dragger } = Upload;
export default function ModalStyles({ onOk, type, styles}: ModalStylesProps) {
  const [dataChange, setdataChange] = useState<string>('');

  const handleBeforeUpload = (file: RcFile) => {
    return file;
  };
  const onChange = async (data: ImagesData) => {
    const { status, response, error } = data.file;
    switch (status) {
      case 'removed':
 
        break;
      case 'error':
        DispatchMessageService({ type: 'error', msj: 'No se logro subir una imagen', action: 'show' }); 
        break;

      case 'done':
        const { url } = response
        onOk('general', { backgroundImage: url })
            break;
      case 'uploading':
        break;

      default:
        break;
    }
  };
 
  return (
    <div>
      {dataChange !== '' && <Button onClick={() => setdataChange('')}>Cambiar</Button>}
      {dataChange === '' && (
        <Row align='middle' justify='space-between'>
          <Col span={11}>
            <Card
              bordered={false}
              hoverable
              onClick={() => {
                setdataChange('color');
              }}>
              <Space size={3} direction='vertical' style={{ width: '100%' }} align='center'>
                <BgColorsOutlined style={{ fontSize: '40px', color: '#6B7283' }} />
                <Typography.Text style={{ fontSize: '16px', color: '#6B7283' }}>Cambiar Color</Typography.Text>
              </Space>
            </Card>
          </Col>
          <Divider style={{ height: '50px' }} type='vertical' />
          <Col span={11}>
            <Card
              bordered={false}
              hoverable
              onClick={() => {
                setdataChange('fondo');
              }}>
              <Space size={3} direction='vertical' style={{ width: '100%' }} align='center'>
                <ImageOutlineIcon style={{ fontSize: '40px', color: '#6B7283' }} />
                <Typography.Text style={{ fontSize: '16px', color: '#6B7283' }}>Cambiar imagen</Typography.Text>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
      {dataChange === 'color' && <></>}
      {dataChange === 'fondo' && (
        <Dragger
          
          beforeUpload={handleBeforeUpload}
          listType='picture'
          onChange={onChange}
          customRequest={uploadImagedummyRequest}
          name='file'
          maxCount={1}
          accept='image/png,image/jpeg,image/jpg,image/gif'
          type='select'>
          <Result
            icon={<FileVideoOutlineIcon />}
            title='Haga clic o arrastre el video a esta área para cargarlo'
            subTitle='Solamente formato ogm, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v y avi.'
          />
          {/* {isLoading && <Spin />} */}
        </Dragger>
      )}
    </div>
  );
}
