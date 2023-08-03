import React, { useState } from 'react';
import { Checkbox, InputNumber, Select, Space, Typography } from 'antd';
import { extraProperties } from '../interfaces/interfaces';

export const ConfigAdvancePayment = ({
  externalPayment,
  changeValue = () => {},
  valueInput = 0,
  payment = false,
  currency = 'COP',
  changeCurrency = () => {},
}: extraProperties) => {
  const [checkedExternalPayment, setCheckedExternalPayment] = useState(false);

  const onChangeLocationPayment = (checked: boolean) => {
    setCheckedExternalPayment(checked);
  };

  return (
    <Space direction='vertical'>
      <Typography.Text strong style={{ fontWeight: '500' }}>
        Valor de la inscripción.
      </Typography.Text>
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
      </Space>
      <Space>
        <Checkbox onChange={(e) => onChangeLocationPayment(e.target.checked)} checked={checkedExternalPayment}>
          Manejar pago de manera externa
        </Checkbox>
      </Space>
      <Typography.Text style={{ marginTop: '8px' }}>El valor mínimo es de $2000 pesos o $1 dolar.</Typography.Text>
    </Space>
  );
};
