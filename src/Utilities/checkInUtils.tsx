import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { TicketsApi } from '@/helpers/request';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import { Typography } from 'antd';
import moment from 'moment';
import { ReactNode } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { newData, saveCheckInAttendeePropsTypes, searchDocumentOrIdPropsTypes } from './types/types';

const { Text } = Typography;

export const nameAndEmailBasicFieldsStyles: any = {
  fontSize: '16px',
  fontWeight: 'bold',
  overflowWrap: 'anywhere',
};

/** Structuring of the scanned information after dividing it into an array */
export const structureScannedInformation = ({ split }: any) => {
  /** Variables to store the information obtained when scanning the user's document and dividing to array */
  const email = `${split[0]}@evius.co`;
  const checkInField = split[0];
  let names: string = '';
  let bloodtype: string = '';
  let gender: string = '';
  let birthdate: string = '';
  switch (split.length) {
    case 10:
      names = `${split[3]} ${split[4]} ${split[1]} ${split[2]}`;
      bloodtype = split[7];
      gender = split[5];
      birthdate = split[6];
      return {
        names,
        email,
        checkInField,
        bloodtype,
        gender,
        birthdate,
      };
    default:
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
  setLoadingregister,
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
      /** We divide the string taken with the scanner to be able to assign the values to their corresponding variable */
      let split: string[] = searchValue.document.split('<>');

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
    userNotFound: false,
    userFound: false,
    another: false,
    user: {},
  };

  setLoadingregister(true);

  usersRef
    .where(searchParameter, '==', valueParameter)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        newData.userNotFound = true;
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
              checked_in: false,
            },
          };
        } else {
          newData.user = null;
        }
        setScannerData(newData);
        setLoadingregister(false);
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          newData.userFound = true;
          newData.user = userData;
          setScannerData(newData);
          setLoadingregister(false);
        });
      }
    })
    .catch((e) => {
      console.error('Error getting documents', e);
    });
};

/* function that saves the user's checkIn. If the user's checkIn was successful,
will show the checkIn information in the popUp. If not, it will show an error message.*/
export const saveCheckInAttendee = async ({
  _id,
  checked,
  reloadComponent,
  setAttemdeeCheckIn,
  checkInUserCallbak,
}: saveCheckInAttendeePropsTypes) => {
  let response: any;

  try {
    if (checked) {
      response = await TicketsApi.addCheckIn(_id);

      DispatchMessageService({
        type: 'success',
        msj: 'CheckIn agregado correctamente',
        action: 'show',
      });
    } else {
      response = await TicketsApi.deleteCheckIn(_id);

      DispatchMessageService({
        type: 'success',
        msj: 'CheckIn eliminado correctamente',
        action: 'show',
      });
    }

    if (checkInUserCallbak) checkInUserCallbak(response);
    /** If the component has a reload and sends it, we execute it */
    if (reloadComponent) reloadComponent();
  } catch (error) {
    DispatchMessageService({
      type: 'error',
      msj: 'Hubo un error con el checkIn',
      action: 'show',
    });
  }
};

/** Function that allows dividing the data captured with a pdf417 code reader by adding a <> after each tabulation to be able to split the text string */
export const divideInformationObtainedByTheCodeReader = ({ event }: any) => {
  if (event.keyCode === 9) {
    event.preventDefault();
    // Split items by <>
    event.target.value = event.target.value + '<>';
    return false;
  }
  return;
};

/* A function that returns an object with message and type as appropriate. */
export const assignMessageAndTypeToQrmodalAlert = ({ scannerData }: any) => {
  let type = 'info';
  let message: ReactNode = <></>;
  const checkedinAt: any = scannerData?.user?.checkedin_at;
  const dateAndTime: any = checkedinAt && checkedinAt?.toDate();

  if (scannerData?.userNotFound) {
    type = 'error';
    message = 'Usuario no encontrado';
  }
  if (scannerData?.userFound && !scannerData?.user?.checked_in) {
    type = 'warning';
    message = 'Usuario encontrado, pero sin registro de ingreso';
  }
  if (scannerData?.userFound && scannerData?.user?.checked_in) {
    type = 'success';
    message = (
      <Text>
        Usuario encontrado, el ingreso se llevó a cabo el día: {moment(dateAndTime).format('D/MMM/YY H:mm:ss')}
      </Text>
    );
  }

  return { type, message };
};
