const WowzaStreamingConfig = ({ streamconfig }) => {
  return (
    <>
      {streamconfig && (
        <>
          <br />
          <br />
          <p>Coloca estos datos en tu plataforma de captura de video para transmitirlo:</p>
          <ul>
            <li>
              <b>RTMP url:</b> {streamconfig.source_connection_information.primary_server}
            </li>
            <li>
              <b>RTMP clave:</b> {streamconfig.source_connection_information.stream_name}
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default WowzaStreamingConfig;
