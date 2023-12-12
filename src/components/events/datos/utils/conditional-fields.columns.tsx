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
      if (record.isRepeat) {
        return (
          <Space>
            <Tag color={conditionalStatus[value].status}>{conditionalStatus[value].label}</Tag>
            <Tag color={'warning'}>Repetido</Tag>
          </Space>
        );
      }
      return <Tag color={conditionalStatus[value].status}>{conditionalStatus[value].label}</Tag>;
    },
  },
];
