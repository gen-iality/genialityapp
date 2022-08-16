import { useEffect, useState } from 'react';
import { Checkbox, Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import { AttendeeCheckInPropsTypes } from '@/Utilities/types/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { saveCheckInAttendee } from '@/services/checkinServices/checkinServices';

/**
 * This function is a React component that generates a checkBox, which saves the user's checkIn and allows to delete it after making a confirmation to execute the requested action
 * @param {AttendeeCheckInPropsTypes}  - AttendeeCheckInPropsTypes
 * @returns A React component
 */
const AttendeeCheckInCheckbox = ({ attendee, reloadComponent, checkInAttendeeCallbak }: AttendeeCheckInPropsTypes) => {
  const [attemdeeCheckIn, setAttemdeeCheckIn] = useState<boolean>(false);
  const [attemdeeCheckedinAt, setAttemdeeCheckedinAt] = useState<any>('');
  const { _id, checked_in, checkedin_at } = attendee || {};

  useEffect(() => {
    let dateAndTime: any = '';
    try {
      dateAndTime = typeof checkedin_at === 'object' ? checkedin_at?.toDate() : checkedin_at;
    } catch (error) {}
    setAttemdeeCheckIn(checked_in);
    setAttemdeeCheckedinAt(dateAndTime);
  }, [attendee]);

  const saveAttemdeeCheckIn = async (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    if (checked) {
      await saveCheckInAttendee({
        _id,
        checked,
        reloadComponent,
        setAttemdeeCheckIn,
        checkInAttendeeCallbak,
        checkInType: 'Físico',
      });
      return;
    }

    Modal.confirm({
      title: 'Estás seguro de remover el checkIn',
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez removido, no podrá recuperar la misma información',
      okText: 'Si',
      cancelText: 'No',
      async onOk() {
        await saveCheckInAttendee({
          _id,
          checked,
          reloadComponent,
          setAttemdeeCheckIn,
          checkInAttendeeCallbak,
        });
      },
    });
  };

  return (
    <>
      {_id && (
        <Checkbox checked={attemdeeCheckIn} onChange={saveAttemdeeCheckIn}>
          <b>
            {attemdeeCheckIn
              ? `Checked at: ${dayjs(attemdeeCheckedinAt).format('D/MMM/YY H:mm:ss A')}`
              : 'Registrar ingreso'}
          </b>
        </Checkbox>
      )}
    </>
  );
};

export default AttendeeCheckInCheckbox;
