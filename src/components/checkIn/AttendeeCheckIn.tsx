import { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment from 'moment';
import { saveCheckInAttendee } from '@/Utilities/checkInUtils';
import { AttendeeCheckInPropsTypes } from '@/Utilities/types/types';

const AttendeeCheckIn = ({ editUser, reloadComponent, checkInUserCallbak }: AttendeeCheckInPropsTypes) => {
  const [attemdeeCheckIn, setAttemdeeCheckIn] = useState<boolean>(false);
  const [attemdeeCheckedinAt, setAttemdeeCheckedinAt] = useState<any>('');
  const { _id, checked_in, checkedin_at } = editUser || {};
  const { checked_in: checkedIn, checkedin_at: checkedinAt } = editUser?.properties || {};

  useEffect(() => {
    setAttemdeeCheckIn(checked_in || checkedIn);
    setAttemdeeCheckedinAt(checkedin_at || checkedinAt);
  }, []);

  const saveAttemdeeCheckIn = async (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    await saveCheckInAttendee({ _id, checked, reloadComponent, setAttemdeeCheckIn, checkInUserCallbak });
  };

  return (
    <>
      {_id && (
        <Checkbox checked={attemdeeCheckIn} onChange={saveAttemdeeCheckIn}>
          <b>
            {attemdeeCheckIn
              ? `Checked at: ${moment(attemdeeCheckedinAt).format('D/MMM/YY H:mm:ss')}`
              : 'Registrar ingreso'}
          </b>
        </Checkbox>
      )}
    </>
  );
};
export default AttendeeCheckIn;
