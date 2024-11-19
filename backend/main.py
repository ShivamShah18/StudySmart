# main.py
import cv2
import numpy as np
from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
import threading
from starlette.middleware.cors import CORSMiddleware
import time
import mediapipe as mp

app = FastAPI()

# Allow CORS for all origins (modify as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global event counts
event_counts = {
    'phone_pickup_count': 0,
    'left_frame_count': 0,
    'unfocused_count': 0
}

# Lock for thread safety
lock = threading.Lock()

# Initialize video capture
cap = cv2.VideoCapture(0)

# Initialize MediaPipe face detection and face mesh
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5)

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True)

# Load class labels for COCO dataset
CLASSES = { 0: 'background', 1: 'person', 2: 'bicycle', 3: 'car', 4: 'motorcycle',
            5: 'airplane', 6: 'bus', 7: 'train', 8: 'truck', 9: 'boat',
            10: 'traffic light', 11: 'fire hydrant', 12: 'stop sign', 13: 'parking meter',
            14: 'bench', 15: 'bird', 16: 'cat', 17: 'dog', 18: 'horse', 19: 'sheep',
            20: 'cow', 21: 'elephant', 22: 'bear', 23: 'zebra', 24: 'giraffe',
            25: 'backpack', 26: 'umbrella', 27: 'handbag', 28: 'tie', 29: 'suitcase',
            30: 'frisbee', 31: 'skis', 32: 'snowboard', 33: 'sports ball', 34: 'kite',
            35: 'baseball bat', 36: 'baseball glove', 37: 'skateboard', 38: 'surfboard',
            39: 'tennis racket', 40: 'bottle', 41: 'wine glass', 42: 'cup', 43: 'fork',
            44: 'knife', 45: 'spoon', 46: 'bowl', 47: 'banana', 48: 'apple',
            49: 'sandwich', 50: 'orange', 51: 'broccoli', 52: 'carrot', 53: 'hot dog',
            54: 'pizza', 55: 'donut', 56: 'cake', 57: 'chair', 58: 'couch',
            59: 'potted plant', 60: 'bed', 61: 'dining table', 62: 'toilet',
            63: 'tv', 64: 'laptop', 65: 'mouse', 66: 'remote', 67: 'keyboard',
            68: 'cell phone', 69: 'microwave', 70: 'oven', 71: 'toaster',
            72: 'sink', 73: 'refrigerator', 74: 'book', 75: 'clock', 76: 'vase',
            77: 'scissors', 78: 'teddy bear', 79: 'hair drier', 80: 'toothbrush' }

# Load the pre-trained model for phone detection (SSD MobileNet V2 trained on COCO dataset)
net = cv2.dnn.readNetFromTensorflow('frozen_inference_graph.pb', 'ssd_mobilenet_v2_coco.pbtxt')

def gen_frames():
    last_face_check = 0
    face_in_frame = False

    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            current_time = time.time()
            # Only check for face every 1 second
            if current_time - last_face_check >= 1.0:
                last_face_check = current_time
                # Convert the image to RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                # Perform face detection
                results = face_detection.process(rgb_frame)
                if results.detections:
                    face_in_frame = True
                else:
                    face_in_frame = False
                    with lock:
                        event_counts['left_frame_count'] += 1

            if face_in_frame:
                # Convert the image to RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                # Perform face mesh to detect facial landmarks
                mesh_results = face_mesh.process(rgb_frame)
                if mesh_results.multi_face_landmarks:
                    # Get the landmarks
                    face_landmarks = mesh_results.multi_face_landmarks[0]
                    # Implement eye tracking logic
                    # Calculate the average position of left and right eyes
                    left_eye = [face_landmarks.landmark[i] for i in range(474, 478)]
                    right_eye = [face_landmarks.landmark[i] for i in range(469, 473)]
                    left_eye_coords = [(int(p.x * frame.shape[1]), int(p.y * frame.shape[0])) for p in left_eye]
                    right_eye_coords = [(int(p.x * frame.shape[1]), int(p.y * frame.shape[0])) for p in right_eye]
                    
                    # Placeholder for gaze estimation
                    # Here you would implement actual gaze estimation logic
                    # For simplicity, let's assume the person is focused if eyes are detected
                    # You can draw eyes on the frame for visualization
                    for point in left_eye_coords + right_eye_coords:
                        cv2.circle(frame, point, 2, (0, 255, 0), -1)
                else:
                    with lock:
                        event_counts['unfocused_count'] += 1

            # Perform phone detection
            # Prepare the frame for object detection
            blob = cv2.dnn.blobFromImage(frame, size=(300, 300), swapRB=True, crop=False)
            net.setInput(blob)
            detections = net.forward()

            for detection in detections[0,0]:
                score = float(detection[2])
                if score > 0.5:
                    class_id = int(detection[1])
                    label = CLASSES.get(class_id, 'Unknown')
                    if label == 'cell phone':
                        with lock:
                            event_counts['phone_pickup_count'] += 1
                        # Draw a bounding box around the detected phone
                        box = detection[3:7] * np.array([frame.shape[1], frame.shape[0],
                                                         frame.shape[1], frame.shape[0]])
                        (startX, startY, endX, endY) = box.astype("int")
                        cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 0, 255), 2)
                        cv2.putText(frame, label, (startX, startY - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                        break  # Assuming only one phone detection per frame

            # Encode frame to JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield frame in byte format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.get('/video_feed')
def video_feed():
    return StreamingResponse(gen_frames(), media_type='multipart/x-mixed-replace; boundary=frame')

@app.get('/event_counts')
def get_event_counts():
    with lock:
        return event_counts.copy()

# Clean up when shutting down
@app.on_event("shutdown")
def shutdown_event():
    cap.release()
