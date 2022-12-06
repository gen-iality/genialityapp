import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Tooltip,
  Typography,
  Grid,
  Collapse,
  Tag,
} from 'antd';
import React, { useState } from 'react';
import useBingoContext from '../../hooks/useBingoContext';
import { BingoValue, DimensionInterface, PickedNumberInterface, Template } from '../../interfaces/bingo';

interface Props {
  type: 'start' | 'restart';
  bingoValues: BingoValue[];
  playing: boolean;
  pickedNumber: PickedNumberInterface;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  dimensions: DimensionInterface;
}

const { useBreakpoint } = Grid;

export default function ChooseTemplate(props: Props) {
  const { type, bingoValues, dimensions, endGame, pickedNumber, playing, restartGame, startGame } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { templates, templateSelected, chooseTemplate } = useBingoContext();
  const screens = useBreakpoint();

  console.log('templates', templates);

  const arrayDefaults = templates.filter((template) => template.category === 'default');
  const arrayColumns = templates.filter((template) => template.category === 'columns');
  const arrayRows = templates.filter((template) => template.category === 'rows');
  const arraySpecials = templates.filter((template) => template.category === 'specials');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (type === 'start') startGame();
    if (type === 'restart') restartGame();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {type === 'start' && (
        <Tooltip
          title={bingoValues?.length < dimensions.minimun_values ? `${dimensions.minimun_values} valores minimo` : ''}>
          <Button type='primary' disabled={bingoValues.length < dimensions.minimun_values} onClick={showModal}>
            Iniciar Bingo
          </Button>
        </Tooltip>
      )}
      {type === 'restart' && (
        <Popconfirm title='Estás seguro de reiniciar el BINGO?' onConfirm={showModal}>
          <Button>Nueva ronda</Button>
        </Popconfirm>
      )}
      <Modal
        bodyStyle={{ height: '400px', overflowY: 'auto', padding: '0px 10px' }}
        width={screens.xs ? '1000px' : '1000px'}
        okText='Iniciar Bingo'
        cancelText='Cancelar'
        title={
          <Typography.Title style={{ textAlign: 'center' }} level={4}>
            Selecciona un template
          </Typography.Title>
        }
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Row style={{ paddingTop: '8px' }} gutter={[16, 16]}>
          <Col span={24}>
            <Collapse ghost={true} defaultActiveKey={['1', '2', '3', '4']}>
              <Collapse.Panel header='Default' key='1'>
                <Row gutter={[32, 16]}>
                  {arrayDefaults.map((figure, index) => (
                    <Col span={4}>
                      <Card
                        style={
                          figure._id === templateSelected?._id
                            ? { outline: '2px solid #50D3C9', outlineOffset: '8px' }
                            : { cursor: 'pointer' }
                        }
                        onClick={() => chooseTemplate(figure._id)}
                        bodyStyle={{ padding: '0px' }}
                        bordered={false}
                        cover={<Image src={figure.image} preview={false} />}>
                        <Tag
                          color={figure._id === templateSelected?._id ? 'cyan' : ''}
                          style={{ width: '100%', textAlign: 'center' }}>
                          {figure.title}
                        </Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Collapse.Panel>
              <Collapse.Panel header='Columnas' key='2'>
                <Row gutter={[32, 16]}>
                  {arrayColumns.map((figure, index) => (
                    <Col span={4}>
                      <Card
                        style={
                          figure._id === templateSelected?._id
                            ? { outline: '2px solid #50D3C9', outlineOffset: '8px' }
                            : { cursor: 'pointer' }
                        }
                        onClick={() => chooseTemplate(figure._id)}
                        bodyStyle={{ padding: '0px' }}
                        bordered={false}
                        cover={<Image src={figure.image} preview={false} />}>
                        <Tag
                          color={figure._id === templateSelected?._id ? 'cyan' : ''}
                          style={{ width: '100%', textAlign: 'center' }}>
                          {figure.title}
                        </Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Collapse.Panel>
              <Collapse.Panel header='Filas' key='3'>
                <Row gutter={[32, 16]}>
                  {arrayRows.map((figure, index) => (
                    <Col span={4}>
                      <Card
                        style={
                          figure._id === templateSelected?._id
                            ? { outline: '2px solid #50D3C9', outlineOffset: '8px' }
                            : { cursor: 'pointer' }
                        }
                        onClick={() => chooseTemplate(figure._id)}
                        bodyStyle={{ padding: '0px' }}
                        bordered={false}
                        cover={<Image src={figure.image} preview={false} />}>
                        <Tag
                          color={figure._id === templateSelected?._id ? 'cyan' : ''}
                          style={{ width: '100%', textAlign: 'center' }}>
                          {figure.title}
                        </Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Collapse.Panel>
              <Collapse.Panel header='Especiales' key='4'>
                <Row gutter={[32, 16]}>
                  {arraySpecials.map((figure, index) => (
                    <Col span={4}>
                      <Card
                        style={
                          figure._id === templateSelected?._id
                            ? { outline: '2px solid #50D3C9', outlineOffset: '8px' }
                            : { cursor: 'pointer' }
                        }
                        onClick={() => chooseTemplate(figure._id)}
                        bodyStyle={{ padding: '0px' }}
                        bordered={false}
                        cover={<Image src={figure.image} preview={false} />}>
                        <Tag
                          color={figure._id === templateSelected?._id ? 'cyan' : ''}
                          style={{ width: '100%', textAlign: 'center' }}>
                          {figure.title}
                        </Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Col>

          {/* {!!templates?.length &&
            templates.map((template) => (
              <Col key={template._id} span={4}>
                <Card
                  hoverable
                  onClick={() => chooseTemplate(template._id)}
                  style={{ border: template._id === templateSelected?._id ? `1px solid black` : undefined }}>
                  <Image src={template.image} preview={false} />
                  <Typography.Paragraph style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    {template.title}
                  </Typography.Paragraph>
                </Card>
              </Col>
            ))} */}
        </Row>
      </Modal>
    </>
  );
}
