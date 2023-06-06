import { FunctionComponent } from 'react'

interface IFeriaBannerProps {
  image: any
}

const FeriaBanner: FunctionComponent<IFeriaBannerProps> = (props) => {
  return (
    <div className="container-bannerEvent">
      <img
        src={props.image}
        style={{
          width: '100%',
          backgroundColor: '#F2F2F2',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

export default FeriaBanner
