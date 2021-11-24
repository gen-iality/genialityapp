import axios from 'axios/index';

const wowzaCLient = axios.create({
  baseURL: 'https://api.cloud.wowza.com/api/v1.7/',
  //timeout: 1000,
  headers: {
    'wsc-api-key': 'r7x0RKTg0Ttlkbtsv7iK0RGhU6rUIeHOlkI7bJ0rBGnWAKchS7aCudBEwiMw3416',
    'wsc-access-key': 'Vqi4r2JpRUfK1B6RUjfeNQ2sKS9QZ9Hwaadx32lXD9kcLxWlruYdEXWXDOQ23310',
  },
});

const stream_config = {
  live_stream: {
    aspect_ratio_height: 720,
    aspect_ratio_width: 1280,
    billing_mode: 'pay_as_you_go',
    broadcast_location: 'us_west_california',
    delivery_method: 'push',
    disable_authentication: true,
    //encoder: 'other_webrtc',
    encoder: 'other_rtmp',
    name: 'MyLiveStream',
    transcoder_type: 'transcoded',
    target_delivery_protocol: 'hls-https',
    low_latency: true,
  },
};

const createLiveStream = async (config) => {
  const res = await wowzaCLient.post('live_streams/', stream_config);

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const getLiveStreamConfig = async (stream_id) => {
  const res = await wowzaCLient.get('live_streams/' + stream_id);

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const getLiveStreamStatus = async (stream_id) => {
  const res = await wowzaCLient.get('live_streams/' + stream_id + '/state');

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const getLiveStreamStats = async (stream_id) => {
  const res = await wowzaCLient.get('live_streams/' + stream_id + '/stats');

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const ResetLiveStream = async (stream_id) => {
  const res = await wowzaCLient.put('live_streams/' + stream_id + '/reset');

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const startLiveStream = async (stream_id) => {
  const res = await wowzaCLient.put('live_streams/' + stream_id + '/start');

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const stopLiveStream = async (stream_id) => {
  const res = await wowzaCLient.put('live_streams/' + stream_id + '/stop');

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

export {
  getLiveStreamConfig,
  getLiveStreamStatus,
  getLiveStreamStats,
  ResetLiveStream,
  startLiveStream,
  stopLiveStream,
  createLiveStream,
};
