import * as React from 'react';
import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';
import { Col, Comment, Modal, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import ReactPlayer from 'react-player';

const ModalPreviewVideo = () => {
  const { videoObject, visualizeVideo } = useTypeActivity();
  return (
    <Modal
      onCancel={() => visualizeVideo(null, null, null)}
      width={'680px'}
      bodyStyle={{ paddingTop: '40px' }}
      visible={videoObject !== null ? true : false}
      footer={null}>
      <Row gutter={[0, 0]}>
        <Col style={{ borderRadius: '5px', overflow: 'hidden', aspectRatio: '16/9' }} span={24}>
          <ReactPlayer controls width={'100%'} height={'100%'} style={{}} url={videoObject?.url as string} />
        </Col>
        <Col>
          <Comment
            author={<Typography.Text style={{ fontSize: '16px' }}>{videoObject?.name as string}</Typography.Text>}
            datetime={videoObject && dayjs(videoObject?.created_at).format('MMMM Do YYYY, h:mm:ss a')}
            content={''}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalPreviewVideo;
