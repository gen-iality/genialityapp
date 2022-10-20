import { Button, Card, Modal, Table, Typography, Form, Select, Input, Space } from 'antd';
import React, { useState } from 'react';
import Header from '../../../../antdComponents/Header';
import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import CommonSelectTypeValue from '../../common/CommonSelectTypeValue';

const { Title, Text } = Typography;

type Props = {
  columns: Array<any>;
  dataSource: Array<any>;
  onChangeImage: (img: object, setImg: void, name: string) => any;

  isVisible?: boolean;
  setValuesData: (values: object) => void;
  valuesData: any;
  setIsVisible?: (isVisible: boolean) => void;
  title?: string;
  formsPropsImg: formsPropsImg[];
  onSave: () => void;
  children: React.ReactNode;
  onCancel: () => void;
};

type formsPropsImg = {
  label: string;
  name: string;
  imgUrl: string;
  setImg: any;
  width: string;
  height: string;
  labelText: string;
};

export default function ValuesTable({
  columns,
  dataSource,
  onChangeImage,
  setValuesData,
  valuesData,
  isVisible,
  setIsVisible,
  formsPropsImg,
  title,
  onSave,
  children,
  onCancel,
}: Props) {
  const [isVisibleModalTable, setIsVisibleModalTable] = useState(false);

  const onChangeVisibility = () => {
    if (setIsVisible) {
      setValuesData({
        ...valuesData,
      });
      setIsVisible(!isVisible);
    } else {
      setValuesData({
        ...valuesData,
      });
      setIsVisibleModalTable(!isVisibleModalTable);
    }
  };

  const onSaveConfig = () => {
    onSave();
    onChangeVisibility();
    setValuesData({
      carton_value: {
        type: '',
        value: '',
      },
      ballot_value: {
        type: '',
        value: '',
      },
      id: '',
    });
  };
  const onChangeType = (type: string, name: string) => {
    setValuesData({
      ...valuesData,
      [name]: {
        value: '',
        type,
      },
    });
  };

  let regexUrlImg = '(http(s?):)([/|.|w|s|-])*.(?:jpg|gif|png)';
  const regex = new RegExp(regexUrlImg);
  const validateUrl = (url: string) => {
    return regex.test(url);
  };

  return (
    <>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', height: '100%' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <Header title={title ? title : 'Valores del Bingo'} addFn={() => onChangeVisibility()} extra={children} />
          <Table size='small' dataSource={dataSource} columns={columns} />
        </Space>
      </Card>
      <Modal
        bodyStyle={{
          textAlign: 'center',
        }}
        visible={setIsVisible ? isVisible : isVisibleModalTable}
        maskClosable={false}
        onOk={() => console.log('OK', valuesData)}
        onCancel={onCancel}
        destroyOnClose={true}
        footer={[
          <Button key='back' onClick={onCancel}>
            Cancelar
          </Button>,
          <Button
            key='submit'
            type='primary'
            disabled={valuesData.carton_value.value === '' || valuesData.ballot_value.value === ''}
            loading={false}
            onClick={onSaveConfig}>
            Aceptar
          </Button>,
        ]}>
        <>
          <Title
            style={{
              marginTop: '20px',
              marginBottom: '20px',
            }}
            level={4}
            type='secondary'>
            Gestionar valores
          </Title>

          {/* <Form.Item label='Tipo'>
            <Select
              value={valuesData.type}
              onChange={(value) => {
                console.log('value', value, valuesData.type);
                setValuesData({
                  ...valuesData,
                  type: value,
                });
              }}>
              <Select.Option value='text'>Texto</Select.Option>
              <Select.Option
                value='img'
                disabled={
                  valuesData.carton_value !== '' ||
                  (valuesData.ballot_value !== '' &&
                    validateUrl(valuesData.carton_value) &&
                    validateUrl(valuesData.ballot_value))
                }>
                Imagen
              </Select.Option>
            </Select>
          </Form.Item> */}

          {formsPropsImg.map((formPropsImg, index) => (
            <Form.Item
              label={valuesData[formPropsImg.name].type === 'image' ? formPropsImg.label : formPropsImg.labelText}
              key={index}
              rules={[{ required: true, message: 'El nombre es requerido' }]}>
              <Card
                headStyle={{ border: 'none' }}
                style={{ borderStyle: 'dashed' }}
                bodyStyle={valuesData[formPropsImg.name].type !== '' ? { padding: '0px 20px 20px 20px' } : {}}
                extra={
                  valuesData[formPropsImg.name].type !== '' && (
                    <Button onClick={() => onChangeType('', formPropsImg.name)}>Cambiar</Button>
                  )
                }>
                {valuesData[formPropsImg.name].type === '' && (
                  <CommonSelectTypeValue onChange={onChangeType} name={formPropsImg.name} />
                )}

                {valuesData[formPropsImg.name].type === 'image' && (
                  <ImageUploaderDragAndDrop
                    imageDataCallBack={(imgeUrl) => onChangeImage(imgeUrl!, formPropsImg.setImg, formPropsImg.name)}
                    imageUrl={valuesData[formPropsImg.name as keyof typeof valuesData].value}
                    width={formPropsImg.width}
                    height={formPropsImg.height}
                  />
                )}
                {valuesData[formPropsImg.name].type === 'text' && (
                  <Input
                    value={valuesData[formPropsImg.name as keyof typeof valuesData].value}
                    onChange={(e) =>
                      setValuesData({
                        ...valuesData,
                        [formPropsImg.name]: {
                          type: 'text',
                          value: e.target.value,
                        },
                      })
                    }
                  />
                )}
              </Card>

              {/*  */}
            </Form.Item>
          ))}
        </>
      </Modal>
    </>
  );
}
