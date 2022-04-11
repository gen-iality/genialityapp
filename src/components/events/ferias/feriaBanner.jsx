function feriaBanner(props) {
  // const imageBanner = props.imagen
  return (
    <div className='container-bannerEvent'>
      <img
        src={props.imagen}
        style={{
          width: '100%',
          backgroundColor: '#F2F2F2',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

export default feriaBanner;
