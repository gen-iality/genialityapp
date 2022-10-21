import { Form, Modal, Select, Button } from 'antd';
const { Option } = Select;
export default function ModalEdit({
  editField,
  isVisible,
  filterOptions,
  badges,
  fontSize,
  setIsVisible,
  badge,
  setBadge,
}) {
  return (
    <Modal
      destroyOnClose
      title='Actualizar parametro'
      visible={isVisible}
      footer={null}
      onCancel={() => setIsVisible(false)}>
      <Form>
        <Form.Item label='Campo' name='id_properties'>
          <Select
            onChange={(value) =>
              setBadge({
                ...badge,
                id_properties: {
                  // ...id_properties,
                  value,
                },
              })
            }
            placeholder='Selecciona un campo'
            defaultValue={badge.id_properties.label}>
            {filterOptions.map((option, index) => (
              <Option
                key={index + option.value}
                value={option.name}
                disabled={option.label !== badge.id_properties.label}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='Tamaño' name='size'>
          <Select
            placeholder='Selecciona un tamaño'
            onChange={(value) =>
              setBadge({
                ...badge,
                size: value,
              })
            }
            defaultValue={badge.size}>
            {fontSize.map((size, index) => (
              <Option key={index + size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' onClick={() => editField()}>
            Agregar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
