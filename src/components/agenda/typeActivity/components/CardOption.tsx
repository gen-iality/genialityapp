import React from 'react';
import { Card } from 'antd';

interface PropsOptions {
  title: string;
  description?: string;
  image: string;
}

const CardOption = ({ title, description, image }: PropsOptions) => {
  return (
    <Card
      style={{ width: '100%' }}
      cover={
        <img
          alt='example'
          src={image || 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg'}
          height={150}
        />
      }>
      <Card.Meta title={title} description={description} style={{ textAlign: 'center' }} />
    </Card>
  );
};

export default CardOption;
