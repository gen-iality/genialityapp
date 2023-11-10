import { Form, Input, InputNumber } from 'antd';
import { RowCert } from '../types';
import { rulesType } from '../utils/rowForm.rules';

interface Props {
  typeSelected: RowCert | undefined;
  onChangeInput: any;
}

export const InputRowConfig = ({ typeSelected, onChangeInput }: Props) => {
  const conentFieldDinamic = {
    times: (
      <Form.Item initialValue={1} label='Cantidad de saltos' name={'times'} rules={rulesType.number}>
        <InputNumber
          style={{ width: '100%' }}
         
        />
      </Form.Item>
    ),
    content: (
      <Form.Item label='Contenido' name={'content'} rules={rulesType.text}>
        <Input
          style={{ width: '100%' }}
          onChange={({ target: { value } }) => {
            onChangeInput(value);
          }}
        />
      </Form.Item>
    ),
  };

  const getInput = (rowType: RowCert | undefined) => {
    if (!rowType) return null;
    switch (rowType) {
      case 'break':
        return conentFieldDinamic['times'];

      default:
        return conentFieldDinamic['content'];
    }
  };
  return <>{getInput(typeSelected)}</>;
};
