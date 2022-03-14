import React, { Component } from 'react';
//custom
import { Button, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

const imageWidh = 1280;
const imageheigh = 960;

class CameraFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      hidden: true,
      hiddeVideo: false,
      stream: null
    };
  }
  /**
   * Processes available devices and identifies one by the label
   * @memberof CameraFeed
   * @instance
   */
  processDevices(devices) {
    devices.forEach((device) => {
      this.setDevice(device);
    });
  }

  /**
   * Sets the active device and starts playing the feed
   * @memberof CameraFeed
   * @instance
   */
  async setDevice(device) {
    const { deviceId } = device;
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
    this.videoPlayer.srcObject = this.stream;
    this.videoPlayer.play();
  }

  /**
   * On mount, grab the users connected devices and process them
   * @memberof CameraFeed
   * @instance
   * @override
   */
  async componentDidMount() {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    this.processDevices(cameras);
  }

  /**
   * Handles taking a still image from the video feed on the camera
   * @memberof CameraFeed
   * @instance
   */
  takePhoto = () => {
    const { sendFile, getImage } = this.props;
    const context = this.canvas.getContext('2d');
    context.drawImage(this.videoPlayer, 0, 0, imageWidh, imageheigh);
    this.canvas.toBlob(sendFile);
    let image = this.canvas.toDataURL();
    this.setState({ image, hidden: false, hiddeVideo: true });
    message.success('Imagen Salvada');

    //Detiene el stream del video
    this.videoPlayer.srcObject = null;
    this.stream.getTracks().forEach((track) => track.stop());
    getImage(image);
  };

  async clearImage() {
    await this.setState({ hidden: true, image: '' });

    message.error('Imagen Eliminada');
  }

  async renderingCode() {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    this.processDevices(cameras);
    this.setState({ hidden: true, image: '', hiddeVideo: false });
    this.forceUpdate();
  }
  render() {
    const { image, hidden, hide } = this.state;
    return (
      <div className='c-camera-feed' hidden={hide}>
        {/* camara */}

        {/* Desde que en el array no haya información la camara se muetra 
                de lo contrario se mostrara la imagen capturada. */}

        <div>
          <div className='c-camera-feed__viewer'>
            <video hidden={this.state.hiddeVideo} ref={(ref) => (this.videoPlayer = ref)} width='1280' heigh='960' />
          </div>
        </div>
        {/* Imagen capturada  */}
        <div className='c-camera-feed__stage'>
          <canvas
            style={{ maxWidth: '100%' }}
            width={imageWidh}
            height={imageheigh}
            hidden={hidden}
            ref={(ref) => (this.canvas = ref)}
          />
          <img alt='camara' width={imageWidh} height={imageheigh} id='getImage' hidden src={image} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            hidden={this.state.hiddeVideo}
            type='primary'
            size='large'
            style={{ display: 'block', margin: '20px auto' }}
            onClick={this.takePhoto}>
            <CameraOutlined style={{ fontSize: '2rem' }} />
          </Button>
          {this.state.image && (
            <Button
              onClick={() => {
                this.renderingCode();
              }}>
              Tomar Otra Foto
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default CameraFeed;
