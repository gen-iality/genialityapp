import React, { useState } from 'react';
import { Col, Row, Form, Button, Card, Space } from 'antd';
import { AuctionStyles, GeneralAuctionProps } from '../../interfaces/auction.interface';
import { saveAuctioFirebase } from '../../services/Execute.service';
import InputColor from '@/components/games/bingo/components/InputColor';
import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { DispatchMessageService } from '@/context/MessageService';
import { SaveOutlined } from '@ant-design/icons';

export default function ConfigAppearance({ auction, eventId }: GeneralAuctionProps) {
  const [configStyle, setConfigStyle] = useState<AuctionStyles>({
    general: auction.styles?.general || {},
    cards: auction.styles?.cards || {},
  });

  const onOk = async () => {
    if (eventId) {
      const response = await saveAuctioFirebase(eventId, { ...auction, styles: configStyle });
      if(response){
        DispatchMessageService({ msj: 'Se guardó correctamente', action: 'show' ,type: 'success'});
      }else {
        DispatchMessageService({ msj: 'Fallo al guardar la data', action: 'show',type: 'error' });
      }
    }
  };

  return (
    <div style={{padding: 15}}>
      <Row justify='end' style={{ paddingBottom: 10 }}>
        <Button onClick={onOk} type='primary' icon={<SaveOutlined />}>
          Guardar
        </Button>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card hoverable style={{cursor: 'auto', maxHeight: '60vh', height: '100%', overflowY: 'auto'}} className='desplazar'>
            <Space direction='vertical'>
              <InputColor            
                color={configStyle.general?.backgroundColor ?? '#FFFFFF'}
                onChange={(color: any) => {
                  setConfigStyle({ ...configStyle, general: { ...configStyle.general, backgroundColor: color.hex } });
                }}
              />
              <InputColor
                labelColorName='Color de las cards'
                color={configStyle.cards?.backgroundColor ?? '#FFFFFF'}
                onChange={(color: any) => {
                  setConfigStyle({ ...configStyle, cards: { ...configStyle.cards, backgroundColor: color.hex } });
                }}
              />
            </Space>
          </Card>
        </Col>
        <Col span={16}>
          <Card hoverable style={{cursor: 'auto', maxHeight: '60vh', height: '100%', overflowY: 'auto'}} className='desplazar'>
            <Form.Item label={'Imagen de Fondo'} name={'Imagen de Fondo'} labelCol={{span: 24}}>
              <ImageUploaderDragAndDrop
                imageDataCallBack={(imgUrl) => {
                  if (imgUrl)
                    setConfigStyle({ ...configStyle, general: { ...configStyle.general, backgroundImage: imgUrl } });
                }}
                onRemove={() => {
                  setConfigStyle({ ...configStyle, general: { ...configStyle.general, backgroundImage: '' } });
                }}
                imageUrl={configStyle.general?.backgroundImage ?? ''}
                width={100}
                height={100}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
