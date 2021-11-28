import { Form, Input, Button } from 'antd';
export default function StoreAlreadyCreatedMeeting({ setMeetingId, meeting_id }) {
  return (
    <>
      {/*rules={[{ required: true }]}*/}
      <Form.Item name='meeting_id' label={'Ingrese el identificador de la conferencia/streaming'}>
        <Input type='text' name='meeting_id' onChange={(e) => setMeetingId(e.target.value)} value={meeting_id} />
      </Form.Item>
      {meeting_id}

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Guardar
        </Button>
      </Form.Item>
    </>
  );
}
