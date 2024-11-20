import React, { useEffect, useRef } from "react";

const VideoCapture = ({ onFrameSend }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Access the user's camera
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureAndSendFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          onFrameSend(blob);
        }
      }, "image/jpeg");
    }
  };

  useEffect(() => {
    const interval = setInterval(captureAndSendFrame, 200); // Send frame every 200ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VideoCapture;
