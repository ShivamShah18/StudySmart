from flask import Blueprint, jsonify
import time
from utils.tracker import HandTracker
timer_blueprint = Blueprint('timer', __name__)
from routes.detection import detection_state
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
    if not timer_data["running"]:
        timer_data["start_time"] = int(current_time())
        timer_data["running"] = True
    return jsonify({"message": "Timer started", "elapsed_time": timer_data["elapsed_time"]})

@timer_blueprint.route('/stop', methods=['POST'])
def stop_timer():
    if timer_data["running"]:
        timer_data["elapsed_time"] += int(current_time()) - timer_data["start_time"]
        timer_data["start_time"] = None
        timer_data["running"] = False
    return jsonify({"message": "Timer stopped", "elapsed_time": timer_data["elapsed_time"]})

@timer_blueprint.route('/time', methods=['GET'])
def get_time():
    if timer_data["running"]:
        current_elapsed = timer_data["elapsed_time"] + (int(current_time()) - timer_data["start_time"])
    else:
        current_elapsed = timer_data["elapsed_time"]
    return jsonify({"elapsed_time": current_elapsed})

@timer_blueprint.route('/reset', methods=['POST'])
def reset_detection_state():
    """Resets the detection state to default values."""
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
    get_time()

    return jsonify({"reset": "reseted vars"})
