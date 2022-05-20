import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import { message } from 'antd';
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
/** Structuring of the scanned information after dividing it into an array */
export const structureScannedInformation = ({ split }: any) => {
  /** Variables to store the information obtained when scanning the user's document and dividing to array */
  const email = `${split[0]}@evius.co`;
  const checkInField = split[0];
  let names: string = '';
  let bloodtype: string = '';
  let gender: string = '';
  let birthdateString: string = '';
  let birthdate: string = '';
  let year: string = '';
  let day: string = '';
  let month: string = '';
  switch (split.length) {
    case 10:
      names = split[3] + ' ' + split[4];
      bloodtype = split[7];
      gender = split[5];
      /** When a string arrives for the date of birth we do a destructuring */
      birthdateString = split[6];
      year = birthdateString?.substring(0, 4);
      day = birthdateString?.substring(4, 6);
      month = birthdateString?.substring(6, 8);
      birthdate = `${year}-${day}-${month}`;
      return {
        names,
        email,
        checkInField,
        bloodtype,
        gender,
        birthdate,
      };
    case 9:
      names = split[3];
      bloodtype = split[6];
      gender = split[4];
      /** When a string arrives for the date of birth we do a destructuring */
      birthdateString = split[5];
      year = birthdateString?.substring(0, 4);
      day = birthdateString?.substring(4, 6);
      month = birthdateString?.substring(6, 8);
      birthdate = `${year}-${day}-${month}`;
      return {
        names,
        email,
        checkInField,
        bloodtype,
        gender,
        birthdate,
      };
    default:
      console.log('This document is not supported, information not obtained');
      message.warning('This document is not supported, we could only obtain your document number');
      return {
        names,
        email,
        checkInField,
        bloodtype,
        gender,
        birthdate,
      };
  }
};

/**allows you to search by ID or document number for an eventuser in firebase */
export const getEventUserByParameter = ({
  key,
  searchValue,
  fields,
  eventID,
  setScannerData,
  setCheckInLoader,
}: searchDocumentOrIdPropsTypes) => {
  /** Variables to store the parameters to perform the search in firebase*/
  let searchParameter: string = '';
  let valueParameter: string = '';
  /** Variables to store the information obtained when scanning the user's document */
  let names: string = '';
  let email: string = '';
  let checkInField: string = '';
  let bloodtype: string = '';
  let gender: string = '';
  let birthdate: string = '';
  /** We get the name of the field to be able to do the where in firebase */
  const { name } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');

  const usersRef = firestore.collection(`${eventID}_event_attendees`);

  switch (key) {
    case 'document':
      let split: string[] = searchValue.document.split(' ');
      const documentInformation: any = structureScannedInformation({
        split,
      });
      searchParameter = `properties.${name}`;
      valueParameter = String(split[0]).toLowerCase();

      names = documentInformation.names;
      email = documentInformation.email;
      checkInField = documentInformation.checkInField;
      bloodtype = documentInformation.bloodtype;
      gender = documentInformation.gender;
      birthdate = documentInformation.birthdate;

      break;

    case 'qr':
      searchParameter = '_id';
      valueParameter = String(searchValue.qr).toLowerCase();
      break;

    default:
      searchParameter = '_id';
      valueParameter = '1';
      break;
  }

  let newData: newData = {
    msg: '',
    another: false,
    user: {},
    formVisible: false,
  };

  usersRef
    .where(searchParameter, '==', valueParameter)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        newData.msg = 'User not found';
        newData.another = true;
        if (key === 'document') {
          /** If we do not find the user by scanning a card, we add the basic parameters to create a user if required */
          newData.user = {
            properties: {
              names,
              email,
              checkInField,
              bloodtype,
              birthdate,
              gender,
              rol_id: '60e8a7e74f9fb74ccd00dc22',
              checked_in: true,
            },
          };
          newData.formVisible = true;
        } else {
          newData.user = null;
          newData.formVisible = false;
        }
        setScannerData(newData);
        setCheckInLoader(false);
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          newData.msg = 'User found';
          newData.user = userData;
          newData.another = userData.checked_in && userData.checkedin_at ? true : false;
          newData.formVisible = true;
          setScannerData(newData);
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
  scannerData,
  setScannerData,
  handleScan,
  setCheckInLoader,
  checkIn,
}: userCheckInPropsTypes) => {
  const theUserWasChecked: any = await checkIn(scannerData?.user?._id, scannerData?.user);

  if (theUserWasChecked) {
    setScannerData({
      ...scannerData,
      msg: '',
      formVisible: true,
      user: {},
    });
    handleScan(scannerData?.user?._id);

    setCheckInLoader(true);
    return;
  }

  DispatchMessageService({
    type: 'error',
    msj: 'hubo un error al registrar el checkIn del usuario',
    action: 'show',
  });
};
