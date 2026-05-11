import React, { useEffect, useRef, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const VideoCapture = ({ onFrameSend }) => {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const intervalRef = useRef(null);
  const [error, setError]               = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [resolution, setResolution]     = useState('');

  /* ── Start camera ─────────────────────────────────────────── */
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => setError('Failed to play video stream'));
          const { videoWidth: w, videoHeight: h } = videoRef.current;
          setResolution(`${w}×${h}`);
          setCameraActive(true);
          setError('');
        };
      } catch (err) {
        const msgs = {
          NotAllowedError: 'Camera access denied — please allow camera permissions.',
          NotFoundError:   'No camera detected — please connect a camera.',
          NotReadableError:'Camera is in use by another application.',
        };
        setError(msgs[err.name] || 'Unable to access camera.');
        setCameraActive(false);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ── Frame capture loop ───────────────────────────────────── */
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width  = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => blob && onFrameSend?.(blob), 'image/jpeg', 0.85);
    } catch (e) {
      console.error('Frame capture error:', e);
    }
  };

  useEffect(() => {
    if (!cameraActive) return;
    intervalRef.current = setInterval(captureFrame, 200);
    return () => clearInterval(intervalRef.current);
  }, [cameraActive, onFrameSend]);

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div>
      {error && <div className="error-banner">⚠&nbsp; {error}</div>}

      <div className="camera" style={{ position: 'relative', display: 'block' }}>
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-md)' }}
              aria-label="Live camera feed"
              muted
              playsInline
            />
            <div className="live-badge">
              <span className="live-dot" />
              Live
            </div>
          </>
        ) : (
          <div className="camera-unavailable">
            <span className="cam-icon">📷</span>
            <span>No feed available</span>
          </div>
        )}
        {/* Corner brackets overlay */}
        <div className="camera-overlay" />
      </div>

      <div className="camera-status-bar">
        <span style={{ color: cameraActive ? 'var(--success)' : 'var(--text-muted)' }}>
          {cameraActive ? '● ACTIVE' : '○ OFFLINE'}
        </span>
        <span>{cameraActive ? `${resolution} · 5fps` : '—'}</span>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VideoCapture;