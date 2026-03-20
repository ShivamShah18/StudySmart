from flask import Blueprint, Response, request, jsonify
from utils.tracker import HandTracker
from utils.analyzer import analyze_frame
import cv2
from routes.detection import detection_state
from algo.focus_algo import calculate_focus_score
import logging
import dlib
import numpy as np
from PIL import Image
import io

logger = logging.getLogger(__name__)

video_blueprint = Blueprint('video', __name__)

# Initialize models
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_righteye_2splits.xml')

# Load dlib predictor with error handling
try:
    predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")
except Exception as e:
    logger.warning(f"Shape predictor model not found: {e}")
    predictor = None

hand_tracker = HandTracker()

@video_blueprint.route('/process', methods=['POST'])
def process_frame():
    """Process a frame received from the frontend"""
    try:
        # Validate request
        if 'frame' not in request.files:
            logger.warning("No frame received in request")
            return jsonify({'error': 'No frame received'}), 400

        frame_file = request.files['frame']
        
        if frame_file.filename == '':
            logger.warning("Empty filename received")
            return jsonify({'error': 'No frame selected'}), 400

        try:
            frame = Image.open(frame_file.stream)
            frame = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return jsonify({'error': 'Failed to process image'}), 400

        # Check if predictor is available
        if predictor is None:
            logger.warning("Shape predictor not available, skipping frame analysis")
            return jsonify({'warning': 'Frame received but shape predictor unavailable'}), 202

        # Process the frame
        try:
            analyze_frame(
                frame, 
                hand_tracker, 
                detection_state, 
                face_cascade, 
                eye_cascade, 
                calculate_focus_score, 
                predictor
            )
            logger.debug("Frame processed successfully")
            return jsonify({'message': 'Frame processed successfully'}), 200
        except Exception as e:
            logger.error(f"Error analyzing frame: {str(e)}")
            return jsonify({'error': 'Failed to analyze frame'}), 500

    except Exception as e:
        logger.error(f"Unexpected error in process_frame: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500