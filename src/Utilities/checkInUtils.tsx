import { Typography } from 'antd';
import dayjs from 'dayjs';
import { ReactNode } from 'react';

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
export const assignMessageAndTypeToQrmodalAlert = ({ scannerData, attendeeId }: any) => {
  let type = 'info';
  let message: ReactNode = <></>;
  const checkedinAt: any = scannerData?.attendee?.checkedin_at;
  const dateAndTime: any = checkedinAt && checkedinAt?.toDate();

  if (scannerData?.attendeeNotFound) {
    type = 'error';
    message = `Usuario no encontrado ${attendeeId === '' ? attendeeId : 'Attendee Id: ' + attendeeId}`;
  }
  if (scannerData?.attendeeFound && !scannerData?.attendee?.checked_in) {
    type = 'warning';
    message = 'Usuario encontrado, pero sin registro de ingreso';
  }
  if (scannerData?.attendeeFound && scannerData?.attendee?.checked_in) {
    type = 'success';
    message = (
      <Text>
        Usuario encontrado, el ingreso se llevó a cabo el día: {dayjs(dateAndTime).format('D/MMM/YY H:mm:ss')}
      </Text>
    );
  }

  return { type, message };
};
