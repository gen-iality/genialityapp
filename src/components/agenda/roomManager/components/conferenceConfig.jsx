import { Form, Select, Button, Space, Typography, Row, Col, Card } from 'antd';
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
    <>
      <Card bordered style={{borderRadius: '10px'}}>
        <Row gutter={[16, 16]} justify='space-between' align='middle'>
          <Col>
            {/* <Space direction='horizontal'> */}
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
                  <Option value=''>Actividad creada</Option>
                  <Option value='closed_meeting_room'>Iniciará pronto</Option>
                  <Option value='open_meeting_room'>En vivo</Option>
                  <Option value='ended_meeting_room'>Finalizada</Option>
                </Select>
              </Form.Item>
             {/*  <Text>
                <Text strong>Platforma: </Text>
                {platform}
              </Text>
              <Text>
                <Text strong>Conference Id: </Text>
                {meeting_id}
              </Text>
              {requiresCreateRoom && host_name !== null && <Form.Item label={'Host'}>{host_name}</Form.Item>} */}
              {/* <Button onClick={deleteRoom} danger>
                Eliminar transmisión
              </Button> */}
            {/* </Space> */}
          </Col>
          <Col>
            <Button onClick={deleteRoom} danger>
              Eliminar transmisión
            </Button>
          </Col>
        </Row>
      </Card>
      
    </>
  );
}
