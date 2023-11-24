import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Row, Col, Form, Card } from 'antd';
import generateAppearance from '../functions/generateAppearance';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { InputColor2 } from '@/components/ui/InputColor2';
const APPEARANCE_ITEMS = generateAppearance();

export default function AppearanceSettings() {
  const { onChangeAppearance, millonaire } = useMillonaireCMS();
  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      {/* <Col span={24}>
        <InputColor
          color={millonaire?.appearance?.background_color || '#6020DA'}
          onChange={(color: any) => onChangeAppearance('background_color', color.hex)}
        />
      </Col> */}

      <Col >
        <Card hoverable>
          <Form.Item
            label={'Color de fondo'}
            name='background_color'
            initialValue={millonaire?.appearance?.background_color || '#6020DA'}>
            <InputColor2
              color={millonaire?.appearance?.background_color || '#6020DA'}
              onChange={(color: any) => onChangeAppearance('background_color', color.hex)}
            />
          </Form.Item>
        </Card>
      </Col>
      <Col >
        <Card hoverable>
          <Form.Item
            label={'Color primario'}
            name='primary_color'
            initialValue={millonaire?.appearance?.primary_color || '#6020DA'}>
            <InputColor2
              color={millonaire?.appearance?.primary_color || '#6020DA'}
              onChange={(color: any) => onChangeAppearance('primary_color', color.hex)}
            />
          </Form.Item>
        </Card>
      </Col>

      {APPEARANCE_ITEMS.map((item: any) => (
        <Col span={24} key={item.name}>
          <Form.Item label={item.label} name={item.name}>
            <ImageUploaderDragAndDrop
              imageDataCallBack={(imgUrl) => onChangeAppearance(item.name, imgUrl)}
              imageUrl={millonaire.appearance[item.name as keyof typeof millonaire.appearance]}
              width={item.width}
              height={item.height}
            />
          </Form.Item>
        </Col>
      ))}
    </Row>
  );
}
