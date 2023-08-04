import { Card, Empty, Skeleton, Space, Statistic, Typography } from 'antd'
import React from 'react'
import { DrawerAuctionProps } from '../../interfaces/auction.interface'
import Meta from 'antd/lib/card/Meta'
import { Text } from 'react-konva';
import { getCorrectColor } from '@/helpers/utils';

export default function CardProduct({auction} : Partial<DrawerAuctionProps>) {
  return (
    <Card
    bordered={false}
    hoverable={true}
    style={{ height: 550, borderRadius: 20 , backgroundColor: auction?.styles?.cards?.backgroundColor || ''}}
    headStyle={{ textAlign: 'center' }}

    cover={
      auction?.currentProduct ? (
        <img
          className='animate__animated animate__flipInX'
          alt='imagen del producto'
          src={auction?.currentProduct.images[0].url}
          style={{ height: '410px', objectFit: 'fill', backgroundColor: '#C4C4C440', borderRadius: '20px 20px 0 0px' }}
        />
      ) : (
        <Empty
          image={<Skeleton.Image className='animate__animated animate__flipInX' />}
          style={{ height: '410px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
          description={'Sin imagen'}
        />
      )
    }>
      <Meta 
        title={<Typography.Text style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}} strong>{auction?.currentProduct ? auction?.currentProduct.name : 'Sin producto asignado'}</Typography.Text>}
        description={
          <Statistic 
           valueStyle={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}}
            title={<Typography.Text style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}} >Valor del artículo</Typography.Text>}
            className='animate__animated animate__flipInX' 
            prefix='$' 
            value={auction?.currentProduct?.price|| 0} 
            suffix={auction?.currency}
          />
        } 
      />
  </Card>
  )
}
