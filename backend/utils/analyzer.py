import numpy as np
from scipy.spatial import distance as dist
import dlib
import cv2
import math
def calculate_ear(eye):
    """Calculate the Eye Aspect Ratio (EAR)."""
    A = dist.euclidean(eye[1], eye[5])  # Vertical distances
    B = dist.euclidean(eye[2], eye[4])  # Vertical distances
    C = dist.euclidean(eye[0], eye[3])  # Horizontal distance
    return (A + B) / (2.0 * C)

def analyze_frame(frame, hand_tracker, detection_state, face_cascade, eye_cascade, calculate_focus_score, predictor, blink_threshold=0.2):
    """
    Analyze the frame for face detection, blink detection, and hand movement.
    
    Args:
        frame (numpy.ndarray): The current video frame.
        hand_tracker (HandTracker): Instance of the HandTracker class.
        detection_state (dict): Shared state for detection results.
        face_cascade (cv2.CascadeClassifier): Haar cascade for face detection.
        eye_cascade (cv2.CascadeClassifier): Haar cascade for eye detection.
        calculate_focus_score (function): Function to calculate the focus score.
        predictor (dlib.shape_predictor): Shape predictor for facial landmarks.
        blink_threshold (float): EAR threshold for blink detection.
    """
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Face detection
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )
    detection_state["face_detected"] = len(faces) > 0

    for (x, y, w, h) in faces:
        rect = dlib.rectangle(int(x), int(y), int(x + w), int(y + h))
        shape = predictor(gray, rect)
        shape = np.array([[p.x, p.y] for p in shape.parts()])

        # Extract eye landmarks
        left_eye = shape[36:42]
        right_eye = shape[42:48]

        # Calculate EAR for both eyes
        left_ear = calculate_ear(left_eye)
        right_ear = calculate_ear(right_eye)
        ear = (left_ear + right_ear) / 2.0

        # Check for blink
        if ear < blink_threshold:
            if not detection_state["blink_detected"]:
                detection_state["blink_count"] += 1
            detection_state["blink_detected"] = True
        else:
            detection_state["blink_detected"] = False

    # Hand absence detection
    hand_tracker.track_hand_movement(frame)
    detection_state["hand_absent_count"] = hand_tracker.hand_count

    # Update session score every 5 seconds
    detection_state["session_score"] = math.floor(
        calculate_focus_score(
            detection_state["blink_count"], detection_state["hand_absent_count"]
        ) * 100
    )

    if detection_state.get("session_duration", 0) % 5 == 0:
        detection_state["sessionScoreList"].append(detection_state["session_score"])