import { useState } from 'react';
import { Row, Col, Modal, Form, Input, Space } from 'antd';

function OptionTransmitir() {
  const [isModalRtmp, setIsModalRtmp] = useState(false);
  const [isModalLink, setIsModalLink] = useState(false);

  const showModalRtmp = () => {
    setIsModalRtmp(true);
  };

  const showModalLink = () => {
    setIsModalLink(true);
  };

  const handleOkRtmp = () => {
    setIsModalRtmp(false);
  };

  const handleCancelRmtmp = () => {
    setIsModalRtmp(false);
  };

  const handleOklink = () => {
    setIsModalLink(false);
  };

  const handleCancellink = () => {
    setIsModalLink(false);
  };
  return (
    <>
      <div className='step-optTransmicion'>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <div className='container-option' onClick={showModalRtmp}>
              <div className='container-img'>
                <img
                  src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceRtmp.png?alt=media&token=58dca6ce-6671-41ef-bda4-40ae4546e0e3'
                  alt=''
                />
              </div>
              <span className='title-opt'>Transmision por RTMP</span>
              <span className='description'>
                It is a long established fact that a reader will be distracted by the readable content of a page when
                looking at its layout.{' '}
              </span>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <div className='container-option' onClick={showModalLink}>
              <div className='container-img'>
                <img
                  src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceLink.png?alt=media&token=dd26eb19-8440-430b-a7bf-bf542883a5c9'
                  alt=''
                />
              </div>
              <span className='title-opt'>Transmision por Link</span>
              <span className='description'>
                It is a long established fact that a reader will be distracted by the readable content of a page when
                looking at its layout.{' '}
              </span>
            </div>
          </Col>
        </Row>
      </div>
      {/* Modal de Link */}
      <Modal width={600} className='modal-opt' visible={isModalLink} onOk={handleOklink} onCancel={handleCancellink}>
        <img
          src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceLink.png?alt=media&token=dd26eb19-8440-430b-a7bf-bf542883a5c9'
          alt=''
        />
        <span className='title'>Transmision por link</span>
        <Form name='basic'>
          <Form.Item name='link' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input className='input' placeholder='https://www.youtube.com/' />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal de RTMP */}
      <Modal width={600} className='modal-opt' visible={isModalRtmp} onOk={handleOkRtmp} onCancel={handleCancelRmtmp}>
        <img
          src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceRtmp.png?alt=media&token=58dca6ce-6671-41ef-bda4-40ae4546e0e3'
          alt=''
        />
        <span className='title'>Transmision por RTMP</span>
        <Form name='basic'>
          <Space direction='vertical'>
            <Form.Item name='link' rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input className='input' placeholder='https://www.youtube.com/asdakdjijdaks' />
            </Form.Item>
            <Form.Item name='link' rules={[{ required: true, message: 'Please input your code!' }]}>
              <Input className='input' placeholder='Clave45215485232' />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
}

export default OptionTransmitir;
