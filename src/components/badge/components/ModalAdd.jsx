import { Form, Modal, Select, Button } from 'antd'
const { Option } = Select
export default function ModalAdd({
  addField,
  isVisible,
  filterOptions,
  badges,
  fontSize,
  setIsVisible,
}) {
  return (
    <Modal
      title="Agregar parametro"
      open={isVisible}
      destroyOnClose
      footer={null}
      onCancel={() => setIsVisible(false)}
    >
      <Form onFinish={addField}>
        <Form.Item label="Campo" name="id_properties" rules={[{ required: true }]}>
          <Select placeholder="Selecciona un campo">
            {filterOptions.map((option, index) => (
              <Option
                key={index + option.value}
                value={option.name}
                disabled={badges.find(
                  (bagde) => bagde.id_properties.value === option.name,
                )}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Tamaño" name="size" rules={[{ required: true }]}>
          <Select placeholder="Selecciona un tamaño">
            {fontSize.map((size, index) => (
              <Option key={index + size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Agregar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
