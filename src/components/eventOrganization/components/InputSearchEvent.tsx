import { Input } from 'antd';
import React from 'react';

interface Props {
  onHandled: (text: string) => void;
}
export const InputSearchEvent = ({ onHandled }: Props) => {
  return (
    <Input.Search placeholder='Ingrese el nombre de un evento' onChange={({ target: { value } }) => onHandled(value)} />
  );
};
