import { CheckCircleOutlined } from '@ant-design/icons'
import { getLiveStream } from '@adaptors/wowzaStreamingAPI'
import { Form, Input, Alert } from 'antd'
import { useState, useContext } from 'react'
import AgendaContext from '@context/AgendaContext'
import { StateMessage } from '@context/MessageService'

export default function StoreAlreadyCreatedMeeting({ setMeetingId, meeting_id }) {
  const [meetingValue, setMeetingValue] = useState()
  const { platform } = useContext(AgendaContext)
  return (
    <>
      <Form.Item
        name="meeting_id"
        label={'Ingrese el identificador de la conferencia/streaming'}
      >
        <Input
          type="text"
          addonAfter={
            <div
              style={{ cursor: 'pointer' }}
              onClick={async () => {
                if (meetingValue && platform == 'wowza') {
                  try {
                    const exist = await getLiveStream(meetingValue)
                    if (exist) {
                      setMeetingId(meetingValue)
                    } else {
                      StateMessage.show(
                        null,
                        'error',
                        'El id de la transmisión es incorrecto!',
                      )
                    }
                  } catch (e) {
                    StateMessage.show(
                      null,
                      'error',
                      'El id de la transmisión es incorrecto!',
                    )
                  }
                } else if (meetingValue && platform != 'wowza') {
                  setMeetingId(meetingValue)
                } else {
                  StateMessage.show(null, 'error', 'Ingrese un id para la transmisión!')
                }
              }}
            >
              <CheckCircleOutlined /> Crear
            </div>
          }
          name="meeting_id"
          onChange={async (e) => setMeetingValue(e.target.value)}
          value={meeting_id}
        />
      </Form.Item>
      {meeting_id}

      <Alert
        message="Tenga en cuenta!"
        description="Para colocar el ID de la conferencia se le recomienda que pegue el mismo para que no le redireccione a la siguente página incompleta"
        type="warning"
        showIcon
      />
    </>
  )
}
