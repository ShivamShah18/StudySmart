from flask import Blueprint, jsonify
import time
import logging
from utils.tracker import HandTracker
from routes.detection import detection_state

logger = logging.getLogger(__name__)

timer_blueprint = Blueprint('timer', __name__)

# Timer state
timer_data = {
    "start_time": None,
    "elapsed_time": 0,
    "running": False
}

def current_time():
    return time.time()

@timer_blueprint.route('/start', methods=['POST'])
def start_timer():
    """Start the focus timer"""
    try:
        if not timer_data["running"]:
            timer_data["start_time"] = int(current_time())
            timer_data["running"] = True
            logger.info("Timer started")
        return jsonify({
            "message": "Timer started",
            "elapsed_time": timer_data["elapsed_time"],
            "running": timer_data["running"]
        }), 200
    except Exception as e:
        logger.error(f"Error starting timer: {str(e)}")
        return jsonify({"error": "Failed to start timer"}), 500

@timer_blueprint.route('/stop', methods=['POST'])
def stop_timer():
    """Stop the focus timer"""
    try:
        if timer_data["running"]:
            timer_data["elapsed_time"] += int(current_time()) - timer_data["start_time"]
            timer_data["start_time"] = None
            timer_data["running"] = False
            logger.info(f"Timer stopped. Total elapsed: {timer_data['elapsed_time']}s")
        return jsonify({
            "message": "Timer stopped",
            "elapsed_time": timer_data["elapsed_time"],
            "running": timer_data["running"]
        }), 200
    except Exception as e:
        logger.error(f"Error stopping timer: {str(e)}")
        return jsonify({"error": "Failed to stop timer"}), 500

@timer_blueprint.route('/time', methods=['GET'])
def get_time():
    """Get current elapsed time"""
    try:
        if timer_data["running"]:
            current_elapsed = timer_data["elapsed_time"] + (int(current_time()) - timer_data["start_time"])
        else:
            current_elapsed = timer_data["elapsed_time"]
        return jsonify({
            "elapsed_time": current_elapsed,
            "running": timer_data["running"]
        }), 200
    except Exception as e:
        logger.error(f"Error getting time: {str(e)}")
        return jsonify({"error": "Failed to get time"}), 500

@timer_blueprint.route('/reset', methods=['POST'])
def reset_detection_state():
    """Resets the detection state and timer to default values"""
    try:
        global detection_state
        global timer_data
        
        detection_state.update({
            "face_detected": False,
            "blink_detected": False,
            "blink_count": 0,
            "hand_absent_count": 0,
            "session_score": 0,
            "sessionScoreList": [100, 100]
        })
        
        timer_data["start_time"] = None
        timer_data["elapsed_time"] = 0
        timer_data["running"] = False
        
        logger.info("Timer and detection state reset")
        return jsonify({
            "message": "Timer and detection state reset successfully",
            "timer_data": timer_data,
            "detection_state": detection_state
        }), 200
    except Exception as e:
        logger.error(f"Error resetting state: {str(e)}")
        return jsonify({"error": "Failed to reset state"}), 500
