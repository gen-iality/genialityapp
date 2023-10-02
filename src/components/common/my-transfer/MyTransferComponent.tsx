import { useEffect, useState } from 'react';
import { Transfer, TransferProps } from 'antd';
import { TransferItem } from 'antd/es/transfer';

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
  targetKeys,
  dataSource,
  ...transferProps
}: IMyTransferComponentProps<T>) => {
  const [attendeesKeyTarget, setAttendeesKeyTarget] = useState<string[]>([]);
  const [selectedAttendesKeys, setSelectedAttendeesKey] = useState<string[]>([]);
  console.log('dataSource',dataSource)
  const onChange = (nextAttendeeKeyTarget: string[]) => {
    setAttendeesKeyTarget(nextAttendeeKeyTarget);
    if (onSetTargetKey)
      onSetTargetKey(dataSource.filter((item) => nextAttendeeKeyTarget.includes(selectedRowKey(item))));
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedAttendeesKey([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  useEffect(() => {
    if (targetKeys) setAttendeesKeyTarget(targetKeys);
  }, []);

  //todo: poner la regla bien ya que si vien target key del editar y no lo tocas te salta la regla

  return (
    <Transfer
      rowKey={selectedRowKey}
      listStyle={{ width: 500 }}
      filterOption={filterOption}
      showSearch
      titles={['Disponibles', 'Asignados']}
      targetKeys={attendeesKeyTarget}
      selectedKeys={selectedAttendesKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
      oneWay={true}
      showSelectAll={true}
      dataSource={dataSource}
      {...transferProps}
    />
  );
};

export default MyTransferComponent;
