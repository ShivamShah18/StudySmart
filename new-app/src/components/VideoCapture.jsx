import React, { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const VideoCapture = ({ onFrameSend }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Access the user's camera
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
              console.error("Error playing video:", err);
              setError("Failed to play video stream");
            });
          };
          setCameraActive(true);
          setError('');
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
        let errorMessage = "Unable to access camera";
        
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera permission denied. Please enable camera access.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found. Please connect a camera.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera is already in use by another application.";
        }
        
        setError(errorMessage);
        setCameraActive(false);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        setCameraActive(false);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const captureAndSendFrame = async () => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      try {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob && onFrameSend) {
            onFrameSend(blob);
          }
        }, "image/jpeg", 0.85);
      } catch (err) {
        console.error("Error capturing or sending frame:", err);
      }
    }
  };

  useEffect(() => {
    if (cameraActive) {
      intervalRef.current = setInterval(captureAndSendFrame, 200);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cameraActive, onFrameSend]);

  return (
    <div className="video-capture-container">
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {cameraActive ? (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <video 
            ref={videoRef} 
            style={{ 
              width: "100%", 
              height: "auto",
              backgroundColor: '#000',
              borderRadius: '4px'
            }}
            aria-label="Camera feed"
          />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#0f0',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            🔴 Recording...
          </div>
        </div>
      ) : (
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: '#333',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '14px'
        }}>
          Camera not available
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VideoCapture;
