import { Card, Empty, Skeleton, Statistic, Typography, Grid, Row } from 'antd'
import React from 'react'
import { CardProductProps } from '../../interfaces/auction.interface'
import { getCorrectColor } from '@/helpers/utils';

const {useBreakpoint} = Grid;

export default function CardProduct({auction, currentPrice} : Partial<CardProductProps>) {
  const screens = useBreakpoint();

  return (
    <>
      <Card
        bordered={false}
        hoverable={false}
        style={{ height: screens.xs ? 400 : 550, borderRadius: 20 , backgroundColor: auction?.styles?.cards?.backgroundColor || ''}}
        headStyle={{ textAlign: 'center' }}

        cover={
          auction?.currentProduct ? (
            <>
              {screens.xs ? 
                <Row justify='center'
                  className='animate__animated animate__flipInX'
                  style={{
                    backgroundColor: '#C4C4C4', 
                    borderRadius: '20px 20px 0 0px' 
                  }}
                >
                  <img
                    alt='imagen del producto'
                    src={auction?.currentProduct.images[0].url}
                    style={{ 
                      height: '260px',
                      objectFit: 'fill', 
                    }}
                  />
                </Row>
                :
                <img
                  alt='imagen del producto'
                  src={auction?.currentProduct.images[0].url}
                  style={{ 
                    height: '410px',
                    objectFit: 'fill', 
                    backgroundColor: '#C4C4C440', 
                    borderRadius: '20px 20px 0 0px'
                  }}
                />
              }
            </>
          ) : (
            <Empty
              image={<Skeleton.Image className='animate__animated animate__flipInX' />}
              style={{ height: screens.xs ? '260px' : '410px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
              description={<div style={{color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}}>Sin imagen</div>}
            />
          )
        }>
          <Card.Meta 
            title={<Typography.Text style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}} strong>{auction?.currentProduct ? auction?.currentProduct.name : 'Sin producto asignado'}</Typography.Text>}
            description={
              <Statistic 
              valueStyle={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}}
                title={<Typography.Text style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}} >Valor del artículo</Typography.Text>}
                className='animate__animated animate__flipInX' 
                prefix='$' 
                value={currentPrice ?? auction?.currentProduct?.price} 
                suffix={auction?.currency}
              />
            } 
          />
      </Card>
    </>
  )
}
