import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button } from 'antd';
import { AuctionStyles, ConfigStyleProps } from '../../interfaces/auction.interface';
import { saveAuctioFirebase } from '../../services/Execute.service';
import InputColor from '@/components/games/bingo/components/InputColor';
import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { DispatchMessageService } from '@/context/MessageService';

export default function ConfigAppearance({ auction, eventId }: ConfigStyleProps) {
  const [configStyle, setConfigStyle] = useState<AuctionStyles>({
    general: auction.styles?.general,
    cards: auction.styles?.cards,
  });

  const onOk = async () => {
    if (eventId) {
      const response = await saveAuctioFirebase(eventId, { ...auction, styles: configStyle });
      if(response){
        DispatchMessageService({ msj: 'Se guardo correctamente', action: 'show' ,type: 'success'});
      }else {
        DispatchMessageService({ msj: 'Fallo al guardar la data', action: 'show',type: 'error' });
      }
    }
  };

  useEffect(() => {
    console.log(configStyle);
  }, [configStyle]);

  return (
    <Row gutter={[16, 16]} style={{ display: 'flex' }}>
      <Button  onClick={onOk} type='primary' style={{ position: 'absolute', right: 10, borderRadius: 5 }}>
        Guardar
      </Button>
      <Row gutter={[16, 16]} style={{ padding: '40px' }}>
        <Row >
          <InputColor
          
            color={configStyle.general?.backgroundColor ?? '#FFFFFF'}
            onChange={(color: any) => {
              setConfigStyle({ ...configStyle, general: { ...configStyle.general, backgroundColor: color.hex } });
            }}
          />
           <InputColor
          labelColorName='Color de las Cards'
            color={configStyle.cards?.backgroundColor ?? '#FFFFFF'}
            onChange={(color: any) => {
              setConfigStyle({ ...configStyle, cards: { ...configStyle.cards, backgroundColor: color.hex } });
            }}
          />
        </Row>


        <Col span={8} key={'fondo'}>
          <Form.Item label={'Imagen de Fondo'} name={'Imagen de Fondo'}>
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
        </Col>
      </Row>
    </Row>
  );
}
