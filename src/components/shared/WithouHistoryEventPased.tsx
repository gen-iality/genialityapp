import React, { useEffect, useState } from 'react';
import { Checkbox, Form } from 'antd';

interface Props {
  initialState: boolean;
  onChangeHideEvents: (checked: boolean) => void;
}

const WithouHistoryEventPased = ({ initialState, onChangeHideEvents }: Props) => {
    console.log('initialState',initialState)
  return (
    <Form.Item name={'hideEventInPassed'} label={<label style={{ marginTop: '2%' }}>Ocultar en eventos pasados</label>}>
      <Checkbox checked={initialState}  onChange={({ target: { checked } }) => onChangeHideEvents(checked)}>
        Seleccione esta opción si desea evitar que se muestre el evento en la seccion de Eventos pasados
      </Checkbox>
    </Form.Item>
  );
};

export default WithouHistoryEventPased;
