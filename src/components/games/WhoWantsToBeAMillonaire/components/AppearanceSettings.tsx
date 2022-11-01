import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Row, Col, Form } from 'antd';
import InputColor from '../../bingo/components/InputColor';
import generateAppearance from '../functions/generateAppearance';

const APPEARANCE_ITEMS = generateAppearance();

export default function AppearanceSettings() {
  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col span={24}>
        <InputColor color='#33234f' onChange={(color) => console.log('Change color', color)} />
      </Col>
      {APPEARANCE_ITEMS.map((item: any) => (
        <Col span={8} key={item.name}>
          <Form.Item label={item.label} name={item.name}>
            <ImageUploaderDragAndDrop
              imageDataCallBack={(imgUrl) => console.log('change console', imgUrl)}
              imageUrl=''
              width={item.width}
              height={item.height}
            />
          </Form.Item>
        </Col>
      ))}
    </Row>
  );
}
