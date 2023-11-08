import { CertifiRow } from '@/components/agenda/types';
import { Button, Drawer, DrawerProps, Form, Input, Select } from 'antd';
import { typeRowOptions } from '../utils/typeRow.options';
import { useEffect, useState } from 'react';
import { SaveFilled } from '@ant-design/icons';
import { contentRules } from '../utils/rowForm.rules';
import { RowCert } from '../types';
import { InputRowConfig } from './InputRowConfig';
interface Props extends DrawerProps {
  onClose: () => void;
  selectedRow?: CertifiRow;
  handledEdit: (certificatesRowId: string, newRowCertificate: Partial<CertifiRow>) => void;
  handledAdd: (newCertificateRowForm: Omit<CertifiRow, 'id'>) => void;
}

const RowConfiguration = ({ onClose, selectedRow, handledEdit, handledAdd, ...drawerProps }: Props) => {
  const [typeSelected, setTypeSelected] = useState<RowCert>();
  const [form] = Form.useForm<CertifiRow>();
  const [isFormModified, setIsFormModified] = useState(false);


  const onChange = (value: any) => {
    setTypeSelected(value);
  };

  const onFinishForm = async (value: CertifiRow) => {
    if (selectedRow) {
      handledEdit(selectedRow.id, value);
    } else {
      handledAdd(value);
    }
    onClose();
  };

  const handleFormChange = () => {
    setIsFormModified(true);
  };


  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        type: selectedRow.type,
        content: selectedRow.content,
        times: selectedRow.times,
        id: selectedRow.id,
      });
      setTypeSelected(selectedRow.type);
    }
  }, [selectedRow, form]);

  return (
    <Drawer onClose={onClose} title={selectedRow ? 'Editar de fila' : 'Agregar fila'} {...drawerProps}>
      <Form onFinish={onFinishForm} form={form} layout='vertical' onValuesChange={handleFormChange}>
        <Form.Item label='Tipo' name={'type'}>
          <Select options={typeRowOptions} onChange={onChange} />
        </Form.Item>
        <InputRowConfig typeSelected={typeSelected} />
        <Form.Item>
          <Button type='primary' icon={<SaveFilled />} htmlType='submit' disabled={!isFormModified}>
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default RowConfiguration;
