import { Row, Col, Form, Select } from 'antd';
export default function ZoomOptions({ hasVideoconference, select_host_manual, handleChange, host_id, host_list }) {
  return (
    <>
      {!hasVideoconference && (
        <Form.Item label={'Desea seleccionar manualmente el host?'}>
          <Select
            defaultValue={select_host_manual}
            value={select_host_manual}
            name='select_host_manual'
            onChange={(e) => handleChange(e, 'select_host_manual')}>
            <Option value={true}>Si</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>
      )}

      {select_host_manual && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Form.Item label={'Seleccione un host'}>
              <Select
                defaultValue={host_id}
                value={host_id}
                name='host_id'
                onChange={(e) => handleChange(e, 'host_id')}>
                <Option value={null}>Seleccione...</Option>
                {host_list.length > 0 &&
                  host_list.map((host) => (
                    <Option key={host.host_id} value={host.host_id}>
                      {host.host_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  );
}
