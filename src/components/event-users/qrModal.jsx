import { useState, useEffect, useContext } from 'react';
import { Modal, Row, Form, Typography, Alert, Spin, Space } from 'antd';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import FormEnrollAttendeeToEvent from '../forms/FormEnrollAttendeeToEvent';
import { assignMessageAndTypeToQrmodalAlert } from '@/Utilities/checkInUtils';
import QrAndDocumentForm from './qrAndDocumentForm';
import PageNextOutlineIcon from '@2fd/ant-design-icons/lib/PageNextOutline';
import { CurrentEventContext } from '@/context/eventContext';
import { getAttendeeByParameter } from '@/services/checkinServices/checkinServices';
import { saveOrUpdateAttendeeInAEvent } from '@/services/formServices/formServices';

const { Title } = Typography;

const html = document.querySelector('html');

const QrModal = ({ fields, typeScanner, clearOption, closeModal, openModal }) => {
  /** PENDING: Se bebe tener en cuenta el campo rol, este debe crearse al crear el evento como campo obligatorio el cual solo debe ser visible admin y permitir cambiar el label, actualmete se recibe la propiedad fields esta se estructura en el front realizando un push del campo con name: 'rol_id', ver componentDidMount del componente ListEventUser ruta: event-user>index, mejorando el origen del campo rol el componente tomaria los user_properties del contexto del evento*/
  const cEvent = useContext(CurrentEventContext);
  const { fields_conditions, type_event, _id } = cEvent?.value || {};
  // const fields = cEvent?.value?.user_properties;
  const [form] = Form.useForm();
  const [facingMode, setFacingMode] = useState('user');
  const [scannerData, setScannerData] = useState({});
  const [label, setLabel] = useState('');
  const [loadingregister, setLoadingregister] = useState(false);
  const [attendeeId, setAttendeeId] = useState('');

  useEffect(() => {
    const { label } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');
    setLabel(label);
  }, []);

  const handleScan = (data) => {
    if (!data) {
      return;
    }
    searchAttendeeByParameter({ qr: data });
  };

  const handleError = (err) => {
    console.error(err);
  };

  /** allows us to search for an eventuser by a value, at the moment by id or document. */
  const searchAttendeeByParameter = (searchValue) => {
    Object.keys(searchValue).map((key) => {
      if (key === 'qr') setAttendeeId(searchValue[key]);

      const parameters = {
        key,
        searchValue,
        fields,
        eventID: _id,
        setScannerData,
        setLoadingregister,
      };
      getAttendeeByParameter(parameters);
    });
  };

  /** function to create or edit an eventuser from the cms */
  const saveOrUpdateAttendee = async (values) => {
    const shouldBeEdited = scannerData?.attendee?._id ? true : false;
    const attendeeId = scannerData?.attendee?._id;

    const response = await saveOrUpdateAttendeeInAEvent({
      values,
      shouldBeEdited,
      setLoadingregister,
      eventID: _id,
      attendeeId,
    });

    if (response?._id) searchAttendeeByParameter({ qr: response._id });
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
        {!loadingregister && Object.keys(scannerData).length > 0 && (
          <Alert
            type={assignMessageAndTypeToQrmodalAlert({ scannerData }).type}
            message={assignMessageAndTypeToQrmodalAlert({ scannerData, attendeeId }).message}
            showIcon
            closable
            className='animate__animated animate__pulse'
          />
        )}
        <>
          {scannerData?.attendee ? (
            <FormEnrollAttendeeToEvent
              fields={fields}
              conditionalFields={fields_conditions}
              attendee={scannerData?.attendee && scannerData?.attendee}
              saveAttendee={saveOrUpdateAttendee}
              loaderWhenSavingUpdatingOrDelete={loadingregister}
              checkInAttendeeCallbak={(attendee) => searchAttendeeByParameter({ qr: attendee._id })}
              options={optionsReadOtherButton}
              visibleInCms
              eventType={type_event}
            />
          ) : (
            <QrAndDocumentForm
              form={form}
              facingMode={facingMode}
              setFacingMode={setFacingMode}
              label={label}
              handleScan={handleScan}
              handleError={handleError}
              searchAttendeeByParameter={searchAttendeeByParameter}
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
