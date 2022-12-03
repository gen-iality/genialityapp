import { useState } from 'react';
import { Card, Col, Image, Modal, Row } from 'antd';
import { Dimension_3x3, Dimension_4x4, Dimension_5x5 } from '../constants/constants';
import { DimensionInterface } from '../interfaces/bingo';
import { DispatchMessageService } from '@/context/MessageService';
interface Props {
  dimensions?: DimensionInterface;
  changeBingoDimensions: (dimensions: DimensionInterface) => Promise<void>;
  size?: number;
}

interface ArrayDimensionInterface extends DimensionInterface {
  image: string;
}

const SelectDimension = (props: Props) => {
  const { dimensions, changeBingoDimensions, size } = props;
  const arrayDimensions: ArrayDimensionInterface[] = [
    {
      format: '3x3',
      amount: 9,
      minimun_values: 18,
      image: Dimension_3x3, // este no se debe mandar al back
    },
    {
      format: '4x4',
      amount: 16,
      minimun_values: 32,
      image: Dimension_4x4, // este no se debe mandar al back
    },
    {
      format: '5x5',
      amount: 25,
      minimun_values: 50,
      image: Dimension_5x5, // este no se debe mandar al back
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dimensionSelected, setDimensionSelected] = useState<DimensionInterface | undefined>(
    arrayDimensions.find((dimension) => dimension?.format === dimensions?.format)
  );

  const showModal = (dimension: DimensionInterface) => {
    if (size !== undefined) {
      if (size <= dimension.minimun_values && dimension.format !== '3x3') {
        DispatchMessageService({
          type: 'info',
          msj: `No cumple con los valores minimos para poder jugar, faltan ${dimension.minimun_values - size}`,
          action: 'show',
        });
        return;
      }
      setIsModalOpen(true);
      setDimensionSelected(dimension);
    } else {
      setIsModalOpen(true);
      setDimensionSelected(dimension);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (dimensionSelected) {
      changeBingoDimensions(dimensionSelected);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal title='¿Estás seguro?' visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>El cambio de dimensiones afectara las balotas de mas que haya introducido...</p>
      </Modal>
      <Row gutter={[32, 8]} align='middle' justify='space-between'>
        {arrayDimensions.map(({ amount, format, image, minimun_values }, i) => (
          <Col key={`${i}-dimension-option`} span={8} style={{ textAlign: 'center' }} onClick={() => showModal({ amount, format, minimun_values })}>
            <Card
              style={{
                userSelect: 'none',
                border: `2px solid ${format === dimensions?.format ? '#AAA' : '#f9f9f9'}`,
              }}
              bodyStyle={{
                padding: '0.25rem',

                overflow: 'hidden',
              }}
              hoverable={
                size !== undefined && format !== '3x3' && size >= 0 ? (size > minimun_values ? true : false) : true
              }>
              <Image preview={false} src={image} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SelectDimension;
