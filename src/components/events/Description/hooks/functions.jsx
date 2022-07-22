import { Button, Image } from "antd";
import ReactPlayer from "react-player";

export const renderTypeComponent = 
    (type, value) => {
      switch (type) {
        case 'image':
          return (
            <Image
              preview={{
                mask: (
                  <Button size='large' type='primary'>
                    Ver imagen completa
                  </Button>
                ),
              }}
              src={value}
              style={{ objectFit: 'contain' }}
              width='100%'
              height='250px'
            />
          );
        case 'text':
          return <div dangerouslySetInnerHTML={{ __html: value }} />;
        case 'video':
          return <ReactPlayer controls width={'100%'} height={'350'} style={{}} url={value} />;
        default:
          return <div></div>;
      }
    };