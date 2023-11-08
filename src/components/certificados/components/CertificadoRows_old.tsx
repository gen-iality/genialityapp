import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Input, Row, Select, Table, Tag } from 'antd';
import { CertifiRow, RowCert } from '../types';
import { DefaultOptionType } from 'antd/lib/cascader';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ColumnType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import { v4 as uuidv4 } from 'uuid';
interface ICertificateRowsProps {
  rows: CertifiRow[];
  onChange: (data: any) => void;
  handleDragEnd  : (data: any) => void;
}

export default function CertificadoRow_old(props: ICertificateRowsProps) {
  const [certificateRows, setCertificateRows] = useState<CertifiRow[]>([]);

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
    delete certificateRows[index];
    const newa = certificateRows.filter((item) => item);
    setCertificateRows(newa);
  };

  const selectChange = (type: RowCert, index: number) => {
    const newRows = [...certificateRows];
    const row = { ...certificateRows[index] };
    row.type = type;
    row.content = '...';
    row.times = 1;
    newRows[index] = row;
    setCertificateRows(newRows);
  };

  const inputChange = (value: string, index: number, type: RowCert) => {
    const newRows = [...certificateRows];
    if (type === 'break') {
      newRows[index].times = +value;
    } else if (typeof value === 'string') {
      newRows[index].content = value;
    }
    setCertificateRows(newRows);
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

  useEffect(() => {
    setCertificateRows(rows)
  }, [rows])
  
  return (
    <>
    <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            onClick={() => {
              setCertificateRows([...certificateRows, { id: uuidv4() , type: 'break', content: '...' }]);
            }}
            icon={<PlusCircleFilled />}>
            Agregar
          </Button>
          <Button
            onClick={() => {
              onChange(certificateRows)
            }}
            icon={<PlusCircleFilled />}>
            Guardar
          </Button>
        </Row>
    <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId='certificados'>
      {(provided : any) => (
        <Table
          ref={provided.innerRef} 
          tableLayout='auto'
          style={{ padding: '30px 0', cursor: 'pointer' }}
          dataSource={certificateRows}
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
