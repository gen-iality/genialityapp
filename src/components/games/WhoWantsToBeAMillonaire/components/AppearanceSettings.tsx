import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Row, Col, Form } from 'antd';
import InputColor from '../../bingo/components/InputColor';
import generateAppearance from '../functions/generateAppearance';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const APPEARANCE_ITEMS = generateAppearance();

export default function AppearanceSettings() {
  const { onChangeAppearance, millonaire } = useMillonaireCMS();
  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col span={24}>
        <InputColor
          color={millonaire?.appearance?.background_color || '#6020DA'}
          onChange={(color: any) => onChangeAppearance('background_color', color.hex)}
        />
      </Col>
      {APPEARANCE_ITEMS.map((item: any) => (
        <Col span={8} key={item.name}>
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
