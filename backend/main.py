from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from models.blink_detector import BlinkDetector
from models.frame_analyzer import FrameAnalyzer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI()



# Initialize detectors
blink_detector = BlinkDetector()
frame_analyzer = FrameAnalyzer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin. Restrict this in production.
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

global blinks
blinks = 0




def webcam_stream():
    camera = cv2.VideoCapture(0)  # Open the webcam
    try:
        while True:
            success, frame = camera.read()
            if not success:
                break
            # Encode the frame in JPEG format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            # Yield the frame as part of the MJPEG stream
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    finally:
        camera.release()

@app.get("/webcam")
async def webcam():
    return StreamingResponse(webcam_stream(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.post("/process-frame/")
async def process_frame(file: UploadFile):
    global blinks
    # Read the uploaded frame
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        return JSONResponse({"error": "Invalid image data"}, status_code=400)

    # Analyze the frame for blinks and whether the person has left the frame
    if(blink_detector.detect_blink(frame)):
        blinks+=1

    left_frame = frame_analyzer.detect_exit(frame)

    return JSONResponse({
        "blinks": blinks,
        "left_frame": left_frame
    })
