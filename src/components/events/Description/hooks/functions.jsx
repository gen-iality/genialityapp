import { Button, Image } from 'antd';
import ReactPlayer from 'react-player';

export const renderTypeComponent = (type, value, hiperVinculo = '') => {
  switch (type) {
    case 'image':
      return (
        <>
          {hiperVinculo.length > 0 ? (
            <a target="_blank" href={hiperVinculo ? hiperVinculo : ''}>
              <Image epreview={false} preview={false} src={value} width='100%' style={{ borderRadius: '10px' }} />
            </a>
          ) : (
            <Image epreview={false} src={value} width='100%' style={{ borderRadius: '10px' }} />
          )}
        </>
      );
    case 'text':
      return <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: value }} />;
    case 'video':
      return (
        <ReactPlayer
          controls
          width='100%'
          height={null}
          style={{ aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden' }}
          url={value}
        />
      );
    default:
      return <div></div>;
  }
};
