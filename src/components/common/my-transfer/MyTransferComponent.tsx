import { useEffect, useState } from 'react';
import { Transfer, TransferProps } from 'antd';
import { TransferItem } from 'antd/es/transfer';
import { TransferDirection } from 'antd/lib/transfer';

interface IMyTransferComponentProps<T extends TransferItem> extends TransferProps<T> {
  onSetTargetKey?: (selectedDataList: T[]) => void;
  selectedRowKey: (record: T) => string;
}

export const filterOption = (inputValue: string, option: any) => {
  return option.displayName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
};

const MyTransferComponent = <T extends TransferItem>({
  onSetTargetKey,
  selectedRowKey,
  targetKeys: targetKeysProps,
  dataSource,
  ...transferProps
}: IMyTransferComponentProps<T>) => {
  const [targetKeys, setTargetKeys] = useState([] as string[]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  useEffect(() => {
    if (targetKeysProps) setTargetKeys(targetKeysProps);
  }, []);

  //todo: poner la regla bien ya que si vien target key del editar y no lo tocas te salta la regla

  return (
    <Transfer
      dataSource={dataSource}
      titles={['Source', 'Target']}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={()=>{console.log('gegegegeg')}}
      onSelectChange={onSelectChange}
      {...transferProps}
    />
  );
};

export default MyTransferComponent;
