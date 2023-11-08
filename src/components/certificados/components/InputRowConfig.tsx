import { Form, Input } from 'antd';
import { RowCert } from '../types';
import { contentRules } from '../utils/rowForm.rules';

interface Props {
  typeSelected: RowCert | undefined;
}

export const InputRowConfig = ({ typeSelected }: Props) => {

  const conentFieldDinamic = {
    times: (
      <Form.Item label='Contenido' name={'times'} rules={contentRules}>
        <Input type={'number'} min={1} max={10}/>
      </Form.Item>
    ),
    content: (
      <Form.Item label='Contenido' name={'content'} rules={contentRules}>
        <Input />
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
