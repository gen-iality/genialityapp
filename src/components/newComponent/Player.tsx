import ReactPlayer from 'react-player';

interface propsOptions {
  url: string;
}

const Player = ({ url }: propsOptions) => {
  return <div className="mediaplayer">
    <ReactPlayer 
      url={url}
      style={{ objectFit: 'cover' }}
      width='100%'
      height='100%'
      controls
    />
  </div>;
};

export default Player;
