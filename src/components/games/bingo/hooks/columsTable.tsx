import { DeleteOutlined, EditOutlined, EyeOutlined, FileImageOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tooltip, Image, Typography, Tag } from 'antd';
import { useState } from 'react';
import { useBingo } from '@/components/games/bingo/hooks/useBingo';
import FormatTextIcon from '@2fd/ant-design-icons/lib/FormatText';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';

type columsTableType = {
  actionEditBallotValue: (id: string) => void;
  deleteBallotValue: (id: string) => void;
};

const { Title, Text } = Typography;

export function useColumnsTable({ actionEditBallotValue, deleteBallotValue }: columsTableType) {
  const styleIcon = {
    fontSize: '20px',
  };
  const columns = [
    {
      title: 'Tipo Carton',
      key: 'type_carton',
      dataIndex: 'type',
      type: 'string',
      name: 'Tipo Carton',
      render: (text: string, value: any, index: any) => {
        return value.carton_value.type === 'image' ? (
          <Tag color='blue' icon={<ImageOutlineIcon />}>
            Imagen
          </Tag>
        ) : (
          <Tag color='green' icon={<FormatTextIcon />}>
            Texto
          </Tag>
        );
      },
    },
    {
      title: 'Valor en el cartón',
      key: 'value',
      dataIndex: 'carton_value',
      type: 'string',
      name: 'Valor en el cartón',
      render: (text: string, value: any, index: any) => {
        return value.carton_value.type === 'image' ? (
          <Image
            preview={{ mask: 'Ver', maskClassName: 'borderRadius' }}
            style={{ borderRadius: '10px' }}
            width={50}
            height={50}
            src={value.carton_value.value}
            alt={value.id + ' carton_value'}
          />
        ) : (
          <Text>{value.carton_value.value}</Text>
        );
      },
    },
    {
      title: 'Tipo Balota',
      key: 'type_ballot',
      dataIndex: 'type',
      type: 'string',
      name: 'Tipo Balota',
      render: (text: string, value: any, index: any) => {
        return value.ballot_value.type === 'image' ? (
          <Tag color='blue' icon={<ImageOutlineIcon />}>
            Imagen
          </Tag>
        ) : (
          <Tag color='green' icon={<FormatTextIcon />}>
            Texto
          </Tag>
        );
      },
    },
    {
      title: 'Valor en la balota',
      key: 'ballValue',
      dataIndex: 'ballot_value',
      type: 'string',
      name: 'Valor en la balota',
      render: (text: string, value: any, index: any) => {
        return value.ballot_value.type === 'image' ? (
          <Image
            preview={{ mask: 'Ver', maskClassName: 'borderRadius' }}
            style={{ borderRadius: '10px' }}
            width={50}
            height={50}
            src={value.ballot_value.value}
            alt={value.id + ' carton_value'}
          />
        ) : (
          <Text>{value.ballot_value.value}</Text>
        );
      },
    },
    {
      title: 'Opciones',
      key: 'action',
      type: 'string',
      name: '',
      render: (text: string, value: any, index: any) => {
        return (
          <Row gutter={[8, 8]}>
            <Col>
              <Tooltip placement='topLeft' title='Editar'>
                <Button
                  icon={<EditOutlined />}
                  type='primary'
                  size='small'
                  onClick={() => actionEditBallotValue(value.id)}
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement='topLeft' title='Eliminar'>
                <Button
                  key={`removeAction${index}`}
                  id={`removeAction${index}`}
                  onClick={() => {
                    deleteBallotValue(value.id);
                  }}
                  icon={<DeleteOutlined />}
                  danger
                  size='small'
                />
              </Tooltip>
            </Col>
          </Row>
        );
      },
    },
  ];
  return columns;
}
