// import './preloader.css';
export const PreloaderApp = () => {
  return (
    <div className='preloaderBg'>
      <div className='preloaderIcon animate__animated animate__flip'>
        <img className='sizeBackground' src={import.meta.env.VITE_IMAGE_FAVICON} />
      </div>
      <div className='preloader2'></div>
    </div>
  );
};
