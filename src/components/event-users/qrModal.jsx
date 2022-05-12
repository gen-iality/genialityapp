import { useState, useEffect } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import QrReader from 'react-qr-reader';
import { Modal, Row, Col, Tabs, Button, Select, Input, Form, Typography, Alert, Spin } from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import FormEnrollUserToEvent from '../forms/FormEnrollUserToEvent';
import { alertUserNotFoundStyles, getEventUserByParameter } from '@/Utilities/checkInUtils';
import { CheckinAndReadOtherButtons, SearchAndCleanButtons } from './buttonsQrModal';

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
      searchUserByParameter({ qr: data });
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

  /**
   * If the user exists and hasn't checked in, check them in, then reset the form.
   */
  const findAnotherUser = async () => {
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

  /** allows us to search for an eventuser by a value, at the moment by id or document. */
  const searchUserByParameter = (searchValue) => {
    //id para pruebas 6273e9633e7bb2310a5125d2
    Object.keys(searchValue).map((key) => {
      const parameters = {
        key,
        searchValue,
        fields,
        eventID,
        setQrData,
        setCheckInLoader,
      };
      getEventUserByParameter(parameters);
    });
  };

  /** When the user clicks the button, the form is reset and the QR code is cleared.*/
  const cleanInputSearch = () => {
    setQrData({});
    form.resetFields();
  };

  return (
    <Row style={{ textAlign: 'center' }}>
      <Modal visible={openModal} onCancel={closeQr} footer={null}>
        <Title level={4} type='secondary'>
          {typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}
        </Title>
        {qrData?.msg === 'User not found' && (
          <Alert
            type='error'
            message={'Usuario no encontrado'}
            showIcon
            closable
            className='animate__animated animate__pulse'
            style={alertUserNotFoundStyles}
          />
        )}
        <Form layout='vertical' form={form} onFinish={searchUserByParameter}>
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
                <CheckinAndReadOtherButtons
                  qrData={qrData}
                  setQrData={setQrData}
                  handleScan={handleScan}
                  setCheckInLoader={setCheckInLoader}
                  checkIn={checkIn}
                  findAnotherUser={findAnotherUser}
                />
              </Spin>
            </div>
          ) : (
            <>
              {typeScanner === 'scanner-qr' ? (
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
                          style={{ width: '80%', marginBottom: '20px' }}
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
                      </>
                    </TabPane>
                  </Tabs>
                </React.Fragment>
              ) : (
                <>
                  <Form.Item label={label} name='document'>
                    <Input allowClear autoFocus />
                  </Form.Item>
                </>
              )}
              <SearchAndCleanButtons cleanInputSearch={cleanInputSearch} />
            </>
          )}
        </Form>
      </Modal>
    </Row>
  );
};

export default QrModal;
