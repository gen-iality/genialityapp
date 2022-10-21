import { Form, Input } from 'antd';

const getBasicFields = ({ fields, attendee }: any) => {
  const attendeeProperties = attendee?.properties || {};
  if (fields?.lenght === 0) return [];

  const basicFormFields = fields.map((field: any, key: any) => {
    if (field.name !== 'contrasena' && field.name !== 'password') {
      let rule = {};
      const type = field.type || 'text';
      const name = field.name;
      const label = field.label;
      const mandatory = field.mandatory;
      const labelPosition = field.labelPosition;
      const target = name;
      const value = attendeeProperties ? attendeeProperties[target] : '';

      const input = (
        <Form.Item initialValue={value} name={name} noStyle>
          <Input
            addonBefore={
              labelPosition === 'izquierda' && (
                <span>
                  {mandatory && <span style={{ color: 'red' }}>* </span>}
                  <strong>{label}</strong>
                </span>
              )
            }
            type={type}
            key={key}
            name={name}
            defaultValue={value}
          />
        </Form.Item>
      );

      rule = name == 'email' || name == 'names' ? { required: true } : { required: mandatory };

      //validación para email
      rule = name === 'email' ? { ...rule, type: 'email' } : rule;

      return (
        <Form.Item
          valuePropName={type === 'boolean' ? 'checked' : 'value'}
          label={
            (labelPosition !== 'izquierda' || !labelPosition) && type !== 'tituloseccion'
              ? label
              : '' && (labelPosition !== 'arriba' || !labelPosition)
          }
          name={name}
          rules={[rule]}
          key={'l' + key}
          htmlFor={key}
          // initialValue={value}
        >
          {input}
        </Form.Item>
      );
    }
  });

  return basicFormFields;
};

export default getBasicFields;
