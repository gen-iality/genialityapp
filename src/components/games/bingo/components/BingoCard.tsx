import { Card, Col, Row, Typography, Grid, Image } from 'antd';
import { forwardRef, useEffect } from 'react';
import {
  gridStyleImage_3x3,
  gridStyleImage_4x4,
  gridStyleImage_5x5,
  gridStyleSelected,
  gridStyleText_3x3,
  gridStyleText_4x4,
  gridStyleText_5x5,
} from '../constants/styleConstants';
import { determineFontStyles } from '../functions';
import { BingoCardInterface, DimensionInterface } from '../interfaces/bingo';

const { useBreakpoint } = Grid;

const BingoCard = forwardRef(
  ({
    bingo,
    arrayDataBingo,
    arrayLocalStorage,
    changeValueLocalStorage,
    getBingoListener,
    setOpenOrClose,
    isPrint,
  }: BingoCardInterface) => {
    useEffect(() => {
      const unSuscribe = getBingoListener();
      return () => {
        unSuscribe();
      };
    }, []);
    const screens = useBreakpoint();

    const dialImage = bingo?.bingo_appearance?.dial_image;
    const dimensions = bingo?.dimensions;

    const renderGrid = (item: any, index: number) => {
      let format = dimensions?.format || '5x5';
      switch (format) {
        case '3x3':
          return (
            <Card.Grid
              hoverable={false}
              style={item?.carton_value.type === 'text' ? gridStyleText_3x3 : gridStyleImage_3x3}
              onClick={() => changeValueLocalStorage(index)}
              key={index}>
              {item?.carton_value.type === 'text' && (
                <Typography.Text
                  style={determineFontStyles(item?.carton_value?.value.toString(), format, screens)}
                  strong>
                  {item?.carton_value?.value}
                </Typography.Text>
              )}
              {item?.carton_value.type === 'image' && (
                <Image
                  width={'100%'}
                  height={'100%'}
                  //   crossOrigin='anonymous'
                  preview={false}
                  fallback={'https://via.placeholder.com/500/?text=Image not found!'}
                  style={{ objectFit: 'contain' }}
                  src={item?.carton_value?.value}
                  alt={item?.carton_value.value.toString()}></Image>
              )}
              <div
                className={
                  arrayLocalStorage[index] === 1
                    ? 'animate__animated animate__bounceIn'
                    : 'animate__animated animate__bounceOut'
                }
                style={gridStyleSelected}>
                {dialImage ? (
                  <img style={{ width: '80%', aspectRatio: '4/4', opacity: '0.8' }} src={dialImage} alt='' />
                ) : (
                  <svg width='207' height='207' viewBox='0 0 207 207' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <rect
                      x='39.5068'
                      y='143.952'
                      width='147'
                      height='34'
                      rx='8'
                      transform='rotate(-45 39.5068 143.952)'
                      fill='#FF4D4F'
                      fill-opacity='0.8'
                    />
                    <rect
                      x='63.5493'
                      y='40.0066'
                      width='147'
                      height='34'
                      rx='8'
                      transform='rotate(45 63.5493 40.0066)'
                      fill='#FF4D4F'
                      fill-opacity='0.8'
                    />
                  </svg>
                )}
              </div>
            </Card.Grid>
          );
        case '4x4':
          return (
            <Card.Grid
              hoverable={false}
              style={item?.carton_value.type === 'text' ? gridStyleText_4x4 : gridStyleImage_4x4}
              onClick={() => changeValueLocalStorage(index)}
              key={index}>
              {item?.carton_value.type === 'text' && (
                <Typography.Text
                  style={determineFontStyles(item?.carton_value?.value.toString(), format, screens)}
                  strong>
                  {item?.carton_value?.value}
                </Typography.Text>
              )}
              {item?.carton_value.type === 'image' && (
                <Image
                  width={'100%'}
                  height={'100%'}
                  preview={false}
                  fallback={'https://via.placeholder.com/500/?text=Image not found!'}
                  //  crossOrigin='anonymous'
                  style={{ objectFit: 'contain' }}
                  src={item?.carton_value?.value}
                  alt={item?.carton_value.value.toString()}></Image>
              )}
              <div
                className={
                  arrayLocalStorage[index] === 1
                    ? 'animate__animated animate__bounceIn'
                    : 'animate__animated animate__bounceOut'
                }
                style={gridStyleSelected}>
                {dialImage ? (
                  <img style={{ width: '80%', aspectRatio: '4/4', opacity: '0.8' }} src={dialImage} alt='' />
                ) : (
                  <svg width='207' height='207' viewBox='0 0 207 207' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <rect
                      x='39.5068'
                      y='143.952'
                      width='147'
                      height='34'
                      rx='8'
                      transform='rotate(-45 39.5068 143.952)'
                      fill='#FF4D4F'
                      fill-opacity='0.8'
                    />
                    <rect
                      x='63.5493'
                      y='40.0066'
                      width='147'
                      height='34'
                      rx='8'
                      transform='rotate(45 63.5493 40.0066)'
                      fill='#FF4D4F'
                      fill-opacity='0.8'
                    />
                  </svg>
                )}
              </div>
            </Card.Grid>
          );
        case '5x5':
          return (
            <Card.Grid
              hoverable={false}
              style={item?.carton_value.type === 'text' ? gridStyleText_5x5 : gridStyleImage_5x5}
              onClick={() => changeValueLocalStorage(index)}
              key={index}>
              {item?.carton_value.type === 'text' && (
                <Typography.Text
                  style={determineFontStyles(item?.carton_value?.value.toString(), format, screens)}
                  strong>
                  {item?.carton_value?.value}
                </Typography.Text>
              )}
              {item?.carton_value.type === 'image' && (
                <Image
                  width={'100%'}
                  height={'100%'}
                  preview={false}
                  fallback={'https://via.placeholder.com/500/?text=Image not found!'}
                  // crossOrigin='anonymous'
                  style={{ objectFit: 'contain' }}
                  src={item?.carton_value?.value}
                  alt={item?.carton_value.value.toString()}></Image>
              )}

              <div
                className={
                  arrayLocalStorage[index] === 1
                    ? 'animate__animated animate__bounceIn'
                    : 'animate__animated animate__bounceOut'
                }
                style={gridStyleSelected}>
                {dialImage ? (
                  <img style={{ width: '80%', aspectRatio: '4/4', opacity: '0.8' }} src={dialImage} alt='' />
                ) : (
                  <svg width='207' height='207' viewBox='0 0 207 207' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <rect
                      x='39.5068'
                      y='143.952'
                      width='147'
                      height='34'
                      rx='8'
                      transform='rotate(-45 39.5068 143.952)'
                      fill='#FF4D4F'
                      fill-opacity='0.8'
                    />
                    <rect
                      x='63.5493'
                      y='40.0066'
                      width='147'
                      height='34'
                      rx='8'
                      transform='rotate(45 63.5493 40.0066)'
                      fill='#FF4D4F'
                      fill-opacity='0.8'
                    />
                  </svg>
                )}
              </div>
            </Card.Grid>
          );

        default:
          break;
      }
    };

    return (
      <Card bordered={false} style={{ backgroundColor: 'transparent' }} bodyStyle={{ padding: '0px' }}>
        {
          <Col span={24}>
            <img
              style={{
                width: '100%',
                objectFit: 'cover',
                borderRadius: '20px 20px 0px 0px',
                height: '80px',
              }}
              src={bingo?.bingo_appearance?.banner}
            />
          </Col>
        }

        <Col span={24}>
          <Row align='middle' justify='center'>
            <Card
              bordered={false}
              bodyStyle={{
                padding: screens.xs ? '10px' : '24px',
              }}
              style={{
                width: '100%',
                backgroundColor: bingo?.bingo_appearance?.background_color
                  ? bingo.bingo_appearance?.background_color
                  : '#333453',
                backgroundImage: `url(${bingo?.bingo_appearance?.background_image})`,
                borderRadius: '0px',
              }}>
              <Row gutter={[8, 8]} justify='center' align='middle'>
                {arrayDataBingo?.map((item, index) => renderGrid(item, index))}
              </Row>
            </Card>
          </Row>
        </Col>
        {
          <Col span={24}>
            <img
              style={{
                width: '100%',
                objectFit: 'cover',
                borderRadius: '0px 0px 20px 20px',
                height: '60px',
              }}
              src={bingo?.bingo_appearance?.footer}
            />
          </Col>
        }
      </Card>
    );
  }
);
export default BingoCard;
