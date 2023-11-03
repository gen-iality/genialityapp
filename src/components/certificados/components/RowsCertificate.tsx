import { useModalLogic } from '@/hooks/useModalLogic';
import RowConfiguration from './RowConfiguration';
import { Button, Space, Table } from 'antd';
import { CertifiRow } from '@/components/agenda/types';
import { defaultCertRows } from '../utils';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import { columnsRowList } from '../utils/rowColumns';

interface Props {
  handleDragEnd: (data: any) => void;
  certificateRows?: CertifiRow[];
}
const RowsCertificate = ({ handleDragEnd, certificateRows }: Props) => {
  const {
    closeModal: onCloseConfigurationRow,
    handledSelectedItem: handledSelectedRow,
    isOpenModal: isOpenConfigurationRow,
    openModal: onOpenConfigurationRow,
    selectedItem: selectedRow,
  } = useModalLogic<CertifiRow>();

  const SortableBody: any = SortableContainer((props: any) => <tbody {...props} />);

  const SortableItem: any = SortableElement((props: any) => <tr {...props} />);

  const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        fontSize: '22px',
      }}
    />
  ));

  return (
    <>
      <Space style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button
          onClick={() => {
            onOpenConfigurationRow();
          }}
          icon={<PlusCircleFilled />}>
          Agregar
        </Button>
      </Space>
      <Table
        tableLayout='auto'
        style={{ padding: '30px 0', cursor: 'pointer' }}
        dataSource={certificateRows ?? defaultCertRows}
        columns={[
          ...columnsRowList,
          {
            title: 'Acciones',
            dataIndex: 'checked',
            width: 10,
            render: (text: string, item: CertifiRow, index: number) => (
              <Space>
                <Button
                  danger
                  type='dashed'
                  onClick={() => {
                    handledSelectedRow(item);
                    onOpenConfigurationRow();
                  }}
                  icon={<EditOutlined />}></Button>
                <Button danger type='dashed' onClick={() => console.log('Hola')} icon={<DeleteOutlined />}></Button>
              </Space>
            ),
          },
        ]}
        pagination={false}
        bordered={false}
        size='small'
        components={{
          body: {
            wrapper: (props: any) => (
              <SortableBody {...props} useDragHandle helperClass='row-dragging' onSortEnd={handleDragEnd} />
            ),
            row: (props: any) => <SortableItem index={props['data-row-key']} {...props} />,
          },
        }}
        //@ts-ignore
        onRow={(record: any, index: number | undefined) => ({
          index,
          'data-row-key': record.id,
        })}
        rowKey='key'
      />
      {isOpenConfigurationRow && (
        <RowConfiguration
          onClose={onCloseConfigurationRow}
          visible={isOpenConfigurationRow}
          selectedRow={selectedRow}
        />
      )}
    </>
  );
};

export default RowsCertificate;
