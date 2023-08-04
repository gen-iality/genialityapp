import React, { useEffect } from 'react';
import { Checkbox, Input, InputNumber, Select, Space, Typography, Form } from 'antd';
import { extraProperties } from '../interfaces/interfaces';

export const ConfigAdvancePayment = ({
  valueUrlExternalPayment,
  onChangeExternalPayment,
  onChangeUrlExternalPayment,
  checkedExternalPayment,
  externalPayment,
  changeValue = () => {},
  valueInput = 0,
  payment = false,
  currency = 'COP',
  changeCurrency = () => {},
}: extraProperties) => {
  useEffect(() => {
    if (!checkedExternalPayment) {
      onChangeUrlExternalPayment('');
    }
  }, [checkedExternalPayment]);

  return (
    <>
      <Form.Item label={'Valor de la inscripción.'}>
        <Space wrap>
          <InputNumber
            min={currency === 'COP' ? 2000 : 1}
            disabled={!payment}
            value={valueInput}
            onChange={(state) => {
              changeValue(state);
            }}
          />
          <Select
            value={currency}
            disabled={!payment}
            options={[
              { value: 'COP', label: 'COP' },
              { value: 'USD', label: 'USD' },
            ]}
            onChange={changeCurrency}
          />
          <Typography.Text style={{ marginTop: '8px' }}>El valor mínimo es de $2000 pesos o $1 dolar.</Typography.Text>
        </Space>
      </Form.Item>
      <Space direction='vertical'>
        <Checkbox
          onChange={(e) => onChangeExternalPayment(e.target.checked)}
          checked={checkedExternalPayment}
          value={externalPayment}>
          Manejar pago de manera externa
        </Checkbox>
        {checkedExternalPayment && (
          <Input
            placeholder='Ingrese la url'
            onChange={({ target: { value } }) => onChangeUrlExternalPayment(value)}
            value={valueUrlExternalPayment}
          />
        )}
      </Space>
    </>
  );
};
