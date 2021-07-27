import React from 'react';
import { Tooltip, Card, Image, Typography, Badge, Button } from 'antd';
import ShoppingOutlineIcon from '@2fd/ant-design-icons/lib/ShoppingOutline';
import HandshakeOutlineIcon from '@2fd/ant-design-icons/lib/HandshakeOutline';
import { ShoppingCartOutlined } from '@ant-design/icons';

function products(props) {
  const { Paragraph } = Typography;

  return (
    <>
      <Card
        actions={[
          <Tooltip key='comprar' title='Comprar'>
            <a href={props.url} target='__blank'>
              <ShoppingCartOutlined style={{ fontSize: '24px' }} key='comprar' />
            </a>
          </Tooltip>,
        ]}
        style={{ borderRadius: '10px' }}
        bodyStyle={{ padding: '10px' }}
        cover={
          <Image
            height={220}
            alt={'Imagen-item-' + props.title.replace(/\s+/g, '-')}
            src={props.imgProduct === '' ? 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Item' : props.imgProduct}
          />
        }
        className='product-company'>
        <Card.Meta
          avatar={
            props.etiqueta && props.etiqueta === 'Producto' ? (
              <Tooltip title='Producto'>
                <ShoppingOutlineIcon style={{ fontSize: '18px' }} />
              </Tooltip>
            ) : (
              <Tooltip title='Servicio'>
                <HandshakeOutlineIcon style={{ fontSize: '18px' }} />
              </Tooltip>
            )
          }
          title={props.title}
          description={
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: <Badge count={'Ver más'}></Badge> }}>
              <p
                dangerouslySetInnerHTML={{
                  __html: props.description && props.description,
                }}></p>
            </Paragraph>
          }
        />
      </Card>
    </>
  );
}
export default products;
