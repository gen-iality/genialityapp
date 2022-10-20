import { DispatchMessageService } from '@context/MessageService';
import { firestore } from '@helpers/firebase';
import { TicketsApi } from '@helpers/request';
import { structureScannedInformation } from '@Utilities/checkInUtils';
import { getFieldDataFromAnArrayOfFields } from '@Utilities/generalUtils';
import { newData, saveCheckInAttendeePropsTypes, searchDocumentOrIdPropsTypes } from '@Utilities/types/types';

/**allows you to search by ID or document number for an eventuser in firebase */
export const getAttendeeByParameter = ({
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

  /** Variables to store the information obtained when scanning the attendee's document */
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
      const split: string[] = searchValue.document.split('<>');

      const documentInformation: any = structureScannedInformation({
        split,
      });

      searchParameter = `properties.${name}`;
      valueParameter = String(split[0]);
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

  const newData: newData = {
    attendeeNotFound: false,
    attendeeFound: false,
    another: false,
    attendee: {},
  };

  setLoadingregister(true);

  usersRef
    .where(searchParameter, '==', valueParameter)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        newData.attendeeNotFound = true;
        if (key === 'document') {
          /** If we do not find the attendee by scanning a card, we add the basic parameters to create a attendee if required */
          newData.attendee = {
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
          newData.attendee = null;
        }
        setScannerData(newData);
        setLoadingregister(false);
      } else {
        querySnapshot.forEach((doc) => {
          const attendeeData = doc.data();
          newData.attendeeFound = true;
          newData.attendee = attendeeData;
          setScannerData(newData);
          setLoadingregister(false);
        });
      }
    })
    .catch((e) => {
      console.error('Error getting documents', e);
    });
};

/* function that saves the attendee's checkIn. If the attendee's checkIn was successful,
  will show the checkIn information in the popUp. If not, it will show an error message.*/
export const saveCheckInAttendee = async ({
  _id,
  checked,
  reloadComponent,
  setAttemdeeCheckIn,
  checkInAttendeeCallbak,
  notification = true,
  checkInType = 'Virtual',
}: saveCheckInAttendeePropsTypes) => {
  let response: any;

  try {
    if (checked) {
      response = await TicketsApi.addCheckIn(_id, checkInType);
      if (notification)
        DispatchMessageService({
          type: 'success',
          msj: 'CheckIn agregado correctamente',
          action: 'show',
        });
    } else {
      response = await TicketsApi.deleteCheckIn(_id);

      if (notification)
        DispatchMessageService({
          type: 'success',
          msj: 'CheckIn eliminado correctamente',
          action: 'show',
        });
    }

    if (checkInAttendeeCallbak) checkInAttendeeCallbak(response);
    /** If the component has a reload and sends it, we execute it */
    if (reloadComponent) {
      reloadComponent(response);
      if (setAttemdeeCheckIn) setAttemdeeCheckIn(response.checked_in);
    }
  } catch (error) {
    if (notification)
      DispatchMessageService({
        type: 'error',
        msj: 'Hubo un error con el checkIn',
        action: 'show',
      });
  }
};
