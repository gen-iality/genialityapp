import { useState, useEffect } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Modal, Row, Form, Typography, Alert, Spin, Space } from 'antd';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import FormEnrollUserToEvent from '../forms/FormEnrollUserToEvent';
import { alertUserNotFoundStyles, getEventUserByParameter } from '@/Utilities/checkInUtils';
import { CheckinAndReadOtherButtons } from './buttonsQrModal';
import { saveOrUpdateUserInAEvent } from '@/Utilities/formUtils';
import QrAndDocumentForm from './qrAndDocumentForm';
import BadgeAccountAlertIcon from '@2fd/ant-design-icons/lib/BadgeAccountAlert';

const { Title, Text } = Typography;

const html = document.querySelector('html');

const QrModal = ({ fields, typeScanner, clearOption, checkIn, eventID, closeModal, openModal }) => {
  const [form] = Form.useForm();
  const [facingMode, setFacingMode] = useState('user');
  const [scannerData, setScannerData] = useState({});
  const [checkInLoader, setCheckInLoader] = useState(false);
  const [label, setLabel] = useState('');
  const [loadingregister, setLoadingregister] = useState(false);

  useEffect(() => {
    const { label } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');
    setLabel(label);
  }, []);

  const handleScan = (data) => {
    if (!data) {
      return;
    }
    searchUserByParameter({ qr: data });
  };

  const handleError = (err) => {
    console.error(err);
  };

  /**
   * If the user exists and hasn't checked in, check them in, then reset the form.
   */
  const findAnotherUser = async () => {
    setScannerData({
      ...scannerData,
      msg: '',
      user: null,
    });
    form.resetFields();
  };

  const closeQr = () => {
    setScannerData({ ...scannerData, msg: '', user: null });
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
        setScannerData,
        setCheckInLoader,
      };
      getEventUserByParameter(parameters);
    });
  };

  /** function to create or edit an eventuser from the cms */
  const saveOrUpdateUser = (values) => {
    const shouldBeEdited = scannerData?.user?._id ? true : false;
    const eventUserId = scannerData?.user?._id;
    saveOrUpdateUserInAEvent({
      values,
      shouldBeEdited,
      setLoadingregister,
      eventID,
      eventUserId,
    });
  };

  /** When the user clicks the button, the form is reset and the QR code is cleared.*/
  const cleanInputSearch = () => {
    setScannerData({});
    form.resetFields();
  };

  return (
    <Row style={{ textAlign: 'center' }}>
      <Modal visible={openModal} onCancel={closeQr} footer={null}>
        <Title level={4} type='secondary'>
          {typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}
        </Title>
        {scannerData?.msg === 'User not found' && (
          <Alert
            type='error'
            message={
              <Space>
                <BadgeAccountAlertIcon style={{ fontSize: '28px', color: '#FF4E50' }} />{' '}
                <Text>Usuario no encontrado.</Text>{' '}
              </Space>
            }
            closable
            className='animate__animated animate__pulse'
            style={alertUserNotFoundStyles}
          />
        )}
        <>
          {scannerData?.user ? (
            <div>
              {scannerData.user?.checked_in && scannerData?.user?.checkedin_at && (
                <div>
                  <Title level={3} type='secondary'>
                    Usuario Chequeado
                  </Title>
                  <Title level={5}>
                    El checkIn se llevó a cabo el día:{' '}
                    <FormattedDate value={scannerData?.user?.checkedin_at?.toDate()} /> a las{' '}
                    <FormattedTime value={scannerData?.user?.checkedin_at?.toDate()} /> horas
                  </Title>
                </div>
              )}
              <Spin tip='checkIn en progreso' spinning={checkInLoader}>
                <FormEnrollUserToEvent
                  fields={fields}
                  editUser={scannerData?.user && scannerData?.user}
                  saveUser={saveOrUpdateUser}
                  loaderWhenSavingUpdatingOrDelete={loadingregister}
                  visibleInCms
                />
                <CheckinAndReadOtherButtons
                  scannerData={scannerData}
                  setScannerData={setScannerData}
                  handleScan={handleScan}
                  setCheckInLoader={setCheckInLoader}
                  checkIn={checkIn}
                  findAnotherUser={findAnotherUser}
                />
              </Spin>
            </div>
          ) : (
            <QrAndDocumentForm
              form={form}
              facingMode={facingMode}
              setFacingMode={setFacingMode}
              label={label}
              handleScan={handleScan}
              handleError={handleError}
              searchUserByParameter={searchUserByParameter}
              cleanInputSearch={cleanInputSearch}
              typeScanner={typeScanner}
            />
          )}
        </>
      </Modal>
    </Row>
  );
};

export default QrModal;
