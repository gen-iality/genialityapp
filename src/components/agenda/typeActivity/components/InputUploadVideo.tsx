import { Result, Upload } from 'antd'
import React from 'react'
import FileVideoOutlineIcon from '@2fd/ant-design-icons/lib/FileVideoOutline'

const InputUploadVideo = () => {
    return (
        <Upload.Dragger maxCount={1} accept='video/*'>
            <Result
                icon={<FileVideoOutlineIcon />}
                title='Haga clic o arrastre el video a esta área para cargarlo'
                subTitle='Solamente ogm, wmv, mpg, webm, ogv, mov, asx, mpeg, mp4, m4v y avi  ' />
        </Upload.Dragger>
    )
}

export default InputUploadVideo