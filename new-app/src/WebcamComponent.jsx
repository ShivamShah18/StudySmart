import React from 'react';
import Webcam from "react-webcam";

const WebcamComponent = () => {
    const webcamRef = React.useRef(null);

    // Optional: Capture screenshot
    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc);
        },
        [webcamRef]
    );

    return (
        <>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                }}
            />
            <button onClick={capture}>Capture photo</button>
        </>
    );
};

export default WebcamComponent;
