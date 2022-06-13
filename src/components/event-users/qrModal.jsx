import { useState, useEffect, useContext } from 'react';
import { Modal, Row, Form, Typography, Alert, Spin, Space } from 'antd';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import FormEnrollUserToEvent from '../forms/FormEnrollUserToEvent';
import { assignMessagesAndTypesToQrmodalAlert, getEventUserByParameter } from '@/Utilities/checkInUtils';
// import { CheckinAndReadOtherButtons } from './buttonsQrModal';
import { saveOrUpdateUserInAEvent } from '@/Utilities/formUtils';
import QrAndDocumentForm from './qrAndDocumentForm';
import PageNextOutlineIcon from '@2fd/ant-design-icons/lib/PageNextOutline';
import { CurrentEventContext } from '@/context/eventContext';

const { Title } = Typography;

const html = document.querySelector('html');

const QrModal = ({ fields, typeScanner, clearOption, checkIn, closeModal, openModal }) => {
  /** PENDING: Se bebe tener en cuenta el campo rol, este debe crearse al crear el evento como campo obligatorio el cual solo debe ser visible admin y permitir cambiar el label, actualmete se recibe la propiedad fields esta se estructura en el front realizando un push del campo con name: 'rol_id', ver componentDidMount del componente ListEventUser ruta: event-user>index, mejorando el origen del campo rol el componente tomaria los user_properties del contexto del evento*/
  const cEvent = useContext(CurrentEventContext);
  const { fields_conditions, _id } = cEvent?.value || {};
  // const fields = cEvent?.value?.user_properties;
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

  /** allows us to search for an eventuser by a value, at the moment by id or document. */
  const searchUserByParameter = (searchValue) => {
    Object.keys(searchValue).map((key) => {
      const parameters = {
        key,
        searchValue,
        fields,
        eventID: _id,
        setScannerData,
        setCheckInLoader,
      };
      getEventUserByParameter(parameters);
    });
  };

  /** function to create or edit an eventuser from the cms */
  const saveOrUpdateUser = async (values) => {
    const shouldBeEdited = scannerData?.user?._id ? true : false;
    const eventUserId = scannerData?.user?._id;

    const response = await saveOrUpdateUserInAEvent({
      values,
      shouldBeEdited,
      setLoadingregister,
      eventID,
      eventUserId,
    });
    console.log('🚀 debug ~ saveOrUpdateUser ~ response', response);

    if (response?._id) searchUserByParameter({ qr: response._id });
  };

  /** When the user clicks the button, the form is reset and the QR code is cleared.*/
  const cleanInputSearch = () => {
    setScannerData({});
    form.resetFields();
  };

  const closeQr = () => {
    cleanInputSearch();
    html.classList.remove('is-clipped');
    clearOption(); // Clear dropdown to options scanner
    closeModal();
  };

  const optionsReadOtherButton = [
    {
      type: 'secondary',
      text: 'Nueva búsqueda',
      icon: <PageNextOutlineIcon />,
      action: (data) => cleanInputSearch(),
    },
  ];

  return (
    <Row style={{ textAlign: 'center' }}>
      <Modal visible={openModal} onCancel={closeQr} footer={null}>
        <Title level={4} type='secondary'>
          {typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}
        </Title>
        {Object.keys(scannerData).length > 0 && (
          <Alert
            type={assignMessagesAndTypesToQrmodalAlert({ scannerData }).type}
            message={assignMessagesAndTypesToQrmodalAlert({ scannerData }).message}
            showIcon
            closable
            className='animate__animated animate__pulse'
          />
        )}
        <>
          {scannerData?.user ? (
            <div>
              <Spin tip='checkIn en progreso' spinning={checkInLoader}>
                <FormEnrollUserToEvent
                  fields={fields}
                  conditionalFields={fields_conditions}
                  editUser={scannerData?.user && scannerData?.user}
                  saveUser={saveOrUpdateUser}
                  loaderWhenSavingUpdatingOrDelete={loadingregister}
                  options={optionsReadOtherButton}
                  visibleInCms
                />
                {/* <CheckinAndReadOtherButtons
                  scannerData={scannerData}
                  setScannerData={setScannerData}
                  handleScan={handleScan}
                  setCheckInLoader={setCheckInLoader}
                  checkIn={checkIn}
                  findAnotherUser={cleanInputSearch}
                /> */}
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
