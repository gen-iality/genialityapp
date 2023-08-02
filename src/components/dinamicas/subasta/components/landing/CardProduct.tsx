import { Card, Empty, Skeleton, Space, Statistic, Typography } from 'antd'
import React from 'react'
import { DrawerAuctionProps } from '../../interfaces/auction.interface'
import Meta from 'antd/lib/card/Meta'

export default function CardProduct({auction} : Partial<DrawerAuctionProps>) {
  return (
    <Card
    hoverable={true}
    style={{ height: 550, borderRadius: 20 }}
    headStyle={{ textAlign: 'center' }}
    /* title={auction?.currentProduct ? `Artículo: ${auction?.currentProduct.name}` : 'Sin producto asignado'} */
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
        title={<Typography.Text strong>{auction?.currentProduct ? auction?.currentProduct.name : 'Sin producto asignado'}</Typography.Text>}
        description={
          <Statistic 
            title="Valor del artículo"
            className='animate__animated animate__flipInX' 
            prefix='$' value={auction?.currentProduct?.price|| 0} 
            suffix={auction?.currency}
          />
        } 
      />
  </Card>
  )
}
