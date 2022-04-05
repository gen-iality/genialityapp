import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';
import { Col, Comment, Modal, Row, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import ReactPlayer from 'react-player';

const ModalPreviewVideo = () => {
  const { urlVideo, visualizeVideo } = useTypeActivity();
  return (
    <Modal
      onCancel={() => visualizeVideo(null)}
      width={'680px'}
      bodyStyle={{ paddingTop: '40px' }}
      visible={urlVideo !== null ? true : false}
      footer={null}>
      <Row gutter={[0, 0]}>
        <Col style={{ borderRadius: '5px', overflow: 'hidden', aspectRatio: '16/9' }} span={24}>
          <ReactPlayer controls width={'100%'} height={'100%'} style={{}} url={urlVideo as string} />
        </Col>
        <Col>
          <Comment
            author={<Typography.Text style={{ fontSize: '16px' }}>Nombre del video</Typography.Text>}
            datetime={'fecha de creacion'}
            content={''}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalPreviewVideo;
