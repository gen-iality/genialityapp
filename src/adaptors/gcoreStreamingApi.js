import axios from 'axios/index';

const gCoreCLient = axios.create({
  //BASE URL WOWZA
  //baseURL: "https://api.cloud.wowza.com/api/v1.7/",
  baseURL: 'https://api.gcdn.co/vp/api',
  timeout: 2000,
  headers: {
    Authorization:
      'APIKey 1203$1032b84618ac0c687a026a037185e55c6930e0c006783a9d86b211f2114644c1a16836c730f4934df8559bc31952228999f371a694e788aeab756b2d0e253f45',
  },
});

const createLiveStream = async (activity_name) => {
  const stream_config = {
    name: activity_name,
    active: false,
  };

  const res = await gCoreCLient.post('streams/', stream_config, {
    timeout: 10000,
  });
  return res.data ? res.data : null;
};

const getLiveStream = async (stream_id) => {
  if (!stream_id) return null;
  console.log('ejecutando', stream_id);
  const res = await gCoreCLient.get('streams/' + stream_id, {
    timeout: 5000,
  });
  console.log('ejecutando', res.data);
  return res.data ? res.data : null;
};

const getLiveStreamStatus = async (stream_id) => {
  const res = await gCoreCLient.get('streams/' + stream_id);
  console.log('10. RESPUESTA ACA===>', res);
  return res.data ? res.data : null;
};

const getLiveStreamConnected = async (stream_id) => {
  const res = await gCoreCLient.get('streams/' + stream_id);
  return res.data ? res.data.live : null;
};

const ResetLiveStream = async (stream_id) => {
  const res = await gCoreCLient.put('live_streams/' + stream_id + '/reset', {
    timeout: 5000,
  });

  if (res.data && res.data.live_stream) {
    return res.data.live_stream;
  }

  return null;
};

const startLiveStream = async (stream_id) => {
  const res = await gCoreCLient.put('streams/' + stream_id, {
    active: true,
  });
  console.log('RESPUESTA START===>', res);
  return res.data ? res.data : null;
};

const stopLiveStream = async (stream_id) => {
  const res = await gCoreCLient.put('streams/' + stream_id, {
    active: false,
  });
  console.log('RESPUESTA STOP===>', res);
  return res.data ? res.data : null;
};
const deleteLiveStream = async (stream_id) => {
  const res = await gCoreCLient.delete('streams/' + stream_id, {
    timeout: 5000,
  });

  if (res?.status === 204) {
    return 'LiveStream deleted';
  }

  return null;
};

export {
  getLiveStream,
  getLiveStreamStatus,
  getLiveStreamConnected,
  ResetLiveStream,
  startLiveStream,
  stopLiveStream,
  createLiveStream,
  deleteLiveStream,
};