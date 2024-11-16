from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import cv2
import numpy as np
from models.blink_detector import BlinkDetector
from models.phone_detector import PhoneDetector
from models.frame_analyzer import FrameAnalyzer

app = FastAPI()

blink_detector = BlinkDetector()
phone_detector = PhoneDetector()
frame_analyzer = FrameAnalyzer()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin. Restrict this in production.
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/process-frame/")
async def process_frame(file: UploadFile):
    print("hi")
    # Read the uploaded frame
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Analyze the frame
    blinks = blink_detector.detect(frame)
    phone_usage = phone_detector.detect(frame)
    left_frame = frame_analyzer.detect_exit(frame)

    return JSONResponse({
        "blinks": blinks,
        "phone_usage": phone_usage,
        "left_frame": left_frame
    })
