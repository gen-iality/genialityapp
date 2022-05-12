import { firestore } from '@/helpers/firebase';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import { newData, searchDocumentOrIdPropsTypes } from './types/types';

export const getEventUserByParameter = ({
  key,
  documentOrId,
  fields,
  eventID,
  setQrData,
  setCheckInLoader,
}: searchDocumentOrIdPropsTypes) => {
  let parameterName: string = '';
  let valueName: string = '';
  const { name } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');
  console.log('🚀 debug ~ datos', name);

  const usersRef = firestore.collection(`${eventID}_event_attendees`);
  let value = String(documentOrId).toLowerCase();

  switch (key) {
    case 'document':
      parameterName = `properties.${name}`;
      valueName = value;
      break;

    case 'qr':
      parameterName = '_id';
      valueName = value;
      break;

    default:
      parameterName = '_id';
      valueName = value;
      break;
  }

  let newData: newData = {
    msg: '',
    another: false,
    user: {},
    formVisible: false,
  };
  console.log('🚀 debug ~ newData', newData);

  // Conditional to show modal (QR or Document scanner)

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
              email: `${value}@evius.co`,
              checkInField: value,
              bloodtype: 'S',
              birthdate: '2022-05-02',
              gender: 'M',
              rol_id: '60e8a7e74f9fb74ccd00dc22',
              checked_in: true,
            },
          };
        } else {
          newData.user = null;
        }
        newData.formVisible = true;
        setQrData(newData);
        setCheckInLoader(false);
      } else {
        querySnapshot.forEach((doc) => {
          console.log('🚀QR-----', doc.data());
          const userData = doc.data();
          newData.msg = 'User found';
          newData.user = userData;
          // newData.another = !!qrData?.user?.checked_in;
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
