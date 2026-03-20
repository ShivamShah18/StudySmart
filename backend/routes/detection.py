from flask import Blueprint, jsonify
import logging

logger = logging.getLogger(__name__)

detection_blueprint = Blueprint('detection', __name__)

# Shared state for detection results
detection_state = {
    "face_detected": False,
    "blink_detected": False,
    "blink_count": 0,
    "hand_absent_count": 0,
    "session_score": 0,
    "sessionScoreList": [100, 100]
}

@detection_blueprint.route('/state', methods=['GET'])
def get_detection_state():
    """Get current detection state"""
    try:
        return jsonify(detection_state), 200
    except Exception as e:
        logger.error(f"Error getting detection state: {str(e)}")
        return jsonify({"error": "Failed to get detection state"}), 500

@detection_blueprint.route('/state/reset', methods=['POST'])
def reset_detection_state():
    """Reset detection state to defaults"""
    try:
        global detection_state
        detection_state.update({
            "face_detected": False,
            "blink_detected": False,
            "blink_count": 0,
            "hand_absent_count": 0,
            "session_score": 0,
            "sessionScoreList": [100, 100]
        })
        logger.info("Detection state reset")
        return jsonify({
            "message": "Detection state reset successfully",
            "detection_state": detection_state
        }), 200
    except Exception as e:
        logger.error(f"Error resetting detection state: {str(e)}")
        return jsonify({"error": "Failed to reset detection state"}), 500
