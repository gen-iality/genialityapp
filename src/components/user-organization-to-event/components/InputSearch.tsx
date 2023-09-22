import { Input } from 'antd';

interface Props {
  onHandled: (text: string) => void;
}

export const InputSearch = ({ onHandled }: Props) => {
  return (
    <Input.Search placeholder='Ingrese el nombre del usuario' onChange={({ target: { value } }) => onHandled(value)} />
  );
};
