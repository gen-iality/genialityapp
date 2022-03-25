import { Card, Badge, Typography, Skeleton } from 'antd';
import { useState } from 'react';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';

interface PropsOptions {
  id: string;
  title: string;
  description?: string;
  image: string;
}

const CardOption = ({ id, title, description, image }: PropsOptions) => {
  const [loading, setloading] = useState(true)
  const { selectOption, selectedKey } = useTypeActivity();
  const borderStyles: {} =
    id === selectedKey
      ? {
        borderColor: '#2593FC',
        borderStyle: 'solid',
        borderWidth: '4px',
        borderRadius: '6px',
      }
      : {};
  const badgeStyle: {} =
    id !== selectedKey
      ? {
        display: 'none',
      }
      : {};

  return (
    <Badge.Ribbon text='Selected' color={'#2593FC'} style={badgeStyle}>
      <div onClick={() => selectOption(id)} style={borderStyles}>
        <Card
          id='cardOption'
          loading={loading}
          hoverable={true}
          style={{ width: '100%', borderRadius: '8px' }}
          cover={
            <img
              onLoad={() => setloading(false)}
              style={{ objectFit: 'cover', backgroundColor: '#F2F2F2' }}
              alt={title.replace(/ /g, "_") + '-Image'}
              src={
                image || 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg'
              }
              height={150}
            />
          }>
          <Card.Meta title={title} description={<Typography.Paragraph type='secondary'>{description}</Typography.Paragraph>} style={{ textAlign: 'center' }} />
        </Card>
      </div>
    </Badge.Ribbon>
  );
};

export default CardOption;
