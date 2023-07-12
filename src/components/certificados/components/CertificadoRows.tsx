import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Input, Row, Select, Table, Tag } from 'antd';
import { CertifiRow, RowCert } from '../types';
import { DefaultOptionType } from 'antd/lib/cascader';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ColumnType } from 'antd/lib/table';
import { useState } from 'react';
import { lastID } from '../utils';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
interface ICertificateRowsProps {
  rows: CertifiRow[];
  onChange: (data: any) => void;
  handleDragEnd  : (data: any) => void;
}

export default function CertificadoRow(props: ICertificateRowsProps) {
  const { rows, onChange, handleDragEnd } = props;
  const [inputCurrent, setinputCurrent] = useState<string| number |null>(null)
  const SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  const SortableBody: any = SortableContainer((props: any) => <tbody {...props} />);
  const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        fontSize: '22px',
      }}
    />
  ));


  const change = (index: number) => {
    delete rows[index];
    const newa = rows.filter((item) => item);
    onChange(newa);
  };

  const selectChange = (type: RowCert, index: number) => {
    const newRows = [...rows];
    const row = { ...rows[index] };
    row.type = type;
    row.content = '...';
    row.times = 1;
    newRows[index] = row;
    onChange(newRows);
  };

  const inputChange = (value: string, index: number, type: RowCert) => {
    const newRows = [...rows];
    if (type === 'break') {
      newRows[index].times = +value;
    } else if (typeof value === 'string') {
      newRows[index].content = value;
    }
    onChange(newRows);
  };
  const possibleType: DefaultOptionType[] = [
    {
      value: 'break',
      label: 'Salto',
    },
    {
      value: 'h1',
      label: 'Titulo 1',
    },
    {
      value: 'h2',
      label: 'Titulo 2',
    },
    {
      value: 'h3',
      label: 'Subtitulo 1',
    },
    {
      value: 'h4',
      label: 'Subtitulo 2',
    },
    {
      value: 'p',
      label: 'texto',
    },
  ];
  const columns = [
    {
      title: '',
      className: 'drag-visible',
      dataIndex: 'drag',
      width: 20,
      //@ts-ignore
      render: () => <DragHandle />,
    },
    {
      title: 'Orden',
      dataIndex: 'position',
      width: 20,
      render: (position: number, record: CertifiRow, index: number) => <Tag>{`#${index + 1}`}</Tag>,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      width: 70,
      render: (text: string, item: CertifiRow, index: number) => <Select
      style={{ width: 130 }}
      value={item.type}
      options={possibleType}
      onChange={(e: RowCert) => selectChange(e, index)}
    />,
    },
    {
      title: 'contenido',
      dataIndex: 'content',
      className: 'drag-visible',
      width: 70,
      render : (text: string, item: CertifiRow, index: number) => 
      <Input
      style={{ width: 300 }}
      min={0}
      autoFocus={item.id === inputCurrent}
      onClick={()=> setinputCurrent(item.id)}
      type={item.type === 'break' ? 'number' : 'text'}
      value={item.type === 'break' ? item.times : item.content}
      onChange={(e) => inputChange(e.target.value, index, item.type)}
    />
    },
    {
      title: 'Eliminar',
      dataIndex: 'checked',
      width: 10,
      render: (text: string, item: CertifiRow, index: number) => (
        <Button danger type='dashed' onClick={() => change(index)} icon={<DeleteOutlined />}></Button>
      )
    }
  ];
  return (
    <>
    <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            onClick={() => {
              onChange([...rows, { id: lastID(rows), type: 'text', content: '...' }]);
            }}
            icon={<PlusCircleFilled />}>
            Agregar
          </Button>
        </Row>
    <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId='certificados'>
      {(provided : any) => (
        <Table
          ref={provided.innerRef} 
          tableLayout='auto'
          style={{ padding: '30px 0', cursor: 'pointer' }}
          dataSource={rows}
          columns={columns as ColumnType<CertifiRow>[]}
          pagination={false}
          bordered={false}
          size='small'
          components={{
            body: {
              wrapper: (props : any) => (
                
                <SortableBody {...props} useDragHandle helperClass="row-dragging" onSortEnd={handleDragEnd} />
              ),
              row: (props : any) => <SortableItem index={props["data-row-key"]} {...props} />,
            },
          }}
          //@ts-ignore
          onRow={(record: any, index: number | undefined) => ({
            index,
            'data-row-key': record.id,
          })}
          rowKey='key'
        />
      )}
    </Droppable>
  </DragDropContext>
  </>
  
  );
}
