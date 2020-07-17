import { Modal, Select } from "antd";
import moment from "moment";
import React, { useMemo, useState } from "react";

import { getDatesRange } from "../../helpers/utils";

const { Option } = Select;

function AppointmentModal({
  event,
  userId,
  closeModal,
}) {
  const eventDatesRange = useMemo(() => {
    return getDatesRange(event.date_start, event.date_end);
  }, [event]);
  const [selectedDate, setSelectedDate] = useState(eventDatesRange[0])

  return (
    <Modal
      visible={!!userId}
      title={'Agendar cita'}
      footer={null}
      onCancel={() => {
        setSelectedDate(eventDatesRange[0])
        closeModal()
      }}
    >
      <div>
        <Select
          style={{ width: 200 }}
          value={selectedDate}
          onChange={setSelectedDate}
        >
          {eventDatesRange.map((eventDate) => (
            <Option value={eventDate} key={eventDate}>
              {moment(eventDate).format('D MMMM')}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  )
}

export default AppointmentModal;
