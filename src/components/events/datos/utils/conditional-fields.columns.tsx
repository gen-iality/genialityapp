import { ColumnsType } from 'antd/es/table/interface';
import { IConditionalFieldTable, IConditionalStatus, TValueState } from '../types/conditional-form.types';
import { Space, Tag, Typography } from 'antd';

const conditionalStatus: IConditionalStatus = {
  enabled: {
    label: 'Activado',
    status: 'green',
  },
  disabled: {
    label: 'Desactivado',
    status: 'red',
  },
};
export const columnsConditionalFields: ColumnsType<IConditionalFieldTable> = [
  {
    title: 'Campo validador',
    dataIndex: 'fieldToValidateLabel',
    render(value, record, index) {
      return <Space>
        <Typography.Text>{value}</Typography.Text>
        {record.isDeletedField && <Tag color={'error'}>Campo validador no existe</Tag>}
      </Space>;
    },
  },
  {
    title: 'Valor',
    dataIndex: 'value',
    render: (value, record) => {
      if (typeof record.value === 'boolean') {
        return <Typography.Text>{record.value ? 'Si' : 'No'}</Typography.Text>;
      }
      return <Typography.Text>{record.value}</Typography.Text>;
    },
  },
  {
    title: 'Campos condicionados',
    dataIndex: 'fieldLabels',
    render(value, record, index) {
      return (
        <Space wrap>
          {value.map((item: string) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </Space>
      );
    },
  },
  {
    title: 'Estado',
    dataIndex: 'state',
    render: (value: TValueState, record) => {
      return (
        <Space>
          <Tag color={conditionalStatus[value].status}>{conditionalStatus[value].label}</Tag>
          {record.isRepeat && <Tag color={'warning'}>Repetido</Tag>}
        </Space>
      );
    },
  },
];
