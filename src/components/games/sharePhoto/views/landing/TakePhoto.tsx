import { Button, Card, Col, Grid, Image, Input, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';
import { uploadImageData } from '@/Utilities/uploadImageData';
import CameraIcon from '@2fd/ant-design-icons/lib/Camera';
import CameraFlipOutlineIcon from '@2fd/ant-design-icons/lib/CameraFlipOutline';
import DeleteForeverIcon from '@2fd/ant-design-icons/lib/DeleteForever';
import CheckBoldIcon from '@2fd/ant-design-icons/lib/CheckBold';
const { useBreakpoint } = Grid;

export default function TakePhoto() {
  const { goTo, setImageUploaded } = useSharePhotoInLanding();
  const [photo, setPhoto] = useState('');
  const [deviceSelected, setDeviceSeleted] = useState<number>(0);
  const [deviceId, setDeviceId] = useState<MediaDeviceInfo | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const screens = useBreakpoint();

  const sizeBtnPrimary = screens.xs ? '60px' : '80px';
  const sizeIconPrimary = screens.xs ? '30px' : '40px';

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      const cameras = mediaDevices.filter(({ kind }) => kind === 'videoinput');
      setDevices(cameras);
      setDeviceId(cameras[deviceSelected]);
    },
    [setDevices]
  );

  const handleDevice = () => {
    const index = deviceSelected < devices.length - 1 ? deviceSelected + 1 : 0;
    setDeviceSeleted(index);
    setDeviceId(devices[index]);
  };

  const dataURIToFile = (dataURI: string, name: string) => {
    const byteString = window.atob(dataURI.split(',')[1]);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], name);
  };

  const handleUploadImage = async () => {
    const file = dataURIToFile(photo, 'my-photo-from-camera');
    const photoUrl = await uploadImageData(file);
    setImageUploaded(photoUrl);
    goTo('createPost');
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>
      <Button onClick={() => goTo('chooseAction')}>Atras</Button>
      <Row gutter={[0, 0]} justify='center' align='middle' style={{ height: '100%' }}>
        <Col xs={24} style={{ display: screens.xs ? 'block' : 'grid', placeContent: 'center' }}>
          {!photo.length ? (
            deviceId && (
              <Card style={{ height: '100%' }} bordered={false} bodyStyle={{ padding: '0px' }}>
                <Webcam
                  style={{ backgroundColor: '#000000', aspectRatio: '10 / 16' }}
                  muted={true}
                  videoConstraints={{
                    deviceId: deviceId?.deviceId,
                    aspectRatio: 10 / 16,
                  }}
                  width={screens.xs ? '100%' : 400}
                  mirrored={true}>
                  {({ getScreenshot }) => (
                    <Button
                      style={{
                        width: sizeBtnPrimary,
                        height: sizeBtnPrimary,
                        position: 'absolute',
                        bottom: '1%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backdropFilter: 'blur(2px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      }}
                      onClick={() => {
                        const photo = getScreenshot();
                        if (photo) {
                          console.log(photo);
                          setPhoto(photo);
                        }
                      }}
                      shape='circle'
                      icon={<CameraIcon style={{ fontSize: sizeIconPrimary }} />}
                    />
                  )}
                </Webcam>
                <Button
                  style={{
                    width: screens.xs ? '40px' : '60px',
                    height: screens.xs ? '40px' : '60px',
                    position: 'absolute',
                    bottom: '4%',
                    left: '25%',
                    transform: 'translate(-50%, -50%)',
                    backdropFilter: 'blur(2px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                  shape='circle'
                  onClick={handleDevice}
                  icon={<CameraFlipOutlineIcon style={{ fontSize: screens.xs ? '20px' : '30px' }} />}
                />
              </Card>
            )
          ) : (
            <Card
              cover={<Image src={photo} preview={false} />}
              style={{ height: '100%' }}
              bordered={false}
              bodyStyle={{ padding: '0px' }}>
              <Button
                style={{
                  width: sizeBtnPrimary,
                  height: sizeBtnPrimary,
                  position: 'absolute',
                  bottom: '2%',
                  left: '80%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#52C41A',
                }}
                type='text'
                shape='circle'
                onClick={handleUploadImage}
                icon={<CheckBoldIcon style={{ fontSize: sizeIconPrimary, color: '#FFFFFF' }} />}
              />

              <Button
                style={{
                  width: sizeBtnPrimary,
                  height: sizeBtnPrimary,
                  position: 'absolute',
                  bottom: '2%',
                  left: '20%',
                  transform: 'translate(-50%, -50%)',
                }}
                type='primary'
                danger
                shape='circle'
                onClick={() => setPhoto('')}
                icon={<DeleteForeverIcon style={{ fontSize: sizeIconPrimary }} />}
              />
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
}
