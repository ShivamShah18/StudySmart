from flask import Blueprint, Response
from utils.tracker import HandTracker
from utils.analyzer import analyze_frame
import cv2
from routes.detection import detection_state
from algo.focus_algo import calculate_focus_score
import dlib





from flask import request, jsonify
import numpy as np
import cv2
from PIL import Image
import io

video_blueprint = Blueprint('video', __name__)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_righteye_2splits.xml')
predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")
hand_tracker = HandTracker()

@video_blueprint.route('/process', methods=['POST'])
def process_frame():
    hand_tracker = HandTracker()

    """Process a frame received from the frontend."""
    if 'frame' not in request.files:
        return jsonify({'error': 'No frame received'}), 400

    frame_file = request.files['frame']
    frame = Image.open(frame_file.stream)
    frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)

    # Process the frame
    analyze_frame(frame, hand_tracker, detection_state,face_cascade, eye_cascade, calculate_focus_score,predictor)

    # Optionally return some result to the frontend
    return jsonify({'message': 'Frame processed successfully'})