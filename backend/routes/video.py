from flask import Blueprint, Response
from utils.tracker import HandTracker
from utils.analyzer import analyze_frame
import cv2
from routes.detection import detection_state
from algo.focus_algo import calculate_focus_score
import dlib

video_blueprint = Blueprint('video', __name__)
# Load Haar cascades for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_righteye_2splits.xml')
predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")
def gen_frames():
    """Video streaming generator."""
    camera = cv2.VideoCapture(0)
    hand_tracker = HandTracker()

    try:
        while True:
            success, frame = camera.read()
            if not success:
                break
            analyze_frame(frame, hand_tracker, detection_state,face_cascade, eye_cascade, calculate_focus_score,predictor)
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    finally:
        camera.release()

@video_blueprint.route('/feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
