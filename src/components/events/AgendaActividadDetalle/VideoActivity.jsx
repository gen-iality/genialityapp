import React, { useContext } from 'react'
import ReactPlayer from 'react-player'
import HelperContext from '../../../Context/HelperContext';

export const VideoActivity = () => {

    let { currentActivity } = useContext(HelperContext);
    return (
        <ReactPlayer
            width={"100%"}
            style={{
                display: "block",
                margin: "0 auto",
            }}
            url={currentActivity && currentActivity?.video}
            controls
        />
    )
}
