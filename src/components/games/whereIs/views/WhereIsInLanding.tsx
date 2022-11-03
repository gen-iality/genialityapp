import { useState, useEffect } from 'react';
import DrawerWhereIs from '../components/DrawerWhereIs';
import { Stage, Layer, Star, Circle, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { DispatchMessageService } from '@/context/MessageService';
import { Button, Col, Image, Row, Space, Typography } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

const bg = {
  image:
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/temporal%2Fmapa-Piscilago-optimizado.jpg?alt=media&token=358e0148-7226-4535-946b-a81360e0c93c',
  width: 1920,
  height: 1233,
};

const INITIAL_POINTS: Point[] = [
  {
    id: 1,
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/temporal%2Fproteccion.png?alt=media&token=6904675f-83e2-4c37-859a-c59d28545a5a',
    x: 1420,
    y: 370,
    isDragging: false,
    stroke: undefined,
    isFound: false,
    radius: 50,
  },
  {
    id: 2,
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/temporal%2Fsomos.png?alt=media&token=92bc51f3-9a3b-4137-85e2-a12c206351e0',
    x: 890,
    y: 275,
    isDragging: false,
    stroke: undefined,
    isFound: false,
    radius: 50,
  },
  {
    id: 3,
    image:
      'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/temporal%2Ffec-isologo.png?alt=media&token=642ca500-d749-4961-820a-d99008c3c783',
    x: 1043,
    y: 495,
    isDragging: false,
    stroke: undefined,
    isFound: false,
    radius: 50,
  },
];

const INITIAL_LIFES = 5;

interface Point {
  id: number;
  image: string;
  x: number;
  y: number;
  isDragging: boolean;
  stroke: undefined | string;
  isFound: boolean;
  radius: number;
}

interface FooterProps {
  points: Point[];
}

// interface Props {
//   timeoutInSeconds: number;
// }

export default function WhereisInLanding() {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS);
  const [lifes, setLifes] = useState<number>(INITIAL_LIFES);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  //const [timeLeftInSeconds, setTimeLeftInSeconds] = useState<number>(timeoutInSeconds);

  const addPoint = (id: number) => {
    if (!lifes) return;
    DispatchMessageService({ type: 'success', action: 'show', msj: 'Yujuuu!' });

    const newPoint = points.find((point) => point.id === id);
    if (!newPoint) return;
    setPoints((prev) =>
      [...prev.filter((point) => point.id !== id), { ...newPoint, stroke: 'red', isFound: true }].sort(
        (a, b) => a.id - b.id
      )
    );
  };

  const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (isMobile) return;
    if (!lifes) return;
    const id = Number(e.target.id());
    addPoint(id);
    e.cancelBubble = true;
  };

  const handleOutsideClick = (e: any) => {
    if (!lifes) return;
    if (isMobile) return;
    DispatchMessageService({ type: 'error', action: 'show', msj: 'Sorry!' });
    e.cancelBubble = true;
    setLifes((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleTouchStart = (e: any) => {
    setHasScrolled(false);
    e.cancelBubble = true;
  };

  const handleTouchEnd = (e: any) => {
    const id = Number(e.target.id());
    addPoint(id);
    e.cancelBubble = true;
  };

  const handleTouchEndOutside = (e: any) => {
    if (hasScrolled) return;
    DispatchMessageService({ type: 'error', action: 'show', msj: 'Sorry!' });
    setLifes((prev) => (prev > 0 ? prev - 1 : 0));
    e.cancelBubble = true;
  };

  const handleTouchMove = (e: any) => {
    setHasScrolled(true);
    e.cancelBubble = true;
  };

  // const handleOutsideTouch = () => {};

  const handleRestart = () => {
    setPoints(INITIAL_POINTS);
    setLifes(INITIAL_LIFES);
  };

  const Footer = () => {
    return (
      <Row align='middle' justify='center' gutter={[50, 0]}>
        {points.map((point) => (
          <Col key={point.id} style={{ border: point.isFound ? '2px solid red' : '', borderRadius: 10 }}>
            <Image
              src={point.image}
              height={isMobile ? 50 : 80}
              preview={false}
              style={{ filter: point.isFound ? 'grayscale(100%)' : '' }}
            />
          </Col>
        ))}
      </Row>
    );
  };

  const Lifes = () => {
    return (
      <Space>
        {Array.from({ length: INITIAL_LIFES })
          .map((e, i) => i)
          .sort((a, b) => b - a)
          .map((life) => (
            <HeartFilled key={`life-${life}`} style={{ color: life < lifes ? 'red' : 'gray' }} />
          ))}
      </Space>
    );
  };

  return (
    <DrawerWhereIs lifes={<Lifes />} footer={<Footer />}>
      <Button onClick={handleRestart}>Restart</Button>
      <div style={{ margin: 'auto 0', height: 'auto', width: '100%' }}>
        <div style={{ overflow: 'auto' }}>
          <Stage
            width={bg.width}
            height={bg.height}
            style={{
              height: bg.height,
              width: bg.width,
              backgroundImage: `url("${bg.image}")`,
              backgroundRepeat: 'no-repeat',
            }}
            onClick={handleOutsideClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEndOutside}>
            <Layer>
              {points.map((point) => (
                <Circle
                  key={point.id}
                  id={point.id.toString()}
                  x={point.x}
                  y={point.y}
                  fill='transparent'
                  stroke={point.stroke}
                  radius={20}
                  opacity={0.8}
                  scaleX={point.isDragging ? 1.2 : 1}
                  scaleY={point.isDragging ? 1.2 : 1}
                  onClick={handleClick}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </DrawerWhereIs>
  );
}
