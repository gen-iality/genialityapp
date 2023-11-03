import { CertifiRow } from '@/components/agenda/types';
import { Button, Drawer, DrawerProps, Form, Input, Select } from 'antd';
import { typeRowOptions } from '../utils/typeRow.options';
import { useState } from 'react';
import { SaveFilled } from '@ant-design/icons';
import { contentRules } from '../utils/rowForm.rules';
import { RowCert } from '../types';

interface Props extends DrawerProps {
  onClose: () => void;
  selectedRow?: CertifiRow;
}

const RowConfiguration = ({ onClose, selectedRow, ...drawerProps }: Props) => {
  const [currentFormValues, setCurrentFormValues] = useState<CertifiRow>();
  const [typeSelected, setTypeSelected] = useState<RowCert>('h1');
  const [form] = Form.useForm<CertifiRow>();
  const onChange = (value: any) => {
    setTypeSelected(value.value);
  };
  const onFinishForm = async () => {};
  const conentFieldDinamic = {
    times: (
      <Form.Item label='Contenido' name={'times'} rules={contentRules}>
        <Input type={'number'} min={0} />
      </Form.Item>
    ),
    content: (
      <Form.Item label='Contenido' name={'content'} rules={contentRules}>
        <Input />
      </Form.Item>
    ),
  };
  return (
    <Drawer onClose={onClose} title={selectedRow ? 'Editar de fila' : 'Agregar fila'} {...drawerProps}>
      <Form onFinish={onFinishForm} form={form} layout='vertical' onValuesChange={setCurrentFormValues}>
        <Form.Item label='Tipo' name={'type'}>
          <Select options={typeRowOptions} onChange={onChange} />
        </Form.Item>

        {currentFormValues?.type && conentFieldDinamic[currentFormValues.type === 'break' ? 'times' : 'content']}

        <Form.Item>
          <Button type='primary' icon={<SaveFilled />} htmlType='submit'>
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default RowConfiguration;
