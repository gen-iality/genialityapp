import { Form, Select, Button, Space, Typography } from 'antd';
const { Text, Link } = Typography;

export default function ConferenceConfig({
  roomStatus,
  deleteRoom,
  setRoomStatus,
  platform,
  meeting_id,
  requiresCreateRoom,
  host_name, //g3bcjcjf
}) {
  return (
    <Space direction='vertical'>
      <Form.Item
        label={'Estado de videoconferencia'}
        tooltip={
          <>
            {'Si desea volver a elegir otra plataforma seleccione el siguiente botón'}
            <Button type='primary' onClick={deleteRoom}>
              {'Reiniciar selección'}
            </Button>
          </>
        }>
        <Select
          value={roomStatus}
          onChange={(value) => {
            setRoomStatus(value);
          }}>
          <Option value=''>Conferencia creada</Option>
          <Option value='open_meeting_room'>Conferencia Abierta</Option>
          <Option value='closed_meeting_room'>Conferencia en Preparación</Option>
          <Option value='ended_meeting_room'>Conferencia Terminada</Option>
        </Select>
      </Form.Item>
      <Text>
        <Text strong>Platform: </Text>
        {platform}
      </Text>
      <Text>
        <Text strong>Conference Id: </Text>
        {meeting_id}
      </Text>
      {requiresCreateRoom && host_name !== null && <Form.Item label={'Host'}>{host_name}</Form.Item>}
      <Button onClick={deleteRoom} danger>
        Eliminar transmisión
      </Button>
    </Space>
  );
}
