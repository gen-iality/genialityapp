import { TransferDirection } from 'antd/lib/transfer';
import { useState } from 'react';

//IMPORTANT: Se realiza este hook debido a que el MyTransferComponent dentro de un Form.item no funciona correctamente,
//           por lo que opte por crear un hook para centralizar la logica de manejo


type Actions<Type, T> = {
  [Property in Type as `open${Capitalize<string & Property>}Modal`]: () => void;
} & {
  [Property in Type as `close${Capitalize<string & Property>}Modal`]: () => void;
}& {
  [Property in Type as `isOpen${Capitalize<string & Property>}Modal`]:boolean;
}& {
  [Property in Type as `selected${Capitalize<string & Property>}`]:T | undefined;
}
& {
  [Property in Type as `handledSelect${Capitalize<string & Property>}`]:(item:T)=>void;
};




export const useTransfer = (initialTargetKeys: string[]) => {
  const [targetKeys, setTargetKeys] = useState([] as string[]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  /*   useEffect(() => {
    if (initialTargetKeys) setTargetKeys(initialTargetKeys);
  }, [initialTargetKeys]);
 */
  return {
    onChange,
    onSelectChange,
    targetKeys,
    selectedKeys,
    setTargetKeys,
  };
};
