;
import { Card, Badge } from 'antd';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';

interface PropsOptions {
  id: string;
  title: string;
  description?: string;
  image: string;
}

const CardOption = ({ id, title, description, image }: PropsOptions) => {
  const { selectOption, selectedKey } = useTypeActivity();
  const borderStyles: {} =
    id === selectedKey
      ? {
        borderColor: '#1dddb7ad',
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
    <Badge.Ribbon text='Selected' color={'#1dddb7ad'} style={badgeStyle}>
      <div onClick={() => selectOption(id)} style={borderStyles}>
        <Card
          hoverable={true}
          style={{ width: '100%' }}
          cover={
            <img
              alt='example'
              src={
                image || 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg'
              }
              height={150}
            />
          }>
          <Card.Meta title={title} description={description} style={{ textAlign: 'center' }} />
        </Card>
      </div>
    </Badge.Ribbon>
  );
};

export default CardOption;
