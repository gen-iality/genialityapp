import { ColumnsType } from 'antd/es/table/interface';
import { IConditionalFieldTable } from '../types/conditional-form.types';

export const columnsConditionalFields: ColumnsType<IConditionalFieldTable> = [
  {
    title: 'Campo validador',
    dataIndex: 'fieldToValidateLabel',
  },
  {
    title: 'Valor',
    dataIndex: 'value',
    render: (value, record) => {
      if (typeof record.value === 'boolean') {
        return <p>{record.value ? 'Si' : 'No'}</p>;
      }
      return <p>{record.value}</p>;
    },
  },
  {
    title: 'Campos condicionados',
    dataIndex: 'fieldLabels',
  },
  {
    title: 'Estado',
    dataIndex: 'state',
  },
];
