import { useState, useEffect } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import QrReader from 'react-qr-reader';
import { Modal, Row, Col, Tabs, Button, Select, Input, Form, Typography, Alert, Spin } from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import FormEnrollUserToEvent from '../forms/FormEnrollUserToEvent';
import { getEventUserByParameter, userCheckIn } from '@/Utilities/checkInUtils';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

const html = document.querySelector('html');

const QrModal = ({ fields, usersReq, typeScanner, clearOption, checkIn, eventID, closeModal, openModal }) => {
  const [form] = Form.useForm();
  const [facingMode, setFacingMode] = useState('user');
  const [qrData, setQrData] = useState({});
  const [checkInLoader, setCheckInLoader] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const { label } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');
    setLabel(label);
  }, []);

  const handleScan = (data) => {
    if (!data) {
      return;
    }

    let pos = usersReq
      .map((e) => {
        return e._id;
      })
      .indexOf(data);

    if (pos >= 0) {
      searchDocumentOrId('qr', data);
    } else {
      let newData = {};
      newData.msg = 'User not found';
      newData.another = true;
      newData.formVisible = true;
      setQrData(newData);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const readQr = () => {
    if (qrData.user && !qrData.user.checked_in) checkIn(qrData.user);
    setQrData({
      ...qrData,
      msg: '',
      user: null,
      formVisible: false,
    });
    form.resetFields();
  };

  const closeQr = () => {
    setQrData({ ...qrData, msg: '', user: null });
    html.classList.remove('is-clipped');
    clearOption(); // Clear dropdown to options scanner
    closeModal();
  };

  const searchDocumentOrId = (key, documentOrId) => {
    const parameters = {
      key,
      documentOrId,
      fields,
      eventID,
      setQrData,
      setCheckInLoader,
    };
    getEventUserByParameter(parameters);
  };

  // con esto puedo validar la data del lector con ant
  const searchDocument = (value) => {
    //id para pruebas 6273e9633e7bb2310a5125d2
    const { document, qr } = value;
    Object.keys(value).map((key) => {
      if (key === 'document') searchDocumentOrId(key, document);
      if (key === 'qr') searchDocumentOrId(key, qr);
    });
  };

  // Limpia el input al escanear un codigo que no esta registrado
  const cleanInputSearch = () => {
    setQrData({});
    form.resetFields();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Modal visible={openModal} onCancel={closeQr} footer={null}>
        <Title level={4} type='secondary'>
          {typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}
        </Title>
        <Form layout='vertical' form={form} onFinish={searchDocument}>
          {qrData.user ? (
            <div>
              {qrData.user?.checked_in && qrData?.user?.checkedin_at && (
                <div>
                  <Title level={3} type='secondary'>
                    Usuario Chequeado
                  </Title>
                  <Title level={5}>
                    El checkIn se llevó a cabo el día: <FormattedDate value={qrData?.user?.checkedin_at?.toDate()} /> a
                    las <FormattedTime value={qrData?.user?.checkedin_at?.toDate()} /> horas
                  </Title>
                </div>
              )}
            </div>
          ) : typeScanner === 'scanner-qr' ? (
            <React.Fragment>
              <Tabs defaultValue='1'>
                <TabPane
                  tab={
                    <>
                      <CameraOutlined />
                      {'Camara'}
                    </>
                  }
                  key='1'>
                  <Form.Item>
                    <Select value={facingMode} onChange={(e) => setFacingMode(e)}>
                      <Option value='user'>Selfie</Option>
                      <Option value='environment'>Rear</Option>
                    </Select>
                  </Form.Item>
                  <Row justify='center' wrap gutter={8}>
                    <QrReader
                      delay={500}
                      facingMode={facingMode}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: '80%' }}
                    />
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <ExpandOutlined />
                      {'Pistola'}
                    </>
                  }
                  key='2'>
                  <>
                    <Form.Item label={'Id Usuario'} name='qr'>
                      <Input autoFocus allowClear />
                    </Form.Item>
                    <Row justify='center' wrap gutter={8}>
                      <Col>
                        <Button type='primary' htmlType='submit'>
                          Buscar
                        </Button>
                      </Col>
                      <Col>
                        <Button type='ghost' onClick={() => cleanInputSearch()}>
                          Limpiar
                        </Button>
                      </Col>
                    </Row>
                  </>
                </TabPane>
              </Tabs>
            </React.Fragment>
          ) : (
            <>
              <Form.Item label={label} name='document'>
                <Input allowClear autoFocus />
              </Form.Item>
              <Row justify='center' wrap gutter={8}>
                <Col>
                  <Button type='primary' htmlType='submit'>
                    Buscar
                  </Button>
                </Col>
                <Col>
                  <Button type='ghost' onClick={() => cleanInputSearch()}>
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Form>
        {qrData?.msg === 'User not found' && (
          <Alert
            type={qrData?.msg === 'User found' ? 'success' : 'error'}
            message={'Usuario no encontrado'}
            showIcon
            closable
            className='animate__animated animate__pulse'
            style={{
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              borderLeft: `5px solid #FF4E50`,
              fontSize: '14px',
              textAlign: 'start',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          />
        )}
        <Spin tip='checkIn en progreso' spinning={checkInLoader}>
          {qrData?.formVisible && (
            <FormEnrollUserToEvent
              fields={fields}
              editUser={qrData?.user && qrData?.user}
              // options={}
              // saveUser={}
              // loaderWhenSavingUpdatingOrDelete={}
              visibleInCms
            />
          )}
          <Row justify='center' wrap gutter={8}>
            <Col>
              {qrData.user && !qrData.user?.checked_in && !qrData?.user?.checkedin_at && !qrData.another && (
                <Button
                  type='primary'
                  onClick={() => {
                    userCheckIn({ user: qrData.user, qrData, setQrData, handleScan, setCheckInLoader, checkIn });
                  }}>
                  Check User
                </Button>
              )}
            </Col>
            <Col>
              {qrData.user && (
                <Button className='button' onClick={readQr}>
                  Read Other
                </Button>
              )}
            </Col>
          </Row>
        </Spin>
      </Modal>
    </div>
  );
};

export default QrModal;
