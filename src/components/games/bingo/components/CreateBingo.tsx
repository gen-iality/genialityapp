import React from 'react';
import { Card, Form, Input } from 'antd';
import { useBingo } from '@/components/games/bingo/hooks/useBingo';
import SelectDimension from './SelectDimension';

export default function CreateBingo() {
  const { formDataBingo, setFormDataBingo, changeBingoDimensions } = useBingo();
  return (
    <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
      <Form.Item
        label={
          <label style={{ marginTop: '2%' }}>
            Nombre <label style={{ color: 'red' }}>*</label>
          </label>
        }
        name='name'
        rules={[{ required: true, message: 'El nombre es requerido' }]}>
        <Input
          placeholder={'Titulo del Bingo'}
          value={formDataBingo.name}
          onChange={(e) => setFormDataBingo({ ...formDataBingo, name: e.target.value })}
        />
      </Form.Item>
      <SelectDimension dimensions={formDataBingo.dimensions} changeBingoDimensions={changeBingoDimensions} />
    </Card>
  );
}
