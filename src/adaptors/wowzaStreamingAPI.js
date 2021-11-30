import axios from 'axios/index';

const wowzaCLient = axios.create({
  baseURL: 'https://api.cloud.wowza.com/api/v1.7/',
  timeout: 1000,
  headers: {
    'wsc-api-key': 'r7x0RKTg0Ttlkbtsv7iK0RGhU6rUIeHOlkI7bJ0rBGnWAKchS7aCudBEwiMw3416',
    'wsc-access-key': 'Vqi4r2JpRUfK1B6RUjfeNQ2sKS9QZ9Hwaadx32lXD9kcLxWlruYdEXWXDOQ23310',

    //'wsc-api-key': 'R4NcGEt9gkryz8bcNTOvxnfSjZYnL5PFQkutFbM0wN2J9exSMsdP9YHDZAuY3507',
    //'wsc-access-key': 'Hcp2AOg6mY8pnooePeDlrwzUb9EFQdwiICdjU6SkuOAXG2tsR4qMFbLfTivA352f',
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
    player_responsive: true,
  },
};

const createLiveStream = async () => {
  const res = await wowzaCLient.post('live_streams/', stream_config, { timeout: 10000 });
  return res.data && res.data.live_stream ? res.data.live_stream : null;
};

const getLiveStream = async (stream_id) => {
  if (!stream_id) return null;
  console.log('ejecutando', stream_id);
  const res = await wowzaCLient.get('live_streams/' + stream_id, { timeout: 5000 });
  console.log('ejecutando', res.data);
  return res.data && res.data.live_stream ? res.data.live_stream : null;
};

const getLiveStreamStatus = async (stream_id) => {
  const res = await wowzaCLient.get('live_streams/' + stream_id + '/state');

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const getLiveStreamStats = async (stream_id) => {
  const res = await wowzaCLient.get('live_streams/' + stream_id + '/stats', { timeout: 5000 });

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const ResetLiveStream = async (stream_id) => {
  const res = await wowzaCLient.put('live_streams/' + stream_id + '/reset', { timeout: 5000 });

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const startLiveStream = async (stream_id) => {
  const res = await wowzaCLient.put('live_streams/' + stream_id + '/start', { timeout: 5000 });

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const stopLiveStream = async (stream_id) => {
  const res = await wowzaCLient.put('live_streams/' + stream_id + '/stop', { timeout: 5000 });

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

export {
  getLiveStream,
  getLiveStreamStatus,
  getLiveStreamStats,
  ResetLiveStream,
  startLiveStream,
  stopLiveStream,
  createLiveStream,
};
