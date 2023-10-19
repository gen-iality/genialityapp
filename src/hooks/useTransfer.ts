import { TransferDirection } from 'antd/lib/transfer';
import { useState } from 'react';

export const useTransfer = (initialTargetKeys: string[]) => {
  const [targetKeys, setTargetKeys] = useState([] as string[]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return {
    onChange,
    onSelectChange,
    targetKeys,
    selectedKeys,
    setTargetKeys,
  };
};
