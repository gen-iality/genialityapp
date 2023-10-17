import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Grid, Button } from 'antd';
import React, { useState } from 'react';

const { useBreakpoint } = Grid;
interface Props {
  onHandled: (text: string) => void;
}
export const InputSearchEvent = ({ onHandled }: Props) => {
  const [showSearch, setShowSearch] = useState(false);
  const screens = useBreakpoint();

  const restartSearch = () => {
    setShowSearch(false);
    onHandled('');
  };

  const IconOnlySearch = (
    <div>
      {!showSearch ? (
        <Button
          type='text'
          size='large'
          onClick={() => setShowSearch(true)}
          icon={<SearchOutlined style={{ fontSize: '25px' }} />}></Button>
      ) : (
        <Input
          autoFocus
          onBlur={() => restartSearch()}
          size='large'
          prefix={<SearchOutlined />}
          placeholder='Ingrese el nombre de un evento'
          onChange={({ target: { value } }) => onHandled(value)}
          addonBefore={<Button danger type='primary' onClick={() => restartSearch()} icon={<CloseOutlined />}></Button>}
        />
      )}
    </div>
  );

  return screens.xs ? (
    IconOnlySearch
  ) : (
    <Input
      size='large'
      prefix={<SearchOutlined />}
      placeholder='Ingrese el nombre de un evento'
      onChange={({ target: { value } }) => onHandled(value)}
    />
  );
};
