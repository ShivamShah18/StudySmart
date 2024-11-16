import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { sendFrame } from "./api";

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [results, setResults] = useState({});

  const captureAndSend = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    const response = await sendFrame(formData);
    setResults(response);
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
      <button onClick={captureAndSend}>Analyze Frame</button>
      <div>
        <h2>Results:</h2>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
};

export default WebcamComponent;
