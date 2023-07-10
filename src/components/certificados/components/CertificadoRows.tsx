import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Col, Input, List, Row, Select } from 'antd';
import { CertifiRow, RowCert } from '../types';
import { DefaultOptionType } from 'antd/lib/cascader';

interface ICertificateRowsProps {
  rows: CertifiRow[];
  onChange: (data: any) => void;
}

export default function CertificadoRow(props: ICertificateRowsProps) {
  const { rows, onChange } = props;

  const change = (index: number) => {
      delete(rows[index])
      onChange(rows.filter((item)=> item))
  }

  const selectChange = (type: RowCert , index: number) => {
    const newRows= [...rows]
    const row =  {...rows[index]}
    row.type = type
    row.content = '...'
    row.times = 1
    newRows[index] = row
    onChange(newRows)
  }

  const inputChange = (value: string  , index: number, type: RowCert) => {
    const newRows= [...rows]
    if(type === 'break') {
      newRows[index].times = +value
    }else  if (typeof value === 'string') {
      newRows[index].content = value
    }
    onChange(newRows)
  }
  const possibleType: DefaultOptionType[] = [
    {
      value: 'break',
      label: 'break',
    },
    {
      value: 'h1',
      label: 'h1',
    },
    {
      value: 'h2',
      label: 'h2',
    },
    {
      value: 'h3',
      label: 'h3',
    },
    {
      value: 'h4',
      label: 'h4',
    },
    {
      value: 'text',
      label: 'text',
    },
  ];

  return (
    <List
    className='desplazar'
      header={
        <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            onClick={() => {
              onChange([...rows, { type: 'text', content: '...' }]);
            }}
            icon={<PlusCircleFilled />}>
            Agregar
          </Button>
        </Row>
      }
      bordered
      dataSource={rows}
      renderItem={(item, index) => (
        <List.Item>
          <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Col sm={50} md={60} lg={70}>
              <Select style={{ width: 90 }} defaultValue={item.type} options={possibleType} onChange={(e: RowCert)=> selectChange(e,index)} />
            </Col>
            <Col sm={50} md={60} lg={70}>
              <Input
              style={{ width: 300}}
                min={0}
                type={item.type === 'break' ? 'number' : 'text'}
                value={item.type === 'break' ? item.times : item.content}
                onChange={(e)=> inputChange(e.target.value,index, item.type)}
              />
            </Col>
            <Col>
              <Button
                danger
                type='dashed'
                onClick={()=> change(index)}
                icon={<DeleteOutlined />}>
                
              </Button>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
}
