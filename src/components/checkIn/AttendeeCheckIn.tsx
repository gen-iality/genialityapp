import { useEffect, useState } from 'react';
import { Checkbox, Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment from 'moment';
import { AttendeeCheckInPropsTypes } from '@/Utilities/types/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { saveCheckInAttendee } from '@/services/checkinServices/checkinServices';

const AttendeeCheckIn = ({ attendee, reloadComponent, checkInAttendeeCallbak }: AttendeeCheckInPropsTypes) => {
  const [attemdeeCheckIn, setAttemdeeCheckIn] = useState<boolean>(false);
  const [attemdeeCheckedinAt, setAttemdeeCheckedinAt] = useState<any>('');
  const { _id, checked_in, checkedin_at } = attendee || {};

  useEffect(() => {
    let dateAndTime: any = '';
    try {
      dateAndTime = checkedin_at && checkedin_at?.toDate();
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
              ? `Checked at: ${moment(attemdeeCheckedinAt).format('D/MMM/YY H:mm:ss A')}`
              : 'Registrar ingreso'}
          </b>
        </Checkbox>
      )}
    </>
  );
};
export default AttendeeCheckIn;
