from flask import Flask, Response, jsonify, send_file
import cv2
import numpy as np
import copy
import time
from flask_cors import CORS
import algo
import math
import os
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})



# Load Haar cascades for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_righteye_2splits.xml')

# Shared state for detection results
detection_state = {
    "face_detected": False,
    "blink_count": 0,
    "hand_absent_count": 0,
    "session_duration": 0,
    "session_score": 0
}

if os.getenv('LOCAL_ENV'):
    camera = cv2.VideoCapture(0)
else:
    camera = None

# Blink tracking variables
circle_detected = False

# Hand tracking class
class HandTracker:
    def __init__(self):
        self.bg_model = cv2.createBackgroundSubtractorMOG2(0, 50)
        self.kernel = np.ones((3, 3), np.uint8)
        self.hand_absent_detected = False
        self.last_time_checked = time.time()
        self.hand_count = 0

    def get_centroid(self, contour):
        moments = cv2.moments(contour)
        if moments["m00"] > 0:
            cx = int(moments["m10"] / moments["m00"])
            cy = int(moments["m01"] / moments["m00"])
            return (cx, cy)
        return None

    def track_hand_movement(self, frame):
        """Analyze the frame for hand presence or absence."""
        fgmask = self.bg_model.apply(frame)
        fgmask = cv2.erode(fgmask, self.kernel, iterations=1)
        img = cv2.bitwise_and(frame, frame, mask=fgmask)

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower = np.array([0, 48, 80], dtype="uint8")
        upper = np.array([20, 255, 255], dtype="uint8")
        skin_mask = cv2.inRange(hsv, lower, upper)

        contours, _ = cv2.findContours(copy.deepcopy(skin_mask), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            max_area = max(contours, key=cv2.contourArea)
            if cv2.contourArea(max_area) > 1000:  # Adjust threshold for hand size
                centroid = self.get_centroid(max_area)
                self.update_hand_absence(centroid)
                return

        # If no contours are found
        self.update_hand_absence(None)

    def update_hand_absence(self, centroid):
        """Update hand absence count based on the centroid."""
        current_time = time.time()
        if current_time - self.last_time_checked >= 1:  # Check every second
            self.last_time_checked = current_time
            if centroid is not None:
                if self.hand_absent_detected:
                    self.hand_absent_detected = False
            elif not self.hand_absent_detected:
                self.hand_count += 1
                self.hand_absent_detected = True


# Initialize the HandTracker
hand_tracker = HandTracker()


def analyze_frame(frame):
    """Analyze the frame for face, blink, and hand detections."""
    global circle_detected

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Face detection
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    detection_state["face_detected"] = len(faces) > 0

    # Blink detection
    eyes = eye_cascade.detectMultiScale(gray)
    circles_detected_in_frame = False

    for (ex, ey, ew, eh) in eyes:
        roi_gray = gray[ey:ey + eh, ex:ex + ew]
        roi_color = frame[ey:ey + eh, ex:ex + ew]
        circles = cv2.HoughCircles(
            roi_gray,
            cv2.HOUGH_GRADIENT,
            1,
            200,
            param1=200,
            param2=1,
            minRadius=0,
            maxRadius=0
        )
        if circles is not None:
            circles_detected_in_frame = True
            for i in circles[0, :]:
                cv2.circle(roi_color, (int(i[0]), int(i[1])), int(i[2]), (255, 255, 255), 2)
                cv2.circle(roi_color, (int(i[0]), int(i[1])), 2, (255, 255, 255), 3)

    if circles_detected_in_frame:
        if not circle_detected:
            detection_state["blink_count"] += 1
        circle_detected = True
    else:
        circle_detected = False

    # Hand absence detection
    hand_tracker.track_hand_movement(frame)
    detection_state["hand_absent_count"] = hand_tracker.hand_count
    detection_state["session_score"] = math.floor((algo.calculate_focus_score(detection_state["blink_count"], detection_state["hand_absent_count"])) * 100)


def gen_frames():
    """Video streaming generator function."""
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            analyze_frame(frame)

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/detection_state', methods=['GET'])
def get_detection_state():
    """API endpoint to return the current detection state."""
    return jsonify(detection_state)



@app.route('/update_variable', methods=['POST'])
def update_variable():
    global detection_state
    detection_state["face_detected"] = False
    detection_state["blink_count"] = 0
    detection_state["hand_absent_count"] = 0
    detection_state["session_duration"] = 0
    detection_state["session_score"] = 0
    return jsonify({'message': 'Variable updated successfully'})






@app.route('/api/focus-graph', methods=['GET'])
def get_focus_graph():
    # Example data
    session_duration = 100
    blink_count = 5
    hand_absent_count = 5

    # Generate the graph
    graph_stream = algo.plot_focus_graph(session_duration, blink_count, hand_absent_count)

    # Send the graph as a PNG image
    return send_file(graph_stream, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='localhost', port=10000, debug=True)

# Release the camera resource when the app stops
camera.release()
cv2.destroyAllWindows()

@app.route('/test-print', methods=['GET'])
def test_print():
    print("The /test-print endpoint was called!", flush=True)
    return "Print statement executed!", 200