import React from "react";

const WebcamComponent = () => {
  const webcamUrl = "http://localhost:8000/video_feed"; // Backend URL

  return (
    <div>
      <h1>Live Webcam Stream</h1>
      {/* Display the MJPEG stream */}
      <img
        src={webcamUrl}
        alt="Webcam Stream"
        style={{ width: "100%", maxWidth: "640px", height: "auto" }}
      />
    </div>
  );
};

export default WebcamComponent;
