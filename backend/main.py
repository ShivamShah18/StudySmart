from flask import Flask, Response, jsonify
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize the webcam
camera = cv2.VideoCapture(0)

# Load Haar cascades for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_righteye_2splits.xml')

# Shared state for detection results
detection_state = {
    "face_detected": False,
    "blink_count": 0,
}

# Track the state for blink detection
circle_detected = False  # Tracks if a circle (pupil) was detected in the previous frame


def analyze_frame(frame):
    """Analyze the frame for multiple detections and update state."""
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

    if circles_detected_in_frame:
        if not circle_detected:
            detection_state["blink_count"] += 1
        circle_detected = True
    else:
        circle_detected = False


def gen_frames():
    """Video streaming generator function."""
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Analyze the frame for all detections
            analyze_frame(frame)

            # Encode the frame in JPEG format
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


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

# Release the camera resource when the app stops
camera.release()
cv2.destroyAllWindows()
