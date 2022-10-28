import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Button, Col, Row, Grid } from 'antd';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

const { useBreakpoint } = Grid;

export default function ImportPhoto() {
  const { goTo, imageUploaded, setImageUploaded } = useSharePhotoInLanding();
  const screens = useBreakpoint();

  const paddingDinamic = screens.xs ? '10px' : '80px';
  return (
    <>
      {/*  <Button onClick={() => goTo('chooseAction')}>Atras</Button> */}
      <Row
        gutter={[0, 0]}
        justify='center'
        align='middle'
        style={{ height: '100%', paddingRight: paddingDinamic, paddingLeft: paddingDinamic }}>
        <Col span={24}>
          <ImageUploaderDragAndDrop
            imageDataCallBack={(imageUrl) => {
              if (typeof imageUrl === 'string') {
                setImageUploaded(imageUrl);
              }
            }}
            imageUrl={imageUploaded ?? ''}
            width={1080}
            height={1080}
          />
          {imageUploaded && (
            <Button type='primary' style={{ width: '100%' }} onClick={() => goTo('createPost')}>
              Crear Publicación
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}
