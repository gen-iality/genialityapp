import React, { Component } from 'react';
import { saveFirebase } from './helpers'
import { toast } from "react-toastify";
//custom
import { Button } from 'antd';
import { CameraOutlined, DeleteOutlined } from '@ant-design/icons';

class CameraFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            hidden: true,
            hiddeVideo: false
        }
    }
    /**
     * Processes available devices and identifies one by the label
     * @memberof CameraFeed
     * @instance
     */
    processDevices(devices) {
        devices.forEach(device => {
            console.log(device.label);
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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
        this.videoPlayer.srcObject = stream;
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
        const { sendFile } = this.props;
        const context = this.canvas.getContext('2d');
        context.drawImage(this.videoPlayer, 0, 0, 680, 360);
        this.canvas.toBlob(sendFile);
        let image = this.canvas.toDataURL()
        this.setState({ image, hidden: false, hiddeVideo: true })
        toast.success("Imagen Salvada")
    };

    async clearImage() {
        console.log(this.props.sendFile)
        await this.setState({ hidden: true, image: "" })
        console.log(this.state.hidden, this.state.image)
        toast.error("Imagen Eliminada")
    }

    renderingCode() {
        this.setState({ hidden: true, image: "", hiddeVideo: false })
        this.forceUpdate()
    }
    render() {
        const { image, hidden, hide } = this.state
        return (
            <div className="c-camera-feed" hidden={hide}>

                {/* camara */}

                {/* Desde que en el array no haya información la camara se muetra 
                de lo contrario se mostrara la imagen capturada. */}

                <div>
                    <div className="c-camera-feed__viewer">
                        <video
                            hidden={this.state.hiddeVideo}
                            ref={ref => (this.videoPlayer = ref)}
                            width="680"
                            heigh="360"
                        />
                    </div>

                    <Button
                        hidden={this.state.hiddeVideo}
                        type="primary"
                        size="large"
                        style={{ display: "block", margin: "20px auto" }}
                        onClick={this.takePhoto}
                    >
                        <CameraOutlined style={{ fontSize: "2rem" }} />
                    </Button>
                    {
                        this.state.image === "" ? <div></div> :
                            <div>
                                <Button onClick={() => { this.renderingCode() }}>Tomar Otra Foto</Button>
                            </div>
                    }

                </div>
                {/* Imagen capturada  */}
                <div className="c-camera-feed__stage">
                    <canvas width="470" height="360" hidden={hidden} ref={ref => (this.canvas = ref)} />
                    <img width="470" height="360" id="getImage" hidden src={image} />
                </div>
            </div>
        );
    }
}

export default CameraFeed