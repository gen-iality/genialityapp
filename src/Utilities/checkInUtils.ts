import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import { newData, searchDocumentOrIdPropsTypes, userCheckInPropsTypes } from './types/types';

export const alertUserNotFoundStyles = {
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  backgroundColor: '#FFFFFF',
  color: '#000000',
  borderLeft: `5px solid #FF4E50`,
  fontSize: '14px',
  textAlign: 'start',
  borderRadius: '5px',
  marginTop: '10px',
  marginBottom: '10px',
};

/**allows you to search by ID or document number for an eventuser in firebase */
export const getEventUserByParameter = ({
  key,
  searchValue,
  fields,
  eventID,
  setQrData,
  setCheckInLoader,
}: searchDocumentOrIdPropsTypes) => {
  let parameterName: string = '';
  let valueName: string = '';
  const { name } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');

  const usersRef = firestore.collection(`${eventID}_event_attendees`);

  switch (key) {
    case 'document':
      parameterName = `properties.${name}`;
      valueName = String(searchValue.document).toLowerCase();
      break;

    case 'qr':
      parameterName = '_id';
      valueName = String(searchValue.qr).toLowerCase();
      break;

    default:
      parameterName = '_id';
      break;
  }

  let newData: newData = {
    msg: '',
    another: false,
    user: {},
    formVisible: false,
  };

  usersRef
    .where(parameterName, '==', valueName)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        newData.msg = 'User not found';
        newData.another = true;
        if (key === 'document') {
          /** If we do not find the user by scanning a card, we add the basic parameters to create a user if required */
          newData.user = {
            properties: {
              names: 'Jhon Doe',
              email: `${valueName}@evius.co`,
              checkInField: valueName,
              bloodtype: 'S',
              birthdate: '2022-05-02',
              gender: 'M',
              rol_id: '60e8a7e74f9fb74ccd00dc22',
              checked_in: true,
            },
          };
          newData.formVisible = true;
        } else {
          newData.user = null;
          newData.formVisible = false;
        }
        setQrData(newData);
        setCheckInLoader(false);
      } else {
        querySnapshot.forEach((doc) => {
          console.log('🚀QR-----', doc.data());
          const userData = doc.data();
          newData.msg = 'User found';
          newData.user = userData;
          newData.another = userData.checked_in && userData.checkedin_at ? true : false;
          newData.formVisible = true;
          setQrData(newData);
          setCheckInLoader(false);
        });
      }
    })
    .catch((e) => {
      console.error('Error getting documents', e);
    });
};

/* function that saves the user's checkIn. If the user's checkIn was successful,
will show the checkIn information in the popUp. If not, it will show an error message.*/
export const userCheckIn = async ({
  qrData,
  setQrData,
  handleScan,
  setCheckInLoader,
  checkIn,
}: userCheckInPropsTypes) => {
  const theUserWasChecked: any = await checkIn(qrData.user._id, qrData.user);
  console.log('🚀 debug ~ qrData', qrData);

  if (theUserWasChecked) {
    setQrData({
      ...qrData,
      msg: '',
      formVisible: true,
      user: {},
    });
    handleScan(qrData.user._id);

    setCheckInLoader(true);
    return;
  }

  DispatchMessageService({
    type: 'error',
    msj: 'hubo un error al registrar el checkIn del usuario',
    action: 'show',
  });
};
