import { useState } from 'react';
import { saveCheckInAttendee } from '@/services/checkinServices/checkinServices';
import { AttendeeCheckInPropsTypes } from '@Utilities/types/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

/**
 * This function is a React component that generates a button, which only saves the checkIn, it doesn't delete it, if a physical checkIn is detected, the checkIn update is confirmed through a modal
 * @param {AttendeeCheckInPropsTypes}  - AttendeeCheckInPropsTypes
 * @returns A React component Button.
 */
const AttendeeCheckInButton = ({
  attendee,
  activityId,
  reloadComponent,
  checkInAttendeeCallbak,
}: AttendeeCheckInPropsTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { _id } = attendee || {};

  const saveAttemdeeCheckIn = async () => {
    setLoading(true);
    const updateOrNot = attendee?.checkedin_type === 'Físico' ? false : true;

    if (updateOrNot) {
      await saveCheckInAttendee({
        _id: attendee._id,
        checked: true,
        reloadComponent,
        checkInType: 'Físico',
        activityId,
        checkInAttendeeCallbak,
      });
      setLoading(false);
      return;
    }

    Modal.confirm({
      title: 'Estás seguro de actualizar el checkIn',
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez actualizado, no podrá recuperar la misma información',
      okText: 'Si',
      cancelText: 'No',
      async onOk() {
        await saveCheckInAttendee({
          _id: attendee._id,
          checked: true,
          reloadComponent,
          checkInType: 'Físico',
          activityId,
          checkInAttendeeCallbak,
        });
        setLoading(false);
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  return (
    <>
      {_id && (
        <Button loading={loading} size='small' type='primary' block={true} onClick={saveAttemdeeCheckIn}>
          CheckIn físico
        </Button>
      )}
    </>
  );
};

export default AttendeeCheckInButton;
