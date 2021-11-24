export default WowzaStreamingConfig = ({ streamconfig }) => {
  return (
    <>
      {streamconfig && (
        <>
          <br />
          <br />
          <p>Coloca estos datos en tu plataforma de captura de video para transmitirlo:</p>
          <ul>
            {/* <li>
                      <b>player_embed_code: </b>
                      {streamconfig.player_embed_code}
                    </li>
                    <li>
                      <b>player_hls_playback_url: </b>
                      {streamconfig.player_hls_playback_url}
                    </li> */}

            <li>
              <b>RTMP url:</b> {streamconfig.source_connection_information.primary_server}
            </li>
            <li>
              <b>RTMP clave:</b> {streamconfig.source_connection_information.stream_name}
            </li>
            {/* <li>
                      <b>source: </b>
                      {streamconfig.encoder}
                    </li> */}
            {/* <li>
                      <b>all:</b> {JSON.stringify(streamconfig)}
                    </li> */}
          </ul>
        </>
      )}
    </>
  );
};
