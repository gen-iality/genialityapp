import { Form, Input } from 'antd';

const getBasicFields = ({ fields, editUser }: any) => {
  let userProperties = editUser?.properties || {};
  if (fields?.lenght === 0) return [];

  const basicFormFields = fields.map((field: any, key: any) => {
    if (field.name !== 'contrasena' && field.name !== 'password') {
      let rule = {};
      let type = field.type || 'text';
      let name = field.name;
      let label = field.label;
      let mandatory = field.mandatory;
      let labelPosition = field.labelPosition;
      let target = name;
      let value = userProperties ? userProperties[target] : '';

      let input = (
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
          initialValue={value}>
          {input}
        </Form.Item>
      );
    }
  });

  return basicFormFields;
};

export default getBasicFields;
