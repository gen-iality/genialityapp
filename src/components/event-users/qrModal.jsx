import { useState, useEffect } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Modal, Row, Form, Typography, Alert, Spin } from 'antd';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import FormEnrollUserToEvent from '../forms/FormEnrollUserToEvent';
import { alertUserNotFoundStyles, getEventUserByParameter } from '@/Utilities/checkInUtils';
import { CheckinAndReadOtherButtons } from './buttonsQrModal';
import { saveOrUpdateUserInAEvent } from '@/Utilities/formUtils';
import QrAndDocumentForm from './qrAndDocumentForm';

const { Title } = Typography;

const html = document.querySelector('html');

const QrModal = ({ fields, typeScanner, clearOption, checkIn, eventID, closeModal, openModal }) => {
  const [form] = Form.useForm();
  const [facingMode, setFacingMode] = useState('user');
  const [qrData, setQrData] = useState({});
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

  /** function to create or edit an eventuser from the cms */
  const saveOrUpdateUser = (values) => {
    const shouldBeEdited = qrData?.user?._id ? true : false;
    const eventUserId = qrData?.user?._id;
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
        <>
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
                    saveUser={saveOrUpdateUser}
                    loaderWhenSavingUpdatingOrDelete={loadingregister}
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
