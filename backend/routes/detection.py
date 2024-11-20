from flask import Blueprint, jsonify, request

detection_blueprint = Blueprint('detection', __name__)

# Shared state for detection results
detection_state = {
    "face_detected": False,
    "blink_count": 0,
    "hand_absent_count": 0,
    "session_score": 0,
    "sessionScoreList": [100, 100]
}

@detection_blueprint.route('/state', methods=['GET'])
def get_detection_state():
    return jsonify(detection_state)
