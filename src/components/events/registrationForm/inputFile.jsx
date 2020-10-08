import React, { Component } from "react"
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Actions from "../../../helpers/request";

export default class InputFile extends Component {

    beforeUpload(file) {
        const isJpgOrPng = file.type === 'application/pdf';
        if (!isJpgOrPng) {
            message.error('You can only upload PDF file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
    }

    render() {
        const { eventId, handleChange } = this.props
        return (
            <Upload
                listType="picture"
                className="upload-list-inline"
                action={Actions.post(`/api/files/uploadbase/${eventId}`)}
                beforeUpload={this.beforeUpload}
                onChange={handleChange}
                beforeUpload={this.beforeUpload}
            >
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
        )
    }
}