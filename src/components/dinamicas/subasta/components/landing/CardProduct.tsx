import { Card, Empty, Skeleton, Space, Statistic } from 'antd'
import React from 'react'
import { DrawerAuctionProps } from '../../interfaces/auction.interface'
import Meta from 'antd/lib/card/Meta'

export default function CardProduct({auction} : Partial<DrawerAuctionProps>) {
  return (
    <Card
    hoverable={true}
    style={{ height: 450, borderRadius: 20 }}
    headStyle={{ textAlign: 'center' }}
    /* title={auction?.currentProduct ? `Artículo: ${auction?.currentProduct.name}` : 'Sin producto asignado'} */
    cover={
      auction?.currentProduct ? (
        <img
          className='animate__animated animate__flipInX'
          alt='imagen del producto'
          src={auction?.currentProduct.images[0].url}
          style={{ height: '300px', objectFit: 'fill', backgroundColor: '#C4C4C440' }}
        />
      ) : (
        <Empty
          image={<Skeleton.Image className='animate__animated animate__flipInX' />}
          style={{ height: '300px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
          description={'Sin imagen'}
        />
      )
    }>
      <Meta 
        title={auction?.currentProduct ? `Artículo: ${auction?.currentProduct.name}` : 'Sin producto asignado'}
        description={
          <Statistic 
            title="Valor del artículo"
            className='animate__animated animate__flipInX' 
            prefix='$' value={auction?.currentProduct?.price|| 0} />
        } 
      />
    {/* <Space style={{ flexDirection: 'column' ,width: '100%', height: 300, justifyContent: 'center'}}> */}
      {/* {auction?.currentProduct ? (
        <div
          className='animate__animated animate__flipInX'
          onClick={() => {}}
          style={{
            width: 310,
            height: 320,
            backgroundImage: `url(${auction?.currentProduct.images[0].url})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}></div>
      ) : (
        <Skeleton.Image className='animate__animated animate__flipInX' />
      )} */}
    
    {/* </Space> */}
  </Card>
  )
}
