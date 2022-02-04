import React, { useContext } from 'react'
import ReactPlayer from 'react-player'
import HelperContext from '../../../Context/HelperContext';

export const SecondVideoActivity = () => {

    let {currentActivity} = useContext(HelperContext);
    return (
        <div className="column is-centered mediaplayer">
            <strong>Pt. 2</strong>
            <ReactPlayer
                width={"100%"}
                style={{
                    display: "block",
                    margin: "0 auto",
                }}
                url={
                    currentActivity && currentActivity?.secondvideo
                }
                controls
            />
        </div>
    )
}
