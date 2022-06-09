import { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment from 'moment';
import { saveCheckInAttendee } from '@/Utilities/checkInUtils';

const AttendeeCheckIn = ({ editUser, reloadComponent }: any) => {
  const [attemdeeCheckIn, setAttemdeeCheckIn] = useState<boolean>(false);
  const [attemdeeCheckedinAt, setAttemdeeCheckedinAt] = useState<any>('');
  const { _id, checked_in, checkedin_at } = editUser || {};
  const { checked_in: checkedIn, checkedin_at: checkedinAt } = editUser?.properties || {};

  // console.log('🚀 debug ~ AttemdeeCheckIn ~ attemdeeCheckIn', { attemdeeCheckIn, attemdeeCheckedinAt });

  useEffect(() => {
    setAttemdeeCheckIn(checked_in || checkedIn);
    setAttemdeeCheckedinAt(checkedin_at || checkedinAt);
  }, []);

  const saveAttemdeeCheckIn = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    saveCheckInAttendee({ _id, checked, reloadComponent, setAttemdeeCheckIn });
  };

  /**
   * If the checkedinAt variable is an object, return the checkedinAt object's toDate() method. If the
   * checkedinAt variable is a string, return the checkedinAt variable. If the checkedin_at variable is
   * an object, return the checkedin_at object's toDate() method. If the checkedin_at variable is a
   * string, return the checkedin_at variable.
   * @returns A date type  string.
   */
  const validateDate = () => {
    if (typeof attemdeeCheckedinAt === 'object') return attemdeeCheckedinAt?.toDate();
    if (typeof attemdeeCheckedinAt === 'string') return attemdeeCheckedinAt;
  };

  return (
    <>
      {_id && (
        <Checkbox checked={attemdeeCheckIn} onChange={saveAttemdeeCheckIn}>
          <b>
            {attemdeeCheckIn ? `Checked at: ${moment(validateDate()).format('D/MMM/YY H:mm:ss')}` : 'Registrar ingreso'}
          </b>
        </Checkbox>
      )}
    </>
  );
};
export default AttendeeCheckIn;
