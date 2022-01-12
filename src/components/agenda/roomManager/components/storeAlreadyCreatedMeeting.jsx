import { Form, Input, Button, Alert } from 'antd';
export default function StoreAlreadyCreatedMeeting({ setMeetingId, meeting_id }) {
  return (
    <>
      {/*rules={[{ required: true }]}*/}
      <Form.Item name='meeting_id' label={'Ingrese el identificador de la conferencia/streaming'}>
        <Input type='text' name='meeting_id' onChange={(e) => setMeetingId(e.target.value)} value={meeting_id} />
      </Form.Item>
      {meeting_id}

      <Alert
        message="Tenga en cuenta!"
        description="Para colocar el ID de la conferencia se le recomienda que pegue el mismo para que no le redireccione a la siguente página incompleta"
        type="warning"
        showIcon
      />

      {/* <Form.Item>
        <Button type='primary' htmlType='submit'>
          Guardar
        </Button>
      </Form.Item> */}
    </>
  );
}
