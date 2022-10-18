import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
export default function SearchUser({
  onSubmit,
  keyboard,
  handleChange,
}: {
  onSubmit: (values: string) => void;
  keyboard: string;
  handleChange: (event: any) => void;
}) {
  return (
    <Input.Search
      addonBefore={<UserOutlined />}
      placeholder='Buscar participante'
      allowClear
      style={{ width: '100%' }}
      onSearch={onSubmit}
      value={keyboard}
      onChange={handleChange}
    />
  );
}
