import { Card, Skeleton, Space, Statistic } from 'antd'
import React from 'react'
import { Auction, DrawerAuctionProps } from '../../interfaces/auction.interface'
import Meta from 'antd/lib/card/Meta'

export default function ImageProduct({auction} : Omit<DrawerAuctionProps,"setOpenOrClose" | "openOrClose" >) {
  return (
    <Card
    hoverable={true}
    style={{ height: 450, borderRadius: 20 }}
    headStyle={{ textAlign: 'center' }}
    title={auction?.currentProduct ? `Articulo: ${auction?.currentProduct.name}` : 'Sin producto asignado'}>
    <Space style={{ flexDirection: 'column' ,width: '100%', height: 300, justifyContent: 'center'}}>
      {auction?.currentProduct ? (
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
      )}
    <Meta title="Valor del  articulo" description={<Statistic prefix='$' value={auction.currentProduct?.priceStart} />} />
    </Space>
  </Card>
  )
}
