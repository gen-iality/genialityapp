import { Col, Comment, Modal, Row, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import ReactPlayer from 'react-player';

const ModalPreviewVideo = () => {
  return (
    <Modal width={'680px'} bodyStyle={{ paddingTop: '40px' }} visible={true} footer={null}>
      <Row gutter={[0, 0]}>
        <Col style={{ borderRadius: '5px', overflow: 'hidden', aspectRatio: '16/9' }} span={24}>
          <ReactPlayer
            controls
            width={'100%'}
            height={'100%'}
            style={{}}
            url={'https://73518.gvideo.io/videos/73518_wR2M2lgzMB85feE/master.m3u8'}
          />
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
